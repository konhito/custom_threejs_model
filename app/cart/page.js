"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Globe, Sparkles, Gift } from "lucide-react";
import { cartStorage, formatCurrency, productsAPI } from "../../lib/api";
import { autoDetectCurrency, getCurrencySymbol, getCurrencyName } from "../../lib/geolocation";
import { useSession } from "../../hooks/useSession";
import Navigation from "../../components/Navigation";
import ShopBreadcrumb from "../../components/ShopBreadcrumb";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState({});
  const [currency, setCurrency] = useState('eur');
  const [loading, setLoading] = useState(true);
  const [detectedCountry, setDetectedCountry] = useState('');
  const [stars, setStars] = useState([]);
  const starIdRef = useRef(0);
  const lastStarTime = useRef(0);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const mouseStopTimeout = useRef(null);

  // Session tracking
  const { session, preferences, track } = useSession();

  // Christmas cursor trail effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = Date.now();
      const currentX = e.clientX;
      const currentY = e.clientY;
      
      const distX = currentX - lastMousePos.current.x;
      const distY = currentY - lastMousePos.current.y;
      const distance = Math.sqrt(distX * distX + distY * distY);
      
      if (distance > 5 && now - lastStarTime.current >= 150) {
        lastStarTime.current = now;
        
        const newStar = {
          id: starIdRef.current++,
          x: currentX,
          y: currentY,
          size: Math.random() * 15 + 8,
          rotation: Math.random() * 360,
        };
        
        setStars(prev => {
          const updated = [...prev, newStar];
          return updated.length > 8 ? updated.slice(-8) : updated;
        });
        
        setTimeout(() => {
          setStars(prev => prev.filter(star => star.id !== newStar.id));
        }, 1200);
        
        lastMousePos.current = { x: currentX, y: currentY };
      }
      
      if (mouseStopTimeout.current) {
        clearTimeout(mouseStopTimeout.current);
      }
      
      mouseStopTimeout.current = setTimeout(() => {}, 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseStopTimeout.current) {
        clearTimeout(mouseStopTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    initializeCurrency();
    loadCart();
  }, []);
  
  // Track cart view when session is ready
  useEffect(() => {
    if (session?.tracking_enabled) {
      track('cart_view');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);
  
  // Sync currency with session preferences
  useEffect(() => {
    if (preferences?.currency && preferences.currency !== currency) {
      setCurrency(preferences.currency);
    }
  }, [preferences]);

  const initializeCurrency = async () => {
    try {
      const detectedCurrency = await autoDetectCurrency();
      setCurrency(detectedCurrency);
      const country = localStorage.getItem('nahiara_country_name') || '';
      setDetectedCountry(country);
    } catch (error) {
      console.error('Error detecting currency:', error);
      const savedCurrency = localStorage.getItem('nahiara_currency') || 'eur';
      setCurrency(savedCurrency);
    }
  };


  const loadCart = async () => {
    const cartItems = cartStorage.get();
    setCart(cartItems);
    setCurrency(localStorage.getItem('nahiara_currency') || 'eur');

    // Load product details
    try {
      const response = await productsAPI.getAll();
      const productsMap = {};
      response.data.forEach(product => {
        productsMap[product.id] = product;
      });
      setProducts(productsMap);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (productId, isDigital, newQuantity) => {
    cartStorage.updateQuantity(productId, newQuantity, isDigital);
    setCart(cartStorage.get());
    
    // Track activity
    track('cart_update', {
      product_id: productId,
      is_digital: isDigital,
      quantity: newQuantity,
    });
  };

  const removeItem = (productId, isDigital) => {
    cartStorage.remove(productId, isDigital);
    setCart(cartStorage.get());
    
    // Track activity
    track('cart_remove', {
      product_id: productId,
      is_digital: isDigital,
    });
  };

  const getItemPrice = (item) => {
    const product = products[item.product_id];
    if (!product) return item.unit_price;
    
    // Get price based on currency
    const priceField = item.is_digital ? `digital_price_${currency}` : `price_${currency}`;
    const price = product[priceField];
    
    // Fallback to EUR or USD if currency price not available
    if (!price) {
      if (item.is_digital) {
        return product.digital_price_eur || product.digital_price_usd || item.unit_price;
      }
      return product.price_eur || product.price_usd || item.unit_price;
    }
    
    return parseFloat(price);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
      const price = getItemPrice(item);
      return total + (price * item.quantity);
    }, 0);
  };

  // Cart item skeleton
  const CartItemSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="flex gap-4">
        <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50 to-green-50 relative overflow-hidden">
        {/* Christmas Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white text-opacity-60 animate-snow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                fontSize: `${Math.random() * 20 + 10}px`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              ❄
            </div>
          ))}
        </div>

        {/* Cursor Stars */}
        <div className="fixed inset-0 pointer-events-none z-50">
          {stars.map(star => (
            <div
              key={star.id}
              className="absolute transition-all duration-300 ease-out"
              style={{
                left: star.x - star.size / 2,
                top: star.y - star.size / 2,
                width: star.size,
                height: star.size,
                animation: 'star-fade-smooth 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              }}
            >
              <Sparkles 
                className="text-amber-400" 
                style={{ 
                  width: '100%', 
                  height: '100%',
                  filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.9))',
                  transform: `rotate(${star.rotation}deg)`,
                }} 
              />
            </div>
          ))}
        </div>

        <Navigation />
        <div className="pt-32 pb-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="relative inline-block mb-6">
              <ShoppingCart className="w-24 h-24 text-red-300 mx-auto" />
              <Gift className="w-12 h-12 text-amber-500 absolute -top-2 -right-2 animate-bounce" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-4">
              🎄 Your Cart is Empty 🎄
            </h2>
            <p className="text-gray-700 mb-8 font-medium">Start your holiday shopping adventure!</p>
              <Link
                href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-green-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-green-700 transition-all shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Start Shopping
            </Link>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes snow {
            0% { transform: translateY(-10vh) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(110vh) translateX(100px); opacity: 0; }
          }
          @keyframes star-fade-smooth {
            0% { opacity: 0; transform: scale(0) rotate(0deg) translateY(0); }
            20% { opacity: 1; transform: scale(1.2) rotate(72deg) translateY(-5px); }
            50% { opacity: 0.9; transform: scale(1) rotate(180deg) translateY(-8px); }
            80% { opacity: 0.4; transform: scale(0.8) rotate(288deg) translateY(-10px); }
            100% { opacity: 0; transform: scale(0) rotate(360deg) translateY(-15px); }
          }
          .animate-snow { animation: snow linear infinite; will-change: transform, opacity; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50 to-green-50 relative overflow-hidden">
      {/* Christmas Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white text-opacity-60 animate-snow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* Cursor Stars */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {stars.map(star => (
          <div
            key={star.id}
            className="absolute transition-all duration-300 ease-out"
            style={{
              left: star.x - star.size / 2,
              top: star.y - star.size / 2,
              width: star.size,
              height: star.size,
              animation: 'star-fade-smooth 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            }}
          >
            <Sparkles 
              className="text-amber-400" 
              style={{ 
                width: '100%', 
                height: '100%',
                filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.9))',
                transform: `rotate(${star.rotation}deg)`,
              }} 
            />
          </div>
        ))}
      </div>

      <Navigation />
      
      {/* Location & Currency - Top Right */}
      <div className="fixed top-4 right-8 z-40">
        {detectedCountry && (
          <div className="flex items-center gap-1.5 text-xs text-gray-700 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border-2 border-amber-300 shadow-lg">
            <Globe className="w-3.5 h-3.5 text-red-600" />
            <div className="flex flex-col">
              <span className="font-medium">Detected: {detectedCountry}</span>
              <span className="text-[10px] text-gray-500">
                Currency: {getCurrencySymbol(currency)} {getCurrencyName(currency)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="pt-20 pb-16 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb Navigation */}
          <ShopBreadcrumb />
          
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 mb-2">
              <ShoppingCart className="w-8 h-8 text-red-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-amber-500 to-green-600 bg-clip-text text-transparent" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                🎁 Shopping Cart
              </h1>
            </div>
            <p className="text-gray-700 font-medium">{cart.length} {cart.length === 1 ? 'item' : 'items'} • Ready for checkout!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => {
                const product = products[item.product_id];
                const price = getItemPrice(item);
                const total = price * item.quantity;

                return (
                  <div
                    key={`${item.product_id}-${item.is_digital}-${index}`}
                    className="bg-white rounded-xl shadow-md p-6 border border-green-100 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 rounded-lg flex-shrink-0 overflow-hidden">
                        {item.product_image ? (
                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <ShoppingCart className="w-8 h-8 text-green-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-green-900/5 to-transparent"></div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{item.product_name}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.is_digital ? 'Digital Version' : 'Physical Version'}
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(price, currency)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.product_id, item.is_digital)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 mt-4">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.is_digital, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.is_digital, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-lg font-bold text-gray-900 mt-2">
                          {formatCurrency(total, currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100 sticky top-24 backdrop-blur-sm bg-white/95">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(getTotal(), currency)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Calculated at checkout</span>
                  </div>
                  <div className="border-t-2 border-green-200 pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-green-600">{formatCurrency(getTotal(), currency)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full block text-center px-6 py-3 bg-gradient-to-r from-red-600 to-green-600 text-white font-bold rounded-lg hover:from-red-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  🎁 Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/shop"
                  className="w-full block text-center mt-3 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-red-600 hover:text-red-600 hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Christmas Styles */}
      <style jsx>{`
        @keyframes snow {
          0% { transform: translateY(-10vh) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(110vh) translateX(100px); opacity: 0; }
        }
        @keyframes star-fade-smooth {
          0% { opacity: 0; transform: scale(0) rotate(0deg) translateY(0); }
          20% { opacity: 1; transform: scale(1.2) rotate(72deg) translateY(-5px); }
          50% { opacity: 0.9; transform: scale(1) rotate(180deg) translateY(-8px); }
          80% { opacity: 0.4; transform: scale(0.8) rotate(288deg) translateY(-10px); }
          100% { opacity: 0; transform: scale(0) rotate(360deg) translateY(-15px); }
        }
        .animate-snow { animation: snow linear infinite; will-change: transform, opacity; }
        * { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}

