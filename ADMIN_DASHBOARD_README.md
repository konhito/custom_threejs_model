# Admin Dashboard - Production Guide
## Nahiara E-Commerce Platform

---

## 🎯 Overview

Complete production-level admin dashboard for managing orders, customers, products, and analytics. Built with Next.js 15 and integrated with your backend API at `https://backend.aquamundi.org`.

---

## ✨ Features

### **1. Authentication**
- ✅ Secure JWT-based authentication
- ✅ Session persistence with localStorage
- ✅ Auto-redirect for protected routes
- ✅ Logout functionality

### **2. Dashboard**
- ✅ Real-time statistics (revenue, orders, customers)
- ✅ Recent orders view
- ✅ Performance metrics
- ✅ Date range filtering

### **3. Order Management**
- ✅ Complete order listing
- ✅ Order search and filtering
- ✅ Status management (pending, processing, completed, etc.)
- ✅ Order details modal
- ✅ Customer information view
- ✅ Pagination support

### **4. Customer Management**
- ✅ Customer database
- ✅ Search by name/email
- ✅ Customer details with order history
- ✅ GDPR compliance indicators
- ✅ Customer deletion (GDPR right to be forgotten)
- ✅ Contact information management

### **5. Product Management**
- ✅ Product catalog view
- ✅ Product grid layout
- ✅ Stock tracking
- ✅ Price management
- ✅ Digital/Physical product support
- ✅ Image handling

### **6. Analytics**
- ✅ Revenue tracking
- ✅ Sales metrics
- ✅ Customer growth
- ✅ Time-range analysis
- ✅ Top products

### **7. Settings**
- ✅ General configuration
- ✅ Security settings
- ✅ Email configuration
- ✅ Payment settings
- ✅ System status

---

## 🚀 Quick Start

### **1. Access the Admin Dashboard**

```
URL: https://www.aquamundi.org/admin/login
```

### **2. Default Credentials**

Use the credentials configured in your backend `.env`:

```
Email: [Your ADMIN_EMAIL]
Password: [Your ADMIN_PASSWORD]
```

### **3. Admin Routes**

| Route | Description |
|-------|-------------|
| `/admin/login` | Login page |
| `/admin` | Dashboard (home) |
| `/admin/orders` | Order management |
| `/admin/customers` | Customer management |
| `/admin/products` | Product catalog |
| `/admin/analytics` | Business analytics |
| `/admin/settings` | System settings |

---

## 📁 Project Structure

```
custom_threejs_model/
├── app/
│   ├── admin/
│   │   ├── layout.js              # Admin layout with sidebar
│   │   ├── page.js                # Dashboard (main page)
│   │   ├── login/
│   │   │   └── page.js            # Login page
│   │   ├── orders/
│   │   │   └── page.js            # Orders management
│   │   ├── customers/
│   │   │   └── page.js            # Customers management
│   │   ├── products/
│   │   │   └── page.js            # Products management
│   │   ├── analytics/
│   │   │   └── page.js            # Analytics dashboard
│   │   └── settings/
│   │       └── page.js            # Settings page
│   └── ...
├── lib/
│   └── api.js                     # API client (includes adminAPI)
└── ...
```

---

## 🔧 Configuration

### **Frontend Environment Variables**

Create/update `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=https://backend.aquamundi.org/api

# Optional: Google Analytics
NEXT_PUBLIC_GA_ID=your_ga_id
```

### **Backend Environment Variables**

Your backend should have (in `aqua-backend/.env`):

```env
# Admin Credentials
ADMIN_EMAIL=admin@asociacionnahiara.org
ADMIN_PASSWORD=your_secure_password

# JWT Secret
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters_long
JWT_EXPIRE=7d

# CORS - Must include your frontend domain
ALLOWED_ORIGINS=https://www.aquamundi.org,https://www.asociacionnahiara.org
```

---

## 🔐 Authentication Flow

### **Login Process:**

1. User enters email and password
2. Frontend sends `POST /api/admin/login`
3. Backend validates credentials
4. Backend returns JWT token
5. Frontend stores token in `localStorage`
6. All subsequent requests include token in `Authorization` header

### **API Request Format:**

```javascript
{
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}
```

### **Protected Routes:**

All admin routes except `/admin/login` are protected:

```javascript
// Automatic redirect to login if not authenticated
useEffect(() => {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    router.push('/admin/login');
  }
}, []);
```

---

## 📡 Backend API Endpoints

### **Authentication**

```
POST /api/admin/login
Body: { email, password }
Response: { success, data: { token, user } }
```

### **Dashboard**

```
GET /api/admin/dashboard
Headers: Authorization: Bearer {token}
Response: { success, data: { statistics, recent_orders } }
```

### **Orders**

```
GET /api/admin/orders?status=completed
Headers: Authorization: Bearer {token}
Response: { success, data: [orders] }

PATCH /api/orders/:id/status
Headers: Authorization: Bearer {token}
Body: { status: 'completed' }
```

### **Customers**

```
GET /api/admin/customers?limit=50&offset=0
Headers: Authorization: Bearer {token}
Response: { success, data: [customers] }

GET /api/admin/customers/:email
Headers: Authorization: Bearer {token}
Response: { success, data: { customer, orders } }

DELETE /api/admin/customers/:email
Headers: Authorization: Bearer {token}
Response: { success, message }
```

### **Products**

```
GET /api/products
Response: { success, data: [products] }

POST /api/products
Headers: Authorization: Bearer {token}
Body: { product data }

PUT /api/products/:id
Headers: Authorization: Bearer {token}
Body: { updated product data }

DELETE /api/products/:id
Headers: Authorization: Bearer {token}
```

