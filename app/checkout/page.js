"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { motion } from "motion/react";
import { ArrowLeft, Lock, CreditCard, Check, MapPin, User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { checkoutAPI, cartStorage, formatCurrency } from "../../lib/api";
import { safeGetItem } from "../../lib/storage";
import { useSession } from "../../hooks/useSession";
import Navigation from "../../components/Navigation";
import ShopBreadcrumb from "../../components/ShopBreadcrumb";
import Footer from "../../components/Footer";
import PageLoader from "../../components/PageLoader";
import { useTranslation } from "../../lib/useTranslation";

// Initialize Stripe (will be set from API response)
let stripePromise = null;

// Payment Form Component
function CheckoutForm({ orderData, paymentData, onSuccess, onError }) {
  const { t, isLoading: translationsLoading } = useTranslation();
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

      const successPath = `/order-success?order=${orderData.order_number}`;
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}${successPath}`,
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
        setError(t('checkoutPage.paymentProcessingWait'));
        setIsProcessing(false);
      }
    } catch (err) {
      setError(err.message || t('checkoutPage.paymentError'));
      setIsProcessing(false);
    }
  };

  if (translationsLoading) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-900">{t('checkoutPage.paymentDetails')}</h3>
        </div>
        <PaymentElement />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <motion.button
        type="submit"
        disabled={!stripe || isProcessing}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full px-6 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {t('checkoutPage.processingPayment')}
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            {t('checkoutPage.payAmount', { amount: formatCurrency(orderData.total_amount, orderData.currency) })}
          </>
        )}
      </motion.button>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <ShieldCheck className="w-4 h-4" />
        <span>{t('checkoutPage.securedByStripe')}</span>
      </div>
    </form>
  );
}

// Main Checkout Page
export default function CheckoutPage() {
  const { t, locale, isLoading: translationsLoading } = useTranslation();
  const router = useRouter();
  const { session, track } = useSession();
  const [step, setStep] = useState(1); // 1: Customer Info, 2: Payment
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [currency, setCurrency] = useState('eur');
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

  useEffect(() => {
    // Get currency from localStorage (client-side only)
    const storedCurrency = safeGetItem('nahiara_currency', 'eur');
    setCurrency(storedCurrency);

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
        marketing_consent: formData.marketing_consent,
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
      setError(err.message || t('checkoutPage.createOrderError'));
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

  // Step indicator component
  const StepIndicator = ({ stepNum, label, isActive, isComplete }) => (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
        isComplete ? 'bg-emerald-500 text-white' :
        isActive ? 'bg-gray-900 text-white' : 
        'bg-gray-200 text-gray-500'
      }`}>
        {isComplete ? <Check className="w-5 h-5" /> : stepNum}
      </div>
      <span className={`font-medium ${isActive || isComplete ? 'text-gray-900' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );

  if (translationsLoading) return <PageLoader isLoading />;

  return (
    <div className="min-h-screen bg-white">

      <Navigation />
      
      <div className="pt-24 pb-16 px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb Navigation */}
          <ShopBreadcrumb />
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t('checkoutPage.title')}</h1>
            <p className="text-gray-600">{t('checkoutPage.subtitle')}</p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-4">
              <StepIndicator stepNum={1} label={t('checkoutPage.details')} isActive={step === 1} isComplete={step > 1} />
              <div className={`w-16 h-0.5 ${step > 1 ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
              <StepIndicator stepNum={2} label={t('checkoutPage.payment')} isActive={step === 2} isComplete={false} />
            </div>
          </motion.div>

          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm"
            >
              <form onSubmit={handleSubmitCustomerInfo} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{t('checkoutPage.personalInformation')}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t('checkoutPage.fullName')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="customer_name"
                        required
                        value={formData.customer_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        placeholder={t('checkoutPage.namePlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t('checkoutPage.email')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="customer_email"
                        required
                        value={formData.customer_email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        placeholder={t('checkoutPage.emailPlaceholder')}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t('checkoutPage.phoneOptional')}
                      </label>
                      <input
                        type="tel"
                        name="customer_phone"
                        value={formData.customer_phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{t('checkoutPage.shippingAddress')}</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t('checkoutPage.streetAddress')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="shipping_street"
                        required
                        value={formData.shipping_address.street}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        placeholder={t('checkoutPage.streetPlaceholder')}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {t('checkoutPage.city')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="shipping_city"
                          required
                          value={formData.shipping_address.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          placeholder={t('checkoutPage.cityPlaceholder')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {t('checkoutPage.postalCode')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="shipping_postal_code"
                          required
                          value={formData.shipping_address.postal_code}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          placeholder="10001"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {t('checkoutPage.country')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="shipping_country"
                          required
                          value={formData.shipping_address.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          placeholder={t('checkoutPage.countryPlaceholder')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {t('checkoutPage.stateProvince')}
                        </label>
                        <input
                          type="text"
                          name="shipping_state"
                          value={formData.shipping_address.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          placeholder="NY"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="use_same_address"
                      checked={formData.use_same_address}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">{t('checkoutPage.billingSameAsShipping')}</span>
                  </label>

                  {!formData.use_same_address && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 mt-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">{t('checkoutPage.billingAddress')}</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {t('checkoutPage.streetAddress')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="billing_street"
                          required={!formData.use_same_address}
                          value={formData.billing_address.street}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {t('checkoutPage.city')} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="billing_city"
                            required={!formData.use_same_address}
                            value={formData.billing_address.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {t('checkoutPage.postalCode')} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="billing_postal_code"
                            required={!formData.use_same_address}
                            value={formData.billing_address.postal_code}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {t('checkoutPage.country')} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="billing_country"
                            required={!formData.use_same_address}
                            value={formData.billing_address.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {t('checkoutPage.stateProvince')}
                          </label>
                          <input
                            type="text"
                            name="billing_state"
                            value={formData.billing_address.state}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* GDPR Consent */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="gdpr_consent"
                      required
                      checked={formData.gdpr_consent}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 mt-0.5"
                    />
                    <span className="text-sm text-gray-700">
                      {t('footer.privacyAcceptPrefix')} <Link href="/privacy" className="underline">{t('footer.privacyPolicy')}</Link>{t('footer.privacyAcceptSuffix')} <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <label className="flex items-start gap-3 mt-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="marketing_consent"
                      checked={formData.marketing_consent}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 mt-0.5"
                    />
                    <span className="text-sm text-gray-700">
                      {t('checkoutPage.marketingConsent')}
                    </span>
                  </label>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/cart"
                    className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    {t('checkoutPage.backToCart')}
                  </Link>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex-1 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {t(loading ? 'checkoutPage.processing' : 'checkoutPage.continueToPayment')}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 2 && orderData && paymentData && stripePromise && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Order summary card */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-700 mb-1">{t('checkoutPage.orderNumber')}</p>
                    <p className="font-mono font-semibold text-gray-900">{orderData.order_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-emerald-700 mb-1">{t('cartPage.total')}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(orderData.total_amount, orderData.currency)}
                    </p>
                  </div>
                </div>
              </div>

              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret: paymentData.client_secret,
                  locale,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#10b981',
                      colorBackground: '#ffffff',
                      colorText: '#111827',
                      colorDanger: '#ef4444',
                      fontFamily: 'system-ui, sans-serif',
                      spacingUnit: '4px',
                      borderRadius: '12px',
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
            </motion.div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
