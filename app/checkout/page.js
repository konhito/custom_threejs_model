"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { ArrowLeft, Lock, CreditCard, Sparkles, Gift } from "lucide-react";
import Link from "next/link";
import { checkoutAPI, cartStorage, formatCurrency } from "../../lib/api";
import { useSession } from "../../hooks/useSession";
import Navigation from "../../components/Navigation";
import ShopBreadcrumb from "../../components/ShopBreadcrumb";

// Initialize Stripe (will be set from API response)
let stripePromise = null;

// Payment Form Component
function CheckoutForm({ orderData, paymentData, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message);
        setIsProcessing(false);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-success?order=${orderData.order_number}`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setError(confirmError.message);
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded - clear cart and redirect
        cartStorage.clear();
        onSuccess(orderData.order_number);
      } else {
        setError('Payment processing. Please wait...');
        setIsProcessing(false);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during payment');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-green-200">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-bold text-gray-900">Payment Details</h3>
        </div>
        <PaymentElement />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full px-6 py-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Pay {formatCurrency(orderData.total_amount, orderData.currency)}
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your payment is secured by Stripe. We never store your card details.
      </p>
    </form>
  );
}

// Main Checkout Page
export default function CheckoutPage() {
  const router = useRouter();
  const { session, track } = useSession();
  const [step, setStep] = useState(1); // 1: Customer Info, 2: Payment
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [currency, setCurrency] = useState('eur');
  const [stars, setStars] = useState([]);
  const starIdRef = useRef(0);
  const lastStarTime = useRef(0);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const mouseStopTimeout = useRef(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: {
      street: '',
      city: '',
      postal_code: '',
      country: '',
      state: '',
    },
    billing_address: {
      street: '',
      city: '',
      postal_code: '',
      country: '',
      state: '',
    },
    use_same_address: true,
    gdpr_consent: false,
    marketing_consent: false,
  });

  // Christmas cursor trail
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
    // Get currency from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const storedCurrency = localStorage.getItem('nahiara_currency') || 'eur';
      setCurrency(storedCurrency);
    }

    const cart = cartStorage.get();
    if (cart.length === 0) {
      router.push('/cart');
      return;
    }
    
    // Track checkout start
    if (session?.tracking_enabled) {
      track('checkout_start', {
        items_count: cart.length,
        total_items: cart.reduce((sum, item) => sum + item.quantity, 0),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
  
  // Track checkout step changes
  useEffect(() => {
    if (step > 1 && session?.tracking_enabled) {
      track('checkout_step', {
        step: step,
        step_name: step === 2 ? 'payment' : 'customer_info',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('shipping_')) {
      const field = name.replace('shipping_', '');
      setFormData(prev => ({
        ...prev,
        shipping_address: {
          ...prev.shipping_address,
          [field]: value,
        },
      }));
    } else if (name.startsWith('billing_')) {
      const field = name.replace('billing_', '');
      setFormData(prev => ({
        ...prev,
        billing_address: {
          ...prev.billing_address,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmitCustomerInfo = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cart = cartStorage.get();

      const checkoutData = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        shipping_address: formData.shipping_address,
        billing_address: formData.use_same_address 
          ? formData.shipping_address 
          : formData.billing_address,
        currency: currency,
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          is_digital: item.is_digital,
        })),
        gdpr_consent: formData.gdpr_consent,
        marketing_consent: true,
      };

      const response = await checkoutAPI.create(checkoutData);
      
      setOrderData(response.data.order);
      setPaymentData(response.data.payment);

      // Initialize Stripe
      if (response.data.payment.publishable_key) {
        stripePromise = loadStripe(response.data.payment.publishable_key);
      }

      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (orderNumber) => {
    // Track checkout completion
    if (session?.tracking_enabled) {
      track('checkout_completed', {
        order_number: orderNumber,
      });
    }
    router.push(`/order-success?order=${orderNumber}`);
  };

  const cart = cartStorage.get();

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
      
      <div className="pt-20 pb-16 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Navigation */}
          <ShopBreadcrumb />
          
          {/* Christmas Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-green-600 text-white px-4 py-2 rounded-full mb-4 shadow-xl animate-pulse">
              <Gift className="w-5 h-5" />
              <span className="font-bold text-sm">Secure Checkout</span>
              <Lock className="w-5 h-5" />
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-red-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-gradient-to-r from-red-600 to-green-600 text-white shadow-lg' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="font-semibold">Customer Info</span>
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-gradient-to-r from-red-600 to-green-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-red-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-gradient-to-r from-red-600 to-green-600 text-white shadow-lg' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="font-semibold">Payment</span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Customer Information
              </h2>

              <form onSubmit={handleSubmitCustomerInfo} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="customer_name"
                        required
                        value={formData.customer_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="customer_email"
                        required
                        value={formData.customer_email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="customer_phone"
                        value={formData.customer_phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="shipping_street"
                        required
                        value={formData.shipping_address.street}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          name="shipping_city"
                          required
                          value={formData.shipping_address.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          name="shipping_postal_code"
                          required
                          value={formData.shipping_address.postal_code}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country *
                        </label>
                        <input
                          type="text"
                          name="shipping_country"
                          required
                          value={formData.shipping_address.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State/Province
                        </label>
                        <input
                          type="text"
                          name="shipping_state"
                          value={formData.shipping_address.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div>
                  <label className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      name="use_same_address"
                      checked={formData.use_same_address}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Use same address for billing</span>
                  </label>

                  {formData.use_same_address && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        Billing address will be the same as your shipping address.
                      </p>
                    </div>
                  )}

                  {!formData.use_same_address && (
                    <div className="space-y-4 mt-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="billing_street"
                          required={!formData.use_same_address}
                          value={formData.billing_address.street}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            name="billing_city"
                            required={!formData.use_same_address}
                            value={formData.billing_address.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Postal Code *
                          </label>
                          <input
                            type="text"
                            name="billing_postal_code"
                            required={!formData.use_same_address}
                            value={formData.billing_address.postal_code}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                          </label>
                          <input
                            type="text"
                            name="billing_country"
                            required={!formData.use_same_address}
                            value={formData.billing_address.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State/Province
                          </label>
                          <input
                            type="text"
                            name="billing_state"
                            value={formData.billing_address.state}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* GDPR Consent */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      name="gdpr_consent"
                      required
                      checked={formData.gdpr_consent}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I consent to the processing of my personal data in accordance with GDPR regulations. *
                    </span>
                  </label>
                  <label className="flex items-start gap-2 mt-3">
                    <input
                      type="checkbox"
                      name="marketing_consent"
                      checked={formData.marketing_consent}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I would like to receive marketing communications about new products and updates.
                    </span>
                  </label>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Link
                    href="/cart"
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Cart
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Continue to Payment'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && orderData && paymentData && stripePromise && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Payment
              </h2>

              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Order Number:</strong> {orderData.order_number}
                </p>
                <p className="text-lg font-bold text-green-600">
                  Total: {formatCurrency(orderData.total_amount, orderData.currency)}
                </p>
              </div>

              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret: paymentData.client_secret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#10b981',
                      colorBackground: '#ffffff',
                      colorText: '#111827',
                      colorDanger: '#ef4444',
                      fontFamily: 'system-ui, sans-serif',
                      spacingUnit: '4px',
                      borderRadius: '8px',
                    },
                  },
                }}
              >
                <CheckoutForm
                  orderData={orderData}
                  paymentData={paymentData}
                  onSuccess={handlePaymentSuccess}
                  onError={setError}
                />
              </Elements>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

