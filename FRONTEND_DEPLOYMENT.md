# 🚀 Frontend Deployment Guide

Complete guide for deploying the AquaMundi frontend with proper backend connection.

---

## 🎯 Quick Setup

### **Step 1: Configure Environment Variables**

Create a `.env.local` file in the root of `custom_threejs_model`:

```bash
# Create .env.local file
cp env.local.example.txt .env.local

# Edit with your values
nano .env.local
```

Add this content:

```bash
# Backend API URL (Your EC2 Backend)
NEXT_PUBLIC_API_URL=https://backend.aquamundi.org/api

# Stripe Publishable Key (for checkout)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here

# Google Analytics (Optional)
NEXT_PUBLIC_GA_ID=
```

### **Step 2: Install Dependencies**

```bash
cd custom_threejs_model
npm install
```

### **Step 3: Test Locally**

```bash
# Development mode (with hot reload)
npm run dev

# Production build locally
npm run build
npm start
```

### **Step 4: Verify Backend Connection**

```bash
# Open in browser
http://localhost:3000

# Test API connection
http://localhost:3000/test-api

# All tests should pass with your backend URL
```

---

## 🌐 Deployment Options

### **Option 1: Vercel (Recommended for Next.js)**

1. **Push code to Git repository** (GitHub, GitLab, etc.)

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Select `custom_threejs_model` as root directory

3. **Configure Environment Variables in Vercel:**
   ```
   NEXT_PUBLIC_API_URL=https://backend.aquamundi.org/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   ```

4. **Deploy:**
   - Vercel will automatically build and deploy
   - Every push to main branch auto-deploys

### **Option 2: Netlify**

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

3. **Configure Environment Variables:**
   - Go to Site Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL`

### **Option 3: AWS Amplify**

1. **Connect Git repository**
2. **Configure build settings:**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - cd custom_threejs_model
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: custom_threejs_model/.next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Add environment variables in Amplify console**

### **Option 4: Self-Hosted (Same EC2 as Backend)**

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js (if not already)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone/upload your code
cd /home/ubuntu
git clone your-repo.git
cd custom_threejs_model

# Install dependencies
npm install

# Create .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=https://backend.aquamundi.org/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
EOF

# Build
npm run build

# Start with PM2
pm2 start npm --name "aqua-frontend" -- start

# Or use PM2 ecosystem file
pm2 start ecosystem.config.js

# Configure Nginx
sudo nano /etc/nginx/sites-available/frontend

# Add:
server {
    listen 80;
    server_name www.aquamundi.org aquamundi.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable and restart Nginx
sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d aquamundi.org -d www.aquamundi.org
```

---

## 🔧 Configuration Files

### **PM2 Ecosystem File** (`ecosystem.config.js`)

```javascript
module.exports = {
  apps: [
    {
      name: 'aqua-frontend',
      cwd: '/home/ubuntu/custom_threejs_model',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
```

### **Next.js Config** (`next.config.js`)

Already configured for production builds with image optimization and proper headers.

---

## 🧪 Testing

### **Before Deployment:**

1. **Test API Connection:**
   ```bash
   curl https://backend.aquamundi.org/health
   ```

2. **Test Frontend Locally:**
   ```bash
   npm run build
   npm start
   ```

3. **Check Admin Dashboard:**
   - Navigate to: `http://localhost:3000/admin/login`
   - Login with admin credentials
   - Verify all data loads correctly

4. **Test Pages:**
   - Home: `http://localhost:3000`
   - Products: `http://localhost:3000/products`
   - Admin: `http://localhost:3000/admin`
   - Test API: `http://localhost:3000/test-api`

### **After Deployment:**

1. **Verify all pages load**
2. **Test API endpoints** at `/test-api`
3. **Test admin login** at `/admin/login`
4. **Test checkout flow**
5. **Check browser console for errors**

---

## 🐛 Troubleshooting

### **Issue: API calls still going to localhost**

**Solution:**
```bash
# Check .env.local exists
ls -la .env.local

# Verify environment variable
cat .env.local | grep NEXT_PUBLIC_API_URL

# Rebuild
npm run build
npm start
```

### **Issue: CORS errors**

**Solution:** Update backend `.env` to include your frontend domain:
```bash
ALLOWED_ORIGINS=https://www.aquamundi.org,https://aquamundi.org
```

### **Issue: Admin dashboard not loading**

**Checklist:**
- [ ] Backend is running: `curl https://backend.aquamundi.org/health`
- [ ] Admin credentials configured in backend `.env`
- [ ] Frontend has correct `NEXT_PUBLIC_API_URL`
- [ ] No CORS errors in browser console

### **Issue: 404 on refresh**

**Solution:** Configure your hosting provider for SPA routing:

**Vercel:** Already handled automatically

**Netlify:** Create `_redirects` file:
```
/*    /index.html   200
```

**Nginx:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## 📊 Monitoring

### **Check Application Status:**

```bash
# PM2 status
pm2 status

# View logs
pm2 logs aqua-frontend

# Monitor resources
pm2 monit
```

### **Check Nginx Logs:**

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

---

## 🔒 Security Checklist

- [ ] Use HTTPS (SSL certificate)
- [ ] Enable CORS only for your domains
- [ ] Set secure headers in Nginx
- [ ] Use environment variables (never hardcode secrets)
- [ ] Enable rate limiting
- [ ] Keep dependencies updated
- [ ] Regular security audits: `npm audit`

---

## 🚀 Performance Optimization

### **Next.js Optimizations:**

1. **Image Optimization:** Already enabled in `next.config.js`
2. **Code Splitting:** Automatic with Next.js
3. **Static Generation:** Use `getStaticProps` where possible
4. **CDN:** Use Vercel or Cloudflare CDN
5. **Compression:** Enable gzip in Nginx

### **Nginx Compression:**

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

---

## 📋 Deployment Checklist

- [ ] `.env.local` configured with production values
- [ ] Dependencies installed: `npm install`
- [ ] Build successful: `npm run build`
- [ ] Backend connection tested
- [ ] Admin credentials configured
- [ ] CORS configured in backend
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] All pages load correctly
- [ ] Admin dashboard functional
- [ ] Checkout flow tested
- [ ] Error monitoring setup
- [ ] Backup strategy in place

---

## 🎯 Quick Commands

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod

# PM2 (self-hosted)
pm2 start npm --name "aqua-frontend" -- start
pm2 save
pm2 startup

# Check logs
pm2 logs aqua-frontend

# Restart
pm2 restart aqua-frontend
```

---

## 📞 Support

If you encounter issues:

1. Check logs: `pm2 logs` or browser console
2. Verify backend is running: `curl https://backend.aquamundi.org/health`
3. Test API connection: Navigate to `/test-api`
4. Check CORS settings in backend
5. Verify environment variables

---

Your frontend is now ready for production! 🎉

