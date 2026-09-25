"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Globe, Package, Sparkles, BookOpen } from "lucide-react";
import { cartStorage, formatCurrency, productsAPI } from "../../lib/api";
import { autoDetectCurrency, getCurrencySymbol, getCurrencyName } from "../../lib/geolocation";
import { safeGetItem } from "../../lib/storage";
import { useSession } from "../../hooks/useSession";
import Navigation from "../../components/Navigation";
import ShopBreadcrumb from "../../components/ShopBreadcrumb";
import Footer from "../../components/Footer";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState({});
  const [currency, setCurrency] = useState('eur');
  const [loading, setLoading] = useState(true);
  const [detectedCountry, setDetectedCountry] = useState('');

  // Session tracking
  const { session, preferences, track } = useSession();

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
      const country = safeGetItem('nahiara_country_name', '');
      setDetectedCountry(country);
    } catch (error) {
      console.error('Error detecting currency:', error);
      const savedCurrency = safeGetItem('nahiara_currency', 'eur');
      setCurrency(savedCurrency);
    }
  };


  const loadCart = async () => {
    const cartItems = cartStorage.get();
    setCart(cartItems);
    const savedCurrency = safeGetItem('nahiara_currency', 'eur');
    setCurrency(savedCurrency);

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
    <div className="bg-white rounded-2xl p-6 animate-pulse">
      <div className="flex gap-4">
        <div className="w-24 h-32 bg-gray-200 rounded-xl"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-2/3 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">

        <Navigation />
        <div className="pt-32 pb-16 px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Discover our enchanting collection of books and start your journey.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Browse Collection
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      <Navigation />
      
      {/* Location & Currency - Top Right */}
      {detectedCountry && (
        <div className="fixed top-20 right-4 z-40">
          <div className="flex items-center gap-2 text-xs text-gray-700 bg-white/80 backdrop-blur-md px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
            <Globe className="w-4 h-4 text-emerald-600" />
            <div className="flex flex-col">
              <span className="font-medium">{detectedCountry}</span>
              <span className="text-[10px] text-gray-500">
                {getCurrencySymbol(currency)} {getCurrencyName(currency)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="pt-24 pb-16 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb Navigation */}
          <ShopBreadcrumb />
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Shopping Cart
            </h1>
            <p className="text-gray-600">
              {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cart.map((item, index) => {
                  const product = products[item.product_id];
                  const price = getItemPrice(item);
                  const total = price * item.quantity;

                  return (
                    <motion.div
                      key={`${item.product_id}-${item.is_digital}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-24 h-32 bg-gradient-to-br from-slate-100 via-emerald-50 to-cyan-50 rounded-xl flex-shrink-0 overflow-hidden">
                          {item.product_image ? (
                            <Image
                              src={item.product_image}
                              alt={item.product_name}
                              fill
                              className="object-cover rounded-xl"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <BookOpen className="w-10 h-10 text-emerald-400" />
                            </div>
                          )}
                          {/* Book spine effect */}
                          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/10 to-transparent" />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 truncate">{item.product_name}</h3>
                              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md mt-1 ${
                                item.is_digital 
                                  ? 'bg-cyan-100 text-cyan-700' 
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                {item.is_digital ? (
                                  <>
                                    <Sparkles className="w-3 h-3" />
                                    Digital
                                  </>
                                ) : (
                                  <>
                                    <Package className="w-3 h-3" />
                                    Physical
                                  </>
                                )}
                              </span>
                            </div>
                            <button
                              onClick={() => removeItem(item.product_id, item.is_digital)}
                              className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-end justify-between mt-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                              <button
                                onClick={() => updateQuantity(item.product_id, item.is_digital, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white transition-all"
                              >
                                <Minus className="w-4 h-4 text-gray-600" />
                              </button>
                              <span className="w-10 text-center font-semibold text-gray-900">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product_id, item.is_digital, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white transition-all"
                              >
                                <Plus className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="text-sm text-gray-500">{formatCurrency(price, currency)} each</p>
                              <p className="text-lg font-bold text-gray-900">
                                {formatCurrency(total, currency)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">{formatCurrency(getTotal(), currency)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-medium">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-gray-900">{formatCurrency(getTotal(), currency)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link
                    href="/shop"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Continue Shopping
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      Secure Checkout
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                      Free Returns
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
