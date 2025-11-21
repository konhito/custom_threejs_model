"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Book, Gamepad2, Download, Plus, Globe, CheckCircle, Sparkles, Gift } from "lucide-react";
import { productsAPI, cartStorage, formatCurrency } from "../../lib/api";
import { autoDetectCurrency, getCurrencySymbol, getCurrencyName } from "../../lib/geolocation";
import { useSession } from "../../hooks/useSession";
import Navigation from "../../components/Navigation";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('eur');
  const [cart, setCart] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(true);
  const [detectedCountry, setDetectedCountry] = useState('');
  const [stars, setStars] = useState([]);
  const starIdRef = useRef(0);
  const lastStarTime = useRef(0);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const isMouseMoving = useRef(false);
  const mouseStopTimeout = useRef(null);
  
  // Session tracking
  const { session, preferences, track, updatePreferences } = useSession();

  // Optimized Christmas cursor trail effect - only when mouse moves
  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = Date.now();
      const currentX = e.clientX;
      const currentY = e.clientY;
      
      // Calculate distance moved
      const distX = currentX - lastMousePos.current.x;
      const distY = currentY - lastMousePos.current.y;
      const distance = Math.sqrt(distX * distX + distY * distY);
      
      // Only create star if mouse moved at least 5 pixels and enough time has passed
      if (distance > 5 && now - lastStarTime.current >= 150) {
        lastStarTime.current = now;
        
        const newStar = {
          id: starIdRef.current++,
          x: currentX,
          y: currentY,
          size: Math.random() * 15 + 8,
          opacity: 1,
          rotation: Math.random() * 360,
        };
        
        setStars(prev => {
          // Limit to max 8 stars at once for performance
          const updated = [...prev, newStar];
          return updated.length > 8 ? updated.slice(-8) : updated;
        });
        
        // Remove star after animation with smooth fade
        setTimeout(() => {
          setStars(prev => prev.filter(star => star.id !== newStar.id));
        }, 1200);
        
        lastMousePos.current = { x: currentX, y: currentY };
      }
      
      // Update mouse moving state
      isMouseMoving.current = true;
      
      // Clear previous timeout
      if (mouseStopTimeout.current) {
        clearTimeout(mouseStopTimeout.current);
      }
      
      // Set timeout to detect when mouse stops
      mouseStopTimeout.current = setTimeout(() => {
        isMouseMoving.current = false;
      }, 100);
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
    loadProducts();
    setCart(cartStorage.get());
  }, []);
  
  // Track shop view when session is ready
  useEffect(() => {
    if (session?.tracking_enabled) {
      track('shop_view');
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
    setDetectingLocation(true);
    try {
      const detectedCurrency = await autoDetectCurrency();
      setCurrency(detectedCurrency);
      const country = localStorage.getItem('nahiara_country_name') || '';
      setDetectedCountry(country);
    } catch (error) {
      console.error('Error detecting currency:', error);
      const savedCurrency = localStorage.getItem('nahiara_currency') || 'eur';
      setCurrency(savedCurrency);
    } finally {
      setDetectingLocation(false);
    }
  };


  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      
      if (response.success && response.data) {
        // Filter out invalid products
        const validProducts = response.data.filter(product => {
          return product && product.id && product.name && 
                 (product.price_eur || product.price_usd);
        });
        setProducts(validProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, isDigital = false) => {
    try {
      // Validate product
      if (!product || !product.id || !product.name) {
        console.error('Invalid product data');
        return;
      }
      
      // Validate price
      const price = product.price_eur || product.price_usd || 0;
      if (price <= 0) {
        console.error('Invalid product price');
        return;
      }
      
      // Check stock for physical products
      if (!isDigital && product.stock_quantity !== undefined && product.stock_quantity <= 0) {
        console.error('Product out of stock');
        return;
      }
      
      cartStorage.add(product, 1, isDigital);
      setCart(cartStorage.get());
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      
      // Track activity
      track('add_to_cart', {
        product_id: product.id,
        product_name: product.name,
        is_digital: isDigital,
        quantity: 1,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  
  const handleCurrencyChange = async (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('nahiara_currency', newCurrency);
    
    // Update session preferences
    if (updatePreferences) {
      await updatePreferences({ currency: newCurrency });
    }
    
    // Track activity
    track('currency_change', { currency: newCurrency });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Skeleton loader component
  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-red-100 animate-pulse">
      <div className="h-64 bg-gradient-to-br from-red-100 via-amber-50 to-green-100"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50 to-green-50 relative overflow-hidden">
      {/* Light Snow Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Very Light Snowflakes */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-snow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                fontSize: `${Math.random() * 12 + 6}px`,
                color: 'rgba(255, 255, 255, 0.4)',
                textShadow: '0 0 3px rgba(255, 255, 255, 0.3)',
                animationDuration: `${Math.random() * 15 + 15}s`,
                animationDelay: `${Math.random() * 8}s`,
              }}
            >
              ❄
            </div>
          ))}
        </div>
        
        {/* Subtle Christmas Lights - Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-3 flex justify-around opacity-60">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{
                backgroundColor: ['#ef4444', '#10b981', '#fbbf24'][i % 3],
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s',
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </div>

      {/* Cursor Trail Stars */}
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
                filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.9)) drop-shadow(0 0 20px rgba(251, 191, 36, 0.5))',
                transform: `rotate(${star.rotation}deg)`,
                transition: 'all 0.3s ease-out',
              }} 
            />
          </div>
        ))}
      </div>

      <Navigation />
      
      {/* Location & Currency - Top Right */}
      <div className="fixed top-4 right-8 z-40">
        {detectingLocation ? (
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border-2 border-amber-300 shadow-lg">
            <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Detecting...</span>
          </div>
        ) : (
          detectedCountry && (
            <div className="flex items-center gap-1.5 text-xs text-gray-700 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border-2 border-amber-300 shadow-lg">
              <Globe className="w-3.5 h-3.5 text-red-600" />
              <div className="flex flex-col">
                <span className="font-medium">Detected: {detectedCountry}</span>
                <span className="text-[10px] text-gray-500">
                  Currency: {getCurrencySymbol(currency)} {getCurrencyName(currency)}
                </span>
              </div>
            </div>
          )
        )}
      </div>

      {/* Header */}
      <div className="pt-20 pb-12 px-4 relative">
        <div className="max-w-7xl mx-auto text-center">
          {/* Christmas Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-green-600 text-white px-6 py-2 rounded-full mb-4 shadow-xl animate-bounce">
            <Gift className="w-5 h-5" />
            <span className="font-bold text-sm">🎄 Holiday Special Collection 🎄</span>
            <Sparkles className="w-5 h-5" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-600 via-amber-500 to-green-600 bg-clip-text text-transparent drop-shadow-lg" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Nahiara Holiday Store
          </h1>
          <p className="text-lg text-gray-800 mb-8 max-w-2xl mx-auto font-medium">
            ✨ Discover our magical collection of books and card games celebrating nature's beauty ✨
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
            // Get price based on currency
            const priceField = `price_${currency}`;
            const digitalPriceField = `digital_price_${currency}`;
            const price = product[priceField] || product.price_eur || product.price_usd || 0;
            const digitalPrice = product[digitalPriceField] || product.digital_price_eur || product.digital_price_usd || 0;
            const hasDigital = product.is_digital || (digitalPrice && digitalPrice > 0);
            
            // Skip products with no price set
            if (!price || price === 0) {
              console.warn('Product missing price:', product.name);
              return null;
            }

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-red-200 group relative"
                style={{
                  boxShadow: '0 10px 40px rgba(220, 38, 38, 0.1), 0 0 20px rgba(251, 191, 36, 0.1)',
                }}
              >
                {/* Christmas Sparkles */}
                <div className="absolute top-2 right-2 z-10">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
                
                {/* Product Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {product.stock_quantity > 50 && (
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                      ⭐ Bestseller
                    </span>
                  )}
                  {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                    <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full shadow-lg animate-bounce">
                      🔥 Limited Stock
                    </span>
                  )}
                </div>
                
                {/* Product Image */}
                <div className="relative h-64 bg-gradient-to-br from-red-100 via-amber-50 to-green-100 overflow-hidden">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {product.type === 'book' ? (
                        <Book className="w-24 h-24 text-red-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                      ) : (
                        <Gamepad2 className="w-24 h-24 text-green-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                      )}
                    </div>
                  )}
                  {/* Christmas overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 via-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Floating decorations */}
                  <div className="absolute top-2 left-2 text-2xl opacity-70 group-hover:opacity-100 transition-opacity">🎄</div>
                  <div className="absolute bottom-2 right-2 text-2xl opacity-70 group-hover:opacity-100 transition-opacity">🎁</div>
                </div>

                {/* Product Info */}
                <div className="p-6 bg-gradient-to-b from-white to-red-50/30">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      {product.name}
                    </h3>
                    {product.type === 'book' && (
                      <Book className="w-5 h-5 text-red-600 flex-shrink-0 ml-2" />
                    )}
                    {product.type === 'card_game' && (
                      <Gamepad2 className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                    )}
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-red-600 bg-clip-text text-transparent">
                        {formatCurrency(price, currency)}
                      </span>
                      {!product.is_digital && (
                        <span className="text-sm text-gray-500 px-2 py-0.5 bg-amber-100 rounded-full">📦 Physical</span>
                      )}
                    </div>
                    {hasDigital && !product.is_digital && (
                      <div className="mt-2 flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg">
                        <Download className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 font-semibold">
                          Digital: {formatCurrency(digitalPrice, currency)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Stock Info */}
                  {!product.is_digital && (
                    <div className="mb-4 flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                      {product.stock_quantity > 0 ? (
                        <>
                          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                          <p className="text-xs text-gray-700 font-semibold">
                            {product.stock_quantity > 50 
                              ? '✅ In Stock'
                              : product.stock_quantity > 10
                              ? `${product.stock_quantity} left`
                              : `⚡ Only ${product.stock_quantity} left!`
                            }
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                          <p className="text-xs text-red-600 font-semibold">❌ Out of Stock</p>
                        </>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    {!product.is_digital && product.stock_quantity > 0 && (
                      <button
                        onClick={() => handleAddToCart(product, false)}
                        className="w-full px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    )}
                    {hasDigital && (
                      <button
                        onClick={() => handleAddToCart(product, true)}
                        className="w-full px-4 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Add Digital</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-red-100 via-amber-50 to-green-100 rounded-full flex items-center justify-center animate-pulse border-4 border-amber-300">
                <Gift className="w-16 h-16 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-2">
                🎄 Coming Soon! 🎄
              </h3>
              <p className="text-gray-700 font-medium">We're preparing magical holiday gifts. Check back soon! ✨</p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Christmas Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-red-600 via-amber-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-fade-in border-2 border-amber-400 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center animate-bounce">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-lg flex items-center gap-2">
                🎉 Added to cart! 
                <Sparkles className="w-4 h-4 animate-pulse" />
              </p>
              <p className="text-sm text-white/90">Perfect gift choice! ✨</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Christmas Styles */}
      <style jsx>{`
        @keyframes snow {
          0% {
            transform: translateY(-10vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(110vh) translateX(50px) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes star-fade-smooth {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg) translateY(0);
          }
          20% {
            opacity: 1;
            transform: scale(1.2) rotate(72deg) translateY(-5px);
          }
          50% {
            opacity: 0.9;
            transform: scale(1) rotate(180deg) translateY(-8px);
          }
          80% {
            opacity: 0.4;
            transform: scale(0.8) rotate(288deg) translateY(-10px);
          }
          100% {
            opacity: 0;
            transform: scale(0) rotate(360deg) translateY(-15px);
          }
        }
        
        .animate-snow {
          animation: snow linear infinite;
          will-change: transform, opacity;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Smooth scrolling */
        * {
          scroll-behavior: smooth;
        }
        
        /* GPU acceleration for animations */
        .animate-star-fade,
        .animate-snow,
        .group:hover img,
        .group:hover svg {
          will-change: transform, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}

