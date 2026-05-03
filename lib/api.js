// API utility functions for backend communication
import { getDeviceFingerprint } from './fingerprint';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.aquamundi.org/api';
const PRODUCT_IMAGE_UPLOAD_URL = 'https://backend.aquamundi.org/api/upload/product-image';

// Helper to include credentials for session cookies
const defaultFetchOptions = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper function for API calls with device fingerprinting
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...defaultFetchOptions,
    ...options,
    headers: {
      ...defaultFetchOptions.headers,
      ...options.headers,
    },
  };

  // Add session tracking headers
  if (typeof window !== 'undefined') {
    // Add admin token if available
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add device fingerprint for session tracking
    try {
      const fingerprint = await getDeviceFingerprint();
      if (fingerprint) {
        config.headers['X-Device-Fingerprint'] = fingerprint;
      }
    } catch (error) {
      console.error('Fingerprint error:', error);
      // Continue without fingerprint
    }
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Products API
export const productsAPI = {
  getAll: () => apiCall('/products'),
  getById: (id) => apiCall(`/products/${id}`),
};

// Checkout API
export const checkoutAPI = {
  create: (checkoutData) => apiCall('/checkout', {
    method: 'POST',
    body: JSON.stringify(checkoutData),
  }),
  getByOrderId: (orderId) => apiCall(`/checkout/order/${orderId}`),
};

// Orders API
export const ordersAPI = {
  getById: (id) => apiCall(`/orders/${id}`),
  getByOrderNumber: (orderNumber) => apiCall(`/orders/number/${orderNumber}`),
  getByCustomerEmail: (email) => apiCall(`/orders/customer/${email}`),
  getPaymentStatus: (orderId) => apiCall(`/payments/status/${orderId}`),
};

// Invoices API
export const invoicesAPI = {
  getByOrderId: (orderId, email) => {
    const params = email ? `?email=${encodeURIComponent(email)}` : '';
    return apiCall(`/invoices/order/${orderId}${params}`);
  },
  download: (invoiceNumber, email) => {
    const params = email ? `?email=${encodeURIComponent(email)}` : '';
    return `${API_BASE_URL}/invoices/${invoiceNumber}${params}`;
  },
};

// Admin API
export const adminAPI = {
  login: (email, password) => apiCall('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  getDashboard: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const suffix = query ? `?${query}` : '';
    return apiCall(`/admin/dashboard${suffix}`);
  },
  getAnalytics: (days = 30) => {
    return apiCall(`/admin/analytics?days=${days}`);
  },
  getOrders: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(`/orders?${params}`);
  },
  getCustomers: (limit = 50, offset = 0) => 
    apiCall(`/admin/customers?limit=${limit}&offset=${offset}`),
  getCustomer: (email) => apiCall(`/admin/customers/${email}`),
  deleteCustomer: (email) => apiCall(`/admin/customers/${email}`, {
    method: 'DELETE',
  }),
  updateOrderStatus: (orderId, status, metadata) => 
    apiCall(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, metadata }),
    }),
  // Product Management
  createProduct: (productData) => apiCall('/admin/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  updateProduct: (productId, productData) => apiCall(`/admin/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),
  deleteProduct: (productId) => apiCall(`/admin/products/${productId}`, {
    method: 'DELETE',
  }),
  // Image Upload
  uploadProductImage: async (formData, onProgress) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Progress tracking
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(e);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(JSON.parse(xhr.responseText).error?.message || 'Upload failed'));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });
      
      xhr.open('POST', PRODUCT_IMAGE_UPLOAD_URL);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    });
  },
  // Cache Invalidation
  invalidateCache: (cacheType = 'products') => {
    // Call backend to invalidate Redis cache
    return apiCall(`/admin/cache/invalidate`, {
      method: 'POST',
      body: JSON.stringify({ cacheType }),
    }).catch((error) => {
      console.warn('Cache invalidation failed (non-critical):', error);
      // Don't throw - cache invalidation failure shouldn't break the flow
    });
  },
};

// Cart management (localStorage)
export const cartStorage = {
  get: () => {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('nahiara_cart');
    return cart ? JSON.parse(cart) : [];
  },
  set: (cart) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('nahiara_cart', JSON.stringify(cart));
  },
  add: (product, quantity = 1, isDigital = false) => {
    const cart = cartStorage.get();
    const existingIndex = cart.findIndex(
      item => item.product_id === product.id && item.is_digital === isDigital
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image_url,
        quantity,
        is_digital: isDigital,
        unit_price: isDigital 
          ? (product.digital_price_eur || product.digital_price_usd)
          : (product.price_eur || product.price_usd),
      });
    }

    cartStorage.set(cart);
    
    // Store cart in session metadata (for persistence across devices if user logs in later)
    if (typeof window !== 'undefined') {
      const sessionId = localStorage.getItem('nahiara_session_id');
      if (sessionId) {
        // Update session metadata with cart info (async, don't block)
        fetch(`${API_BASE_URL}/sessions/current`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            metadata: {
              cart_items_count: cart.reduce((sum, item) => sum + item.quantity, 0),
              last_cart_update: new Date().toISOString(),
            },
          }),
        }).catch(() => {}); // Silently fail - cart should work without session
      }
    }
    
    return cart;
  },
  remove: (productId, isDigital = false) => {
    const cart = cartStorage.get();
    const filtered = cart.filter(
      item => !(item.product_id === productId && item.is_digital === isDigital)
    );
    cartStorage.set(filtered);
    return filtered;
  },
  updateQuantity: (productId, quantity, isDigital = false) => {
    const cart = cartStorage.get();
    const item = cart.find(
      item => item.product_id === productId && item.is_digital === isDigital
    );
    if (item) {
      if (quantity <= 0) {
        return cartStorage.remove(productId, isDigital);
      }
      item.quantity = quantity;
    }
    cartStorage.set(cart);
    return cart;
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('nahiara_cart');
  },
  getTotal: (currency = 'eur') => {
    const cart = cartStorage.get();
    return cart.reduce((total, item) => {
      const price = currency === 'eur' 
        ? (item.is_digital ? item.unit_price : item.unit_price)
        : (item.is_digital ? item.unit_price : item.unit_price);
      return total + (price * item.quantity);
    }, 0);
  },
};

// Currency formatting (re-export from geolocation for backward compatibility)
export { formatCurrency, getCurrencySymbol } from './geolocation.js';

