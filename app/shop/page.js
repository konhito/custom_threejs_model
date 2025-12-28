"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Gamepad2, Download, Globe, CheckCircle, Sparkles, ArrowRight,Gift } from "lucide-react";
import { productsAPI, cartStorage, formatCurrency } from "../../lib/api";
import { autoDetectCurrency, getCurrencySymbol, getCurrencyName } from "../../lib/geolocation";
import { useSession } from "../../hooks/useSession";
import Navigation from "../../components/Navigation";
import ShopBreadcrumb from "../../components/ShopBreadcrumb";
import BookCard from "../../components/BookCard";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('eur');
  const [cart, setCart] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(true);
  const [detectedCountry, setDetectedCountry] = useState('');
  
  // Session tracking
  const { session, preferences, track, updatePreferences } = useSession();

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

  const getCartTotal = () => {
    let total = 0;
    cart.forEach(item => {
      const product = products.find(p => p.id === item.product_id);
      if (product) {
        const priceField = item.is_digital ? `digital_price_${currency}` : `price_${currency}`;
        const price = product[priceField] || 0;
        total += price * item.quantity;
      }
    });
    return total;
  };

  // Show all products including books
  const visibleProducts = products;

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-emerald-100/10 to-cyan-100/10 rounded-full blur-3xl" />
        
      </div>

      <Navigation />
      
      {/* Location & Currency - Top Right */}
      <div className="fixed top-20 right-4 z-40">
        {detectingLocation ? (
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-white/80 backdrop-blur-md px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
            <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Detecting location...</span>
          </div>
        ) : (
          detectedCountry && (
            <div className="flex items-center gap-2 text-xs text-gray-700 bg-white/80 backdrop-blur-md px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
              <Globe className="w-4 h-4 text-emerald-600" />
              <div className="flex flex-col">
                <span className="font-medium">{detectedCountry}</span>
                <span className="text-[10px] text-gray-500">
                  {getCurrencySymbol(currency)} {getCurrencyName(currency)}
                </span>
              </div>
            </div>
          )
        )}
      </div>

      {/* Header - Modern & Clean */}
      <div className="pt-24 pb-16 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Subtle badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">New Collection Available</span>
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 tracking-tight">
            Explore the{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
              Nahiara Universe
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover enchanting stories and games that celebrate the magic of nature and the wisdom of flowers.
          </p>
          
          {/* Stats/Features */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Free Shipping over €50</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
              <span>Digital Downloads Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4">
        <ShopBreadcrumb />
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
            {visibleProducts.map((product) => {
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

            // Use BookCard for book products
            if (product.type === 'book') {
              return (
                <BookCard
                  key={product.id}
                  product={product}
                  price={price}
                  digitalPrice={digitalPrice}
                  hasDigital={hasDigital}
                  currency={currency}
                  formatCurrency={formatCurrency}
                  onAddToCart={handleAddToCart}
                />
              );
            }

            // Default card for other product types (card games, etc.)
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
                      <Gamepad2 className="w-24 h-24 text-green-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
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
                    <Gamepad2 className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
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

        {!loading && visibleProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-red-100 via-amber-50 to-green-100 rounded-full flex items-center justify-center animate-pulse border-4 border-amber-300">
                <Gift className="w-16 h-16 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-2">
                🎄 Coming Soon! 🎄
              </h3>
              <p className="text-gray-700 font-medium">We&apos;re preparing magical holiday gifts. Check back soon! ✨</p>
            </div>
          </div>
        )}
      </div>

      {/* Modern Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-white text-gray-900 px-5 py-4 rounded-2xl shadow-2xl z-50 animate-fade-in border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Added to cart</p>
              <p className="text-sm text-gray-500">Continue shopping or checkout</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Summary - Modern */}
      {cartCount > 0 && !showNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <Link
            href="/cart"
            className="flex items-center gap-4 bg-gray-900 text-white px-5 py-3 rounded-full shadow-2xl hover:bg-gray-800 hover:scale-105 transition-all duration-300 group"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">{formatCurrency(getCartTotal(), currency)}</p>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
      
      {/* Modern Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

