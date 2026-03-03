'use client';

import { useEffect, useState } from 'react';
import { productsAPI, adminAPI } from '@/lib/api';
import {
  Plus,
  Edit,
  Trash2,
  Package,
  DollarSign,
  Image as ImageIcon,
  Upload,
  X,
  Save,
  Book,
  Gamepad2,
  Download,
  AlertCircle,
  Check
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    type: 'book',
    price_eur: '',
    price_usd: '',
    digital_price_eur: '',
    digital_price_usd: '',
    image_url: '',
    digital_file_url: '',
    stock_quantity: 0,
    is_digital: false,
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productsAPI.getAll();

      if (response.success) {
        setProducts(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      sku: product.sku || '',
      type: product.type || 'book',
      price_eur: product.price_eur || '',
      price_usd: product.price_usd || '',
      digital_price_eur: product.digital_price_eur || '',
      digital_price_usd: product.digital_price_usd || '',
      image_url: product.image_url || '',
      digital_file_url: product.digital_file_url || '',
      stock_quantity: product.stock_quantity || 0,
      is_digital: product.is_digital || false,
      is_active: product.is_active !== undefined ? product.is_active : true,
    });
    setImagePreview(product.image_url || null);
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      showNotification('Please upload a valid image file (JPEG, PNG, WEBP, or GIF)', 'error');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showNotification('Image size must be less than 5MB', 'error');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to S3
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await adminAPI.uploadProductImage(formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });

      if (response.success) {
        setFormData(prev => ({ ...prev, image_url: response.data.imageUrl }));
        showNotification('Image uploaded successfully!', 'success');
        // Invalidate cache after image upload
        await adminAPI.invalidateCache('products');
      }
    } catch (error) {
      showNotification(error.message || 'Failed to upload image', 'error');
      setImagePreview(null);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct.id, formData);
        showNotification('Product updated successfully!', 'success');
      } else {
        await adminAPI.createProduct(formData);
        showNotification('Product created successfully!', 'success');
      }

      // Invalidate cache after product update
      await adminAPI.invalidateCache('products');

      setShowModal(false);
      loadProducts();
      resetForm();
    } catch (error) {
      showNotification(error.message || 'Failed to save product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await adminAPI.deleteProduct(productId);
      showNotification('Product deleted successfully!', 'success');

      // Invalidate cache after product deletion
      await adminAPI.invalidateCache('products');

      loadProducts();
    } catch (error) {
      showNotification('Failed to delete product', 'error');
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setImagePreview(null);
    setFormData({
      name: '',
      description: '',
      sku: '',
      type: 'book',
      price_eur: '',
      price_usd: '',
      digital_price_eur: '',
      digital_price_usd: '',
      image_url: '',
      digital_file_url: '',
      stock_quantity: 0,
      is_digital: false,
      is_active: true,
    });
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-900 mt-1 font-medium">Manage your product catalog</p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 relative">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}

                {/* Fallback placeholder (hidden if image loads successfully) */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ display: product.image_url ? 'none' : 'flex' }}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-full p-4 mb-2">
                    {product.type === 'book' ? (
                      <Book className="w-12 h-12 text-emerald-500" />
                    ) : (
                      <Gamepad2 className="w-12 h-12 text-blue-500" />
                    )}
                  </div>
                  <span className="text-xs text-gray-900 font-medium">No Image</span>
                </div>

                {/* Status Badge */}
                {!product.is_active && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow-lg font-medium">
                    Inactive
                  </div>
                )}

                {/* Product Type Badge */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                  {product.type === 'book' ? '📚 Book' : '🎮 Card Game'}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-900 mb-4 line-clamp-2">{product.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-900 font-medium">SKU:</span>
                    <span className="font-semibold text-gray-900">{product.sku}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-900 font-medium">Category:</span>
                    <span className="font-semibold text-gray-900 capitalize">{product.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-medium">Price:</span>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600">€{product.price_eur || product.price_usd}</div>
                      {product.is_digital && (
                        <div className="text-xs text-gray-900 font-medium">Digital: €{product.digital_price_eur}</div>
                      )}
                    </div>
                  </div>
                  {!product.is_digital && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-900 font-medium">Stock:</span>
                      <span className={`font-semibold ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock_quantity} units
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-900">
            No products found. Add your first product!
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-sm text-gray-900 mt-1">
                  {editingProduct ? 'Update product information' : 'Create a new product for your catalog'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-emerald-600" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Product Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="e.g., NAHIARA Book - Collector's Edition"
                    />
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      SKU *
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="e.g., NAH-BOOK-001"
                    />
                  </div>

                  {/* Product Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Product Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="book">📚 Book</option>
                      <option value="card_game">🎮 Card Game</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Describe your product in detail..."
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-emerald-600" />
                  Pricing
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Physical Prices */}
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <h4 className="font-medium text-emerald-900 mb-3">Physical Product</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Price (EUR) *
                        </label>
                        <input
                          type="number"
                          name="price_eur"
                          value={formData.price_eur}
                          onChange={handleInputChange}
                          required
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          placeholder="29.99"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Price (USD) *
                        </label>
                        <input
                          type="number"
                          name="price_usd"
                          value={formData.price_usd}
                          onChange={handleInputChange}
                          required
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          placeholder="34.99"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Digital Prices */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      Digital Version (Optional)
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Digital Price (EUR)
                        </label>
                        <input
                          type="number"
                          name="digital_price_eur"
                          value={formData.digital_price_eur}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="19.99"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Digital Price (USD)
                        </label>
                        <input
                          type="number"
                          name="digital_price_usd"
                          value={formData.digital_price_usd}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="24.99"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Images & Files */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2 text-emerald-600" />
                  Images & Files
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Product Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Product Image
                    </label>

                    {/* Upload Button */}
                    <div className="flex items-center gap-4">
                      <label className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                          <div className="flex flex-col items-center">
                            {uploading ? (
                              <>
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-3"></div>
                                <p className="text-sm text-gray-900 font-medium">Uploading {uploadProgress}%</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                  <div
                                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                  ></div>
                                </div>
                              </>
                            ) : imagePreview ? (
                              <div className="relative w-full group">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-full h-48 object-cover rounded-lg border-2 border-emerald-200"
                                  onError={(e) => {
                                    console.error('Image failed to load:', imagePreview);
                                    setImagePreview(null);
                                    setFormData(prev => ({ ...prev, image_url: '' }));
                                  }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-60 transition-all flex items-center justify-center rounded-lg">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center">
                                    <Upload className="w-10 h-10 text-white mb-2" />
                                    <p className="text-white text-sm font-bold">Click to change image</p>
                                    <p className="text-white/80 text-xs mt-1">Upload new or use URL</p>
                                  </div>
                                </div>
                                {/* Success indicator */}
                                <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1.5 shadow-lg">
                                  <Check className="w-4 h-4" />
                                </div>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                <p className="text-sm text-gray-900 font-medium">
                                  Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-gray-900 mt-1">
                                  PNG, JPG, WEBP, GIF up to 5MB
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>

                    {/* Or use URL */}
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-px bg-gray-300 flex-1"></div>
                        <span className="text-xs text-gray-900">OR USE URL</span>
                        <div className="h-px bg-gray-300 flex-1"></div>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          name="image_url"
                          value={formData.image_url}
                          onChange={(e) => {
                            handleInputChange(e);
                            if (e.target.value) {
                              setImagePreview(e.target.value);
                            }
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                          placeholder="https://s3.amazonaws.com/bucket/image.jpg"
                        />
                        {imagePreview && (
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData(prev => ({ ...prev, image_url: '' }));
                            }}
                            className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Clear image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {formData.image_url && (
                        <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Image URL set successfully
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Digital File URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Digital File URL (for digital products)
                    </label>
                    <input
                      type="url"
                      name="digital_file_url"
                      value={formData.digital_file_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="https://example.com/digital-file.pdf"
                    />
                    <p className="text-xs text-gray-900 mt-1">
                      Secure download link for digital version (if applicable)
                    </p>
                  </div>
                </div>
              </div>

              {/* Inventory & Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-emerald-600" />
                  Inventory & Status
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Stock Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stock_quantity"
                      value={formData.stock_quantity}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="100"
                      disabled={formData.is_digital}
                    />
                    <p className="text-xs text-gray-900 mt-1">
                      Number of units available (disabled for digital-only products)
                    </p>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_digital"
                        name="is_digital"
                        checked={formData.is_digital}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor="is_digital" className="ml-2 block text-sm text-gray-900">
                        Digital Only Product
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                        Active (visible in store)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-4 right-4 px-6 py-4 rounded-xl shadow-2xl z-50 animate-fade-in flex items-center gap-3 ${notification.type === 'success'
            ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
            : 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
          }`}>
          {notification.type === 'success' ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p className="font-medium">{notification.message}</p>
        </div>
      )}
    </div>
  );
}


