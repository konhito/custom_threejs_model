"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Download, Mail, ArrowLeft, Home } from "lucide-react";
import { ordersAPI, invoicesAPI, formatCurrency } from "../../lib/api";
import { useSession } from "../../hooks/useSession";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { session, track } = useSession();
  const orderNumber = searchParams.get('order');

  const [order, setOrder] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderNumber) {
      loadOrderDetails();
    } else {
      setError('No order number provided');
      setLoading(false);
    }
  }, [orderNumber]);

  const loadOrderDetails = async () => {
    try {
      // Load order details
      const orderResponse = await ordersAPI.getByOrderNumber(orderNumber);
      setOrder(orderResponse.data);

      // Try to load invoice
      try {
        const invoiceResponse = await invoicesAPI.getByOrderId(
          orderResponse.data.id,
          orderResponse.data.customer_email
        );
        setInvoice(invoiceResponse.data);
      } catch (invoiceError) {
        // Invoice might not be generated yet, that's okay
        console.log('Invoice not available yet');
      }
    } catch (err) {
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  // Track order completion
  useEffect(() => {
    if (order && session?.tracking_enabled) {
      track('order_completed', {
        order_number: order.order_number,
        order_id: order.id,
        total_amount: order.total_amount,
        currency: order.currency,
        items_count: order.items?.length || 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, session]);

  const downloadInvoice = () => {
    if (invoice && order) {
      const invoiceUrl = invoicesAPI.download(invoice.invoice_number, order.customer_email);
      window.open(invoiceUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30 flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />
        </div>
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30 relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />
        </div>
        <Navigation />
        <div className="pt-32 pb-16 px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <p className="text-red-600">{error || 'Order not found'}</p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg"
            >
              <Home className="w-5 h-5" />
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30 relative overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />
      </div>

      <Navigation />

      <div className="pt-20 pb-16 px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Order Successful!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-8 border border-gray-100 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="text-lg font-bold text-gray-900">{order.order_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="text-lg font-semibold text-emerald-600 capitalize">{order.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(order.total_amount, order.currency)}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items && order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                        {item.is_digital && <span className="ml-2 text-green-600">(Digital)</span>}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(item.total_price, order.currency)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-8 border border-gray-100 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Name</p>
                <p className="font-semibold text-gray-900">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-semibold text-gray-900">{order.customer_email}</p>
              </div>
              {order.customer_phone && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-semibold text-gray-900">{order.customer_phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-8 border border-gray-100 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Address</h2>
              <div className="text-gray-700">
                <p className="font-medium">{order.shipping_address.street}</p>
                <p>
                  {order.shipping_address.city}, {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country}</p>
              </div>
            </div>
          )}

          {/* Invoice Section */}
          <div className="bg-emerald-50/80 backdrop-blur-xl rounded-2xl shadow-sm p-8 border border-emerald-200 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Invoice</h3>
                <p className="text-gray-600">
                  {invoice
                    ? 'Your invoice is ready for download.'
                    : 'Your invoice is being generated and will be sent to your email shortly.'}
                </p>
                {invoice && (
                  <p className="text-sm text-gray-500 mt-1">
                    Invoice Number: {invoice.invoice_number}
                  </p>
                )}
              </div>
              {invoice && (
                <button
                  onClick={downloadInvoice}
                  className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Invoice
                </button>
              )}
            </div>
          </div>

          {/* Email Confirmation */}
          <div className="bg-cyan-50/80 backdrop-blur-xl border border-cyan-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <Mail className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Email Confirmation</h4>
                <p className="text-sm text-gray-600">
                  A confirmation email with your order details has been sent to <strong>{order.customer_email}</strong>.
                  {invoice && ' Your invoice has also been attached.'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="flex-1 px-6 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl text-center flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Continue Shopping
            </Link>
            <Link
              href={`/orders?email=${encodeURIComponent(order.customer_email)}`}
              className="flex-1 px-6 py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-center flex items-center justify-center gap-2"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}

