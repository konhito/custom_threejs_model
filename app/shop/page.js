"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Gamepad2,
  Download,
  Globe,
  CheckCircle,
  ArrowRight,
  Award,
  Eye,
  Package,
  Zap,
  Shield,
} from "lucide-react";
import { productsAPI, cartStorage, formatCurrency } from "../../lib/api";
import {
  autoDetectCurrency,
  getCurrencySymbol,
  getCurrencyName,
} from "../../lib/geolocation";
import { safeGetItem, safeSetItem } from "../../lib/storage";
import { useSession } from "../../hooks/useSession";
import Navigation from "../../components/Navigation";
import ShopBreadcrumb from "../../components/ShopBreadcrumb";
import BookCard from "../../components/BookCard";
import Footer from "../../components/Footer";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("eur");
  const [cart, setCart] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(true);
  const [detectedCountry, setDetectedCountry] = useState("");

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
      track("shop_view");
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
      const country = safeGetItem("nahiara_country_name", "");
      setDetectedCountry(country);
    } catch (error) {
      console.error("Error detecting currency:", error);
      const savedCurrency = safeGetItem("nahiara_currency", "eur");
      setCurrency(savedCurrency);
    } finally {
      setDetectingLocation(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll();

      if (response.success && response.data) {
        const validProducts = response.data.filter((product) => {
          return (
            product &&
            product.id &&
            product.name &&
            (product.price_eur || product.price_usd)
          );
        });
        setProducts(validProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, isDigital = false) => {
    try {
      if (!product || !product.id || !product.name) {
        console.error("Invalid product data");
        return;
      }

      const price = product.price_eur || product.price_usd || 0;
      if (price <= 0) {
        console.error("Invalid product price");
        return;
      }

      if (
        !isDigital &&
        product.stock_quantity !== undefined &&
        product.stock_quantity <= 0
      ) {
        console.error("Product out of stock");
        return;
      }

      cartStorage.add(product, 1, isDigital);
      setCart(cartStorage.get());
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);

      track("add_to_cart", {
        product_id: product.id,
        product_name: product.name,
        is_digital: isDigital,
        quantity: 1,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleCurrencyChange = async (newCurrency) => {
    setCurrency(newCurrency);
    safeSetItem("nahiara_currency", newCurrency);

    if (updatePreferences) {
      await updatePreferences({ currency: newCurrency });
    }

    track("currency_change", { currency: newCurrency });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getCartTotal = () => {
    let total = 0;
    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.product_id);
      if (product) {
        const priceField = item.is_digital
          ? `digital_price_${currency}`
          : `price_${currency}`;
        const price = product[priceField] || 0;
        total += price * item.quantity;
      }
    });
    return total;
  };

  const visibleProducts = products;

  // Skeleton loader
  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-80 bg-stone-100"></div>
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-100 rounded w-16"></div>
        <div className="h-5 bg-gray-100 rounded w-3/4"></div>
        <div className="h-4 bg-gray-100 rounded w-full"></div>
        <div className="h-11 bg-gray-100 rounded-xl mt-4"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white relative">
      <Navigation />

      {/* Location & Currency */}
      <div className="fixed top-20 right-4 z-40">
        {detectingLocation ? (
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-2 rounded-xl border border-gray-100 shadow-sm">
            <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Detecting...</span>
          </div>
        ) : (
          detectedCountry && (
            <div className="flex items-center gap-2 text-xs text-gray-600 bg-white px-3 py-2 rounded-xl border border-gray-100 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              <div className="flex flex-col">
                <span className="font-medium">{detectedCountry}</span>
                <span className="text-[10px] text-gray-400">
                  {getCurrencySymbol(currency)} {getCurrencyName(currency)}
                </span>
              </div>
            </div>
          )
        )}
      </div>

      {/* Hero Section — Editorial Style */}
      <div className="pt-28 pb-20 px-4 sm:px-6 relative">
        {/* Subtle warm gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-white to-white pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Overline */}
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400 mb-6">
            Nahiara Collection
          </p>

          {/* Main heading — editorial serif */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 text-gray-900 leading-[0.95] tracking-tight"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Stories That
            <br />
            <span className="italic font-normal">Bloom</span>
          </h1>

          {/* Divider */}
          <div className="w-12 h-px bg-gray-300 mx-auto mb-8" />

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed mb-12">
            Enchanting tales and games celebrating the magic of nature and the wisdom of flowers.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 text-gray-600 rounded-full border border-stone-200">
              <Package className="w-4 h-4 text-gray-400" />
              <span>Free Shipping over €50</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 text-gray-600 rounded-full border border-stone-200">
              <Zap className="w-4 h-4 text-gray-400" />
              <span>Digital Downloads</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 text-gray-600 rounded-full border border-stone-200">
              <Shield className="w-4 h-4 text-gray-400" />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb + Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ShopBreadcrumb />
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {visibleProducts.map((product) => {
              const priceField = `price_${currency}`;
              const digitalPriceField = `digital_price_${currency}`;
              const price =
                product[priceField] ||
                product.price_eur ||
                product.price_usd ||
                0;
              const digitalPrice =
                product[digitalPriceField] ||
                product.digital_price_eur ||
                product.digital_price_usd ||
                0;
              const hasDigital =
                product.is_digital || (digitalPrice && digitalPrice > 0);

              if (!price || price === 0) {
                console.warn("Product missing price:", product.name);
                return null;
              }

              // Use BookCard for book products
              if (product.type === "book") {
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

              // Default card for other product types
              return (
                <div
                  key={product.id}
                  className="group relative"
                >
                  <div
                    className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-500"
                  >
                    {/* Product Badges */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                      {product.stock_quantity > 50 && (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Bestseller
                        </span>
                      )}
                      {product.stock_quantity < 10 &&
                        product.stock_quantity > 0 && (
                          <span className="px-2.5 py-1 bg-rose-50 text-rose-600 text-xs font-semibold rounded-full border border-rose-200">
                            Limited Stock
                          </span>
                        )}
                    </div>

                    {/* Product Image */}
                    <div className="relative h-72 bg-gradient-to-b from-stone-100 to-stone-50 overflow-hidden">
                      {/* Subtle grid texture */}
                      <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='20' height='20' fill='none' stroke='%23000' stroke-width='0.5'/%3E%3C/svg%3E")`,
                        }}
                      />

                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Gamepad2 className="w-16 h-16 text-gray-300 group-hover:scale-110 transition-all duration-300" />
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="px-4 py-2 bg-white rounded-full text-gray-900 font-medium text-sm flex items-center gap-2 shadow-lg">
                          <Eye className="w-4 h-4" />
                          Quick View
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5 space-y-3">
                      {/* Category */}
                      <span className="inline-block px-2 py-0.5 bg-stone-100 text-stone-600 text-[11px] font-semibold rounded uppercase tracking-wider">
                        Card Game
                      </span>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-700 transition-colors">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Stock indicator */}
                      {!product.is_digital && (
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${product.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-400'}`} />
                          <span className={`text-xs ${product.stock_quantity > 0 ? 'text-gray-500' : 'text-red-500'}`}>
                            {product.stock_quantity > 50
                              ? 'In Stock'
                              : product.stock_quantity > 0
                                ? `Only ${product.stock_quantity} left`
                                : 'Out of Stock'
                            }
                          </span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-1">
                        {!product.is_digital && product.stock_quantity > 0 && (
                          <button
                            onClick={() => handleAddToCart(product, false)}
                            className="w-full px-4 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <ShoppingCart className="w-4 h-4" />
                              <span className="text-sm">Add to Cart</span>
                            </div>
                            <span className="text-sm font-bold">{formatCurrency(price, currency)}</span>
                          </button>
                        )}
                        {hasDigital && (
                          <button
                            onClick={() => handleAddToCart(product, true)}
                            className="w-full px-4 py-3 bg-white text-gray-900 font-medium rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <Download className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">Digital Version</span>
                            </div>
                            <span className="text-sm font-bold">{formatCurrency(digitalPrice, currency)}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && visibleProducts.length === 0 && (
          <div className="text-center py-24">
            <div className="max-w-sm mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-stone-100 rounded-2xl flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3
                className="text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                Coming Soon
              </h3>
              <p className="text-gray-500 leading-relaxed">
                We&apos;re preparing enchanting new additions to the collection. Check back soon!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add to Cart Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
          <div className="bg-gray-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="font-medium text-sm">Added to cart</p>
              <p className="text-xs text-gray-400">
                Continue shopping or checkout
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Summary */}
      {cartCount > 0 && !showNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <Link
            href="/cart"
            className="flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-full shadow-2xl hover:bg-gray-800 hover:scale-105 transition-all duration-300 group"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-gray-900 text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">
                {formatCurrency(getCartTotal(), currency)}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}

      {/* Fade-in animation */}
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

      <Footer />
    </div>
  );
}
