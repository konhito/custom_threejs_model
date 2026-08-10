'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  RefreshCw
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30');
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminAPI.getAnalytics(parseInt(timeRange));
      
      if (response.success) {
        setAnalytics(response.data);
      } else {
        setError('Failed to load analytics data');
      }
    } catch (err) {
      console.error('Analytics error:', err);
      setError('Unable to load analytics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    const value = Number(amount) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value) => {
    const num = Number(value) || 0;
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <p className="text-red-600 font-semibold mb-3">{error || 'No analytics data available'}</p>
        <button
          onClick={loadAnalytics}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Revenue',
      value: formatCurrency(analytics.metrics.revenue.value),
      change: formatPercent(analytics.metrics.revenue.change),
      trend: analytics.metrics.revenue.trend,
      icon: DollarSign,
      color: 'bg-emerald-500',
    },
    {
      title: 'Orders',
      value: analytics.metrics.orders.value.toLocaleString(),
      change: formatPercent(analytics.metrics.orders.change),
      trend: analytics.metrics.orders.trend,
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: 'New Customers',
      value: analytics.metrics.customers.value.toLocaleString(),
      change: formatPercent(analytics.metrics.customers.change),
      trend: analytics.metrics.customers.trend,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Products Sold',
      value: analytics.metrics.productsSold.value.toLocaleString(),
      change: formatPercent(analytics.metrics.productsSold.change),
      trend: analytics.metrics.productsSold.trend,
      icon: Package,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">A live view of shop performance, compared with the previous period.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button
            onClick={loadAnalytics}
            disabled={isLoading}
            aria-label="Refresh analytics"
            className="rounded-lg border border-gray-300 p-2.5 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`${metric.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendIcon className="w-4 h-4 mr-1" />
                  {metric.change}
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">{metric.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Over Time</h2>
          <div className="h-64 flex flex-col justify-end space-y-1">
            {analytics.revenueOverTime.length > 0 ? (
              <div className="flex items-end justify-between h-full gap-1">
                {analytics.revenueOverTime.map((item, index) => {
                  const maxRevenue = Math.max(...analytics.revenueOverTime.map(r => r.revenue));
                  const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center group">
                      <div 
                        className="w-full bg-emerald-500 rounded-t transition-all hover:bg-emerald-600 relative"
                        style={{ height: `${Math.max(height, 5)}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {formatCurrency(item.revenue)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">No revenue data for this period</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Orders by Status</h2>
          <div className="space-y-4">
            {analytics.ordersByStatus.length > 0 ? (
              analytics.ordersByStatus.map((status, index) => {
                const totalOrders = analytics.ordersByStatus.reduce((sum, s) => sum + s.count, 0);
                const percentage = totalOrders > 0 ? (status.count / totalOrders) * 100 : 0;
                const statusColors = {
                  completed: 'bg-green-500',
                  processing: 'bg-blue-500',
                  pending: 'bg-yellow-500',
                  cancelled: 'bg-red-500',
                  failed: 'bg-red-600',
                };
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900 capitalize">{status.status}</span>
                      <span className="text-sm text-gray-600">
                        {status.count} orders • {formatCurrency(status.revenue)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${statusColors[status.status] || 'bg-gray-500'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">No order data for this period</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
        </div>
        <div className="p-6">
          {analytics.topProducts.length > 0 ? (
            <div className="space-y-4">
              {analytics.topProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.units_sold} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                    <p className="text-sm text-gray-600">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No product sales data for this period</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


