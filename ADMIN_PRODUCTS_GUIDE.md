# 📦 Admin Product Management Guide

Complete guide for managing products in the Nahiara admin dashboard.

---

## ✨ Features

### **Product Management**
- ✅ Add new products (books & card games)
- ✅ Edit existing products
- ✅ Delete products
- ✅ Upload product images
- ✅ Set physical & digital pricing (EUR/USD)
- ✅ Manage inventory/stock levels
- ✅ Toggle product visibility (active/inactive)
- ✅ Real-time preview
- ✅ Beautiful responsive UI

---

## 🎨 Product Fields

### **Basic Information:**
- **Product Name** - Display name (e.g., "NAHIARA Book - Collector's Edition")
- **SKU** - Stock Keeping Unit (e.g., "NAH-BOOK-001")
- **Type** - Book or Card Game
- **Description** - Full product description

### **Pricing:**
- **Price (EUR)** - Physical product price in Euros *
- **Price (USD)** - Physical product price in Dollars *
- **Digital Price (EUR)** - Optional digital version price
- **Digital Price (USD)** - Optional digital version price

### **Media:**
- **Image URL** - Product image (upload to image host)
- **Digital File URL** - Download link for digital products

### **Inventory:**
- **Stock Quantity** - Number of units available
- **Digital Only** - Checkbox for digital-only products
- **Active** - Visibility toggle for the store

---

## 📸 Image Upload Guide

Since direct file upload requires additional backend configuration, use these services:

