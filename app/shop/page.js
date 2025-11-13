"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Book, Gamepad2, Download, Plus, Globe, CheckCircle } from "lucide-react";
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
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, isDigital = false) => {
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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100 animate-pulse">
      <div className="h-64 bg-gradient-to-br from-green-100 to-emerald-100"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      {/* Location & Currency - Top Right */}
      <div className="fixed top-4 right-8 z-40">
        {detectingLocation ? (
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-green-200 shadow-md">
            <div className="w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Detecting...</span>
          </div>
        ) : (
          detectedCountry && (
            <div className="flex items-center gap-1.5 text-xs text-gray-700 bg-white/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-green-200 shadow-md">
              <Globe className="w-3.5 h-3.5 text-green-600" />
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
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Nahiara Store
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Discover our collection of books and card games celebrating the world's most beautiful flowers
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
            const price = product[priceField] || product.price_eur || product.price_usd;
            const digitalPrice = product[digitalPriceField] || product.digital_price_eur || product.digital_price_usd;
            const hasDigital = product.is_digital || (digitalPrice && digitalPrice > 0);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-green-100 group relative"
              >
                {/* Product Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {product.stock_quantity > 50 && (
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                      Bestseller
                    </span>
                  )}
                  {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                    <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                      Limited Stock
                    </span>
                  )}
                </div>
                
                {/* Product Image */}
                <div className="relative h-64 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 overflow-hidden">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {product.type === 'book' ? (
                        <Book className="w-24 h-24 text-green-400 group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <Gamepad2 className="w-24 h-24 text-green-400 group-hover:scale-110 transition-transform duration-300" />
                      )}
                    </div>
                  )}
                  {/* Decorative floral overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      {product.name}
                    </h3>
                    {product.type === 'book' && (
                      <Book className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                    )}
                    {product.type === 'card_game' && (
                      <Gamepad2 className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(price, currency)}
                      </span>
                      {!product.is_digital && (
                        <span className="text-sm text-gray-500">Physical</span>
                      )}
                    </div>
                    {hasDigital && !product.is_digital && (
                      <div className="mt-2 flex items-center gap-2">
                        <Download className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">
                          Digital: {formatCurrency(digitalPrice, currency)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Stock Info */}
                  {!product.is_digital && (
                    <div className="mb-4 flex items-center gap-2">
                      {product.stock_quantity > 0 ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <p className="text-xs text-gray-600 font-medium">
                            {product.stock_quantity > 50 
                              ? 'In Stock'
                              : product.stock_quantity > 10
                              ? `${product.stock_quantity} left`
                              : `Only ${product.stock_quantity} left!`
                            }
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <p className="text-xs text-red-600 font-medium">Out of Stock</p>
                        </>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    {!product.is_digital && product.stock_quantity > 0 && (
                      <button
                        onClick={() => handleAddToCart(product, false)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                      >
                        <Plus className="w-4 h-4" />
                        Add Physical to Cart
                      </button>
                    )}
                    {hasDigital && (
                      <button
                        onClick={() => handleAddToCart(product, true)}
                        className="w-full px-4 py-2 border-2 border-green-600 text-green-600 font-medium rounded-lg hover:bg-green-50 hover:border-green-700 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                      >
                        <Download className="w-4 h-4" />
                        Add Digital to Cart
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
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                <Book className="w-16 h-16 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No products available</h3>
              <p className="text-gray-600">We're working on adding more amazing products. Check back soon!</p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-fade-in border border-green-400/20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">Item added to cart!</p>
              <p className="text-sm text-green-100">Continue shopping or checkout</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