---

## 🎨 UI Components

### **Layout Components**

- **Sidebar Navigation** - Collapsible menu with icons
- **Top Bar** - Date display and mobile menu toggle
- **Protected Route Wrapper** - Auto-authentication check

### **Page Components**

- **Dashboard Cards** - Stat cards with icons and trends
- **Data Tables** - Sortable, searchable, paginated tables
- **Modal Dialogs** - Order details, customer details
- **Search Bars** - Real-time filtering
- **Status Badges** - Color-coded order statuses
- **Action Buttons** - Edit, delete, view actions

### **Color Scheme**

```css
Primary: Emerald (#10b981)
Success: Green (#22c55e)
Warning: Yellow (#eab308)
Danger: Red (#ef4444)
Info: Blue (#3b82f6)
```

---

## 🔒 Security Best Practices

### **1. Token Management**

```javascript
// Store token securely
localStorage.setItem('admin_token', token);

// Include in all requests
headers: {
  'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
}

// Clear on logout
localStorage.removeItem('admin_token');
localStorage.removeItem('admin_email');
```

### **2. Route Protection**

All admin routes check authentication before rendering:

```javascript
if (!token) {
  router.push('/admin/login');
  return null;
}
```

### **3. API Error Handling**

```javascript
try {
  const response = await adminAPI.getDashboard();
  // Handle success
} catch (error) {
  if (error.message.includes('Invalid or expired token')) {
    // Redirect to login
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  }
}
```

---

## 📊 Data Management

### **Order Status Flow**

```
pending → processing → completed
   ↓          ↓            ↓
cancelled  failed      refunded
```

### **GDPR Compliance**

- ✅ Customer consent tracking
- ✅ Data deletion capability
- ✅ Marketing preferences
- ✅ Right to be forgotten

### **Pagination**

```javascript
const ordersPerPage = 20;
const currentOrders = allOrders.slice(
  (currentPage - 1) * ordersPerPage,
  currentPage * ordersPerPage
);
```

---

## 🚢 Deployment

### **1. Build the Frontend**

```bash
cd custom_threejs_model
npm run build
```

### **2. Deploy to Vercel/Netlify**

```bash
# Vercel
vercel --prod

# Or Netlify
netlify deploy --prod
```

### **3. Configure Environment**

Set environment variables in your hosting platform:

```
NEXT_PUBLIC_API_URL=https://backend.aquamundi.org/api
```

### **4. Update CORS**

Make sure your backend `.env` includes the production domain:

```env
ALLOWED_ORIGINS=https://www.aquamundi.org
```

---

## 🧪 Testing

### **1. Login Test**

```bash
# Test admin login
curl -X POST https://backend.aquamundi.org/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_password"}'
```

### **2. Dashboard Test**

```bash
# Test dashboard (with token)
curl -X GET https://backend.aquamundi.org/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **3. Browser Console Test**

```javascript
// Test from browser console
fetch('https://backend.aquamundi.org/api/admin/dashboard', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
  }
})
.then(r => r.json())
.then(console.log);
```

---

## 🐛 Troubleshooting

### **Issue: "Invalid credentials" on login**

**Solution:**
- Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` in backend `.env`
- Verify backend is running: `curl https://backend.aquamundi.org/health`

### **Issue: "Invalid or expired token"**

**Solution:**
- Token expired (7 days default) - login again
- Clear localStorage: `localStorage.clear()`
- Check `JWT_SECRET` matches in backend

### **Issue: CORS errors**

**Solution:**
- Add frontend domain to `ALLOWED_ORIGINS` in backend `.env`
- Restart backend: `pm2 restart nahiara-backend`

### **Issue: "Failed to fetch"**

**Solution:**
- Check backend is running
- Verify API URL in `.env.local`
- Check network tab for actual error

---

## 📈 Performance Tips

1. **Pagination** - Load orders/customers in batches
2. **Search Debouncing** - Add delay to search input
3. **Image Optimization** - Use Next.js Image component
4. **Code Splitting** - Lazy load heavy components
5. **Caching** - Leverage Redis cache in backend

---

## 🎯 Roadmap

### **Phase 1: Completed** ✅
- Dashboard with stats
- Order management
- Customer management
- Products view
- Analytics
- Settings

### **Phase 2: Future**
- 📊 Advanced charts (Chart.js/Recharts)
- 📧 Email template editor
- 📦 Bulk operations
- 🔔 Real-time notifications
- 📱 Mobile app
- 🌍 Multi-language support
- 👥 Multiple admin users
- 📊 Export to CSV/PDF
- 🔍 Advanced filters
- 📈 Revenue forecasting

---

## 📞 Support

**Technical Support:**
- Email: partnerships@asociacionnahiara.org
- Phone: +34 625 50 18 67

**Documentation:**
- Backend API: `https://backend.aquamundi.org/api/docs`
- System Architecture: `SYSTEM_ARCHITECTURE.md`

---

## ✅ Production Checklist

- [ ] Backend deployed and accessible
- [ ] Environment variables configured
- [ ] Admin credentials set
- [ ] CORS configured correctly
- [ ] JWT secret is secure (32+ chars)
- [ ] HTTPS enabled
- [ ] Test all authentication flows
- [ ] Test all CRUD operations
- [ ] Verify pagination works
- [ ] Check mobile responsiveness
- [ ] Test logout functionality
- [ ] Verify session persistence
- [ ] Test error handling
- [ ] Monitor performance
- [ ] Setup error tracking (Sentry)

---

**🎉 Your admin dashboard is production-ready!**

Access it at: **https://www.aquamundi.org/admin/login**