### **Option 1: Imgur (Free & Easy)**
1. Go to [imgur.com](https://imgur.com)
2. Click "New post"
3. Upload your product image
4. Right-click the image → "Copy image address"
5. Paste URL in "Product Image URL" field

### **Option 2: Cloudinary (Professional)**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Upload image
3. Copy "Secure URL"
4. Paste in product form

### **Option 3: AWS S3 (For Production)**
1. Upload to S3 bucket
2. Set public read permissions
3. Use S3 URL: `https://your-bucket.s3.amazonaws.com/product.jpg`

### **Image Requirements:**
- **Format:** JPG, PNG, WEBP
- **Size:** Max 5MB
- **Dimensions:** 800x600px or 4:3 aspect ratio recommended
- **Quality:** High resolution for product clarity

---

## 📋 How to Add a Product

### **Step 1: Access Admin Dashboard**
```
Navigate to: https://yourdomain.com/admin/products
```

### **Step 2: Click "Add Product"**
- Green button in top right corner

### **Step 3: Fill in Basic Information**
```
Name: NAHIARA Book - First Edition
SKU: NAH-BOOK-001
Type: Book
Description: The complete story of the International Association...
```

### **Step 4: Set Pricing**
```
Physical:
  EUR: 29.99
  USD: 34.99

Digital (Optional):
  EUR: 19.99
  USD: 24.99
```

### **Step 5: Add Images**
```
Image URL: https://i.imgur.com/example.jpg
Digital File URL: https://example.com/book.pdf (if digital)
```

### **Step 6: Set Inventory**
```
Stock Quantity: 100
☑ Active (visible in store)
☐ Digital Only
```

### **Step 7: Save**
- Click "Create Product"
- Product appears in catalog immediately

---

## ✏️ How to Edit a Product

1. Find product in grid
2. Click "Edit" button
3. Modify any fields
4. Click "Update Product"
5. Changes apply immediately

---

## 🗑️ How to Delete a Product

1. Find product in grid
2. Click trash icon (🗑️)
3. Confirm deletion
4. Product removed from catalog

---

## 🎯 Product Display

Products automatically appear in:

### **Shop Page** (`/shop`)
- Grid layout
- Currency auto-detection
- Add to cart buttons
- Stock indicators
- Physical/Digital options

### **Product Card Shows:**
- Product image
- Name & description
- Price (based on user's currency)
- Stock status
- Type badge (book/game)
- Add to cart buttons

---

## 💡 Best Practices

### **Product Names:**
- ✅ Be descriptive: "NAHIARA Book - Collector's Edition"
- ❌ Avoid generic: "Book 1"

### **SKUs:**
- Use consistent format: `NAH-BOOK-001`, `NAH-GAME-001`
- Include product type
- Sequential numbering

### **Descriptions:**
- Highlight key features
- Include dimensions/pages for books
- Mention special editions
- Add language information
- Keep under 200 words for readability

### **Pricing:**
- Always set both EUR and USD
- Research competitors
- Consider digital pricing (usually 30-40% lower)
- Round to .99 for psychology

### **Images:**
- High quality (at least 800px width)
- Clear product view
- Consistent style across products
- White or neutral background recommended
- Show book cover or game box clearly

### **Stock Management:**
- Update after each order manually or use inventory system
- Set "Low Stock" alerts at 10 units
- Mark as inactive when out of stock (don't delete!)

---

## 🔍 Product States

### **Active Products:**
- Visible in shop
- Can be purchased
- Shown in search results

### **Inactive Products:**
- Hidden from shop
- Not purchasable
- Still in database
- Can be reactivated anytime

### **Digital Only:**
- No stock quantity needed
- Download link provided after purchase
- Instant delivery

### **Physical + Digital:**
- Customers can choose version
- Separate inventory tracking
- Different pricing

---

## 📊 Product Analytics

Track product performance in **Admin Dashboard**:

- Total products
- Active vs inactive
- Stock levels
- Revenue per product
- Most viewed products
- Bestsellers

---

## 🐛 Troubleshooting

### **Image Not Loading:**
- Check URL is publicly accessible
- Ensure HTTPS (not HTTP)
- Verify image format (JPG, PNG, WEBP)
- Check image host allows hotlinking

### **Product Not Showing in Shop:**
- Verify "Active" checkbox is checked
- Check stock quantity > 0 (for physical products)
- Clear browser cache
- Reload shop page

### **Price Not Displaying:**
- Ensure both EUR and USD prices are set
- Check values are numbers (not text)
- Verify decimal format (use . not ,)

### **Can't Edit Product:**
- Verify you're logged in as admin
- Check token hasn't expired
- Try logging out and back in
- Check browser console for errors

---

## 🎨 UI Theme Matching

The product admin matches your website theme:

- **Colors:** Emerald/Green gradient
- **Fonts:** Clean, modern sans-serif
- **Style:** Card-based layout
- **Responsive:** Mobile-friendly
- **Icons:** Lucide React icons
- **Animations:** Smooth transitions

---

## 🔐 Security

### **Admin Only:**
- Products can only be managed by logged-in admins
- JWT token required for all operations
- Automatic token expiry (7 days)

### **Validation:**
- Required fields enforced
- Price validation (positive numbers)
- SKU uniqueness checked
- Image URL format verified

---

## 📱 Mobile Admin

The product management is **fully responsive**:

- **Mobile:** Single column, touch-friendly
- **Tablet:** 2-column grid
- **Desktop:** 3-column grid
- **Large screens:** 4-column grid

Works perfectly on:
- iPhone/Android
- iPad/Tablets
- Desktop browsers

---

## ✅ Checklist for New Products

Before adding a product, ensure you have:

- [ ] High-quality product image
- [ ] Detailed description
- [ ] Unique SKU
- [ ] Pricing in EUR & USD
- [ ] Stock quantity (or digital file)
- [ ] Product type selected
- [ ] Proofread all text
- [ ] Test product in shop after adding

---

## 🚀 Quick Tips

1. **Batch Upload:** Add multiple products at once by keeping modal open
2. **Templates:** Use similar products as templates (edit existing)
3. **Preview:** Check shop page after each addition
4. **Inventory:** Update stock regularly
5. **Seasonal:** Mark inactive instead of deleting
6. **Backup:** Export product list regularly (coming soon)

---

Your product catalog is now professional and easy to manage! 🎉

