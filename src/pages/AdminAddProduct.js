// AdminAddProduct.js - Form with Cloudinary image upload and Render API
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminAddProduct.css';

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    imageUrl: ''
  });

  // Smooth scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Reset form fields to initial empty state
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      imageUrl: ''
    });
    setImagePreview(null);
  };

  // Show notification with auto-hide
  const showNotificationMessage = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle image upload to Cloudinary via Render API
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      showNotificationMessage('Please upload an image file (JPEG, PNG, etc.)', 'error');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showNotificationMessage('Image size should be less than 5MB', 'error');
      return;
    }
    
    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Upload to Cloudinary via Render
    setUploadingImage(true);
    
    const uploadData = new FormData();
    uploadData.append('image', file);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/upload`, {
        method: 'POST',
        body: uploadData
      });
      
      const result = await response.json();
      
      if (result.success) {
        setFormData({
          ...formData,
          imageUrl: result.imageUrl
        });
        showNotificationMessage('Image uploaded successfully!', 'success');
      } else {
        showNotificationMessage('Failed to upload image. Please try again.', 'error');
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showNotificationMessage('Network error. Could not upload image.', 'error');
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImagePreview(null);
    setFormData({
      ...formData,
      imageUrl: ''
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.price || !formData.description) {
      showNotificationMessage('Please fill in all required fields (Name, Price, Description)', 'error');
      setLoading(false);
      return;
    }
    
    if (!formData.imageUrl) {
      showNotificationMessage('Please upload a product image', 'error');
      setLoading(false);
      return;
    }

    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category || 'General',
        imageUrl: formData.imageUrl,
        rating: 4.0,
        inStock: true
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error(`Failed to add product: ${response.status}`);
      }

      if (response.ok) {
        const newProduct = await response.json();
        showNotificationMessage(`✅ Product "${newProduct.name}" added successfully!`, 'success');
        
        // Reset form after successful addition
        resetForm();
        
        // Scroll to top smoothly
        scrollToTop();
      } else {
        const errorData = await response.json();
        showNotificationMessage(errorData.message || 'Failed to add product. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      showNotificationMessage('Network error. Make sure the server is running.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    resetForm();
    showNotificationMessage('Product creation cancelled', 'info');
    scrollToTop();
  };

  // Go back to admin dashboard
  const goBackToAdmin = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="admin-add-product">
      {/* Fixed Notification Bar */}
      {showNotification && (
        <div className={`fixed-notification-admin ${notificationType}`}>
          <span>{notificationMessage}</span>
        </div>
      )}

      {/* Back to Admin Button */}
      <div className="add-product-header-top">
        <button onClick={goBackToAdmin} className="back-to-admin-btn">
          ← Back to Admin Dashboard
        </button>
      </div>

      <div className="add-product-container">
        <div className="add-product-header">
          <h1>Add New Product</h1>
          <p>Fill in the details below to add a new product to your store</p>
        </div>

        <form onSubmit={handleSubmit} className="add-product-form">
          {/* Product Name */}
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Organic Honey"
              required
            />
          </div>

          {/* Price and Category Row */}
          <div className="form-row">
            <div className="form-group">
              <label>Price (Rs.) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., 599"
                step="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Groceries, Spices, Oil"
              />
            </div>
          </div>

          {/* Image Upload Field */}
          <div className="form-group">
            <label>Product Image *</label>
            <div className="image-upload-area">
              {!imagePreview ? (
                <div className="upload-placeholder">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                    id="imageUpload"
                    disabled={uploadingImage}
                  />
                  <label htmlFor="imageUpload" className="upload-label">
                    {uploadingImage ? '📤 Uploading...' : '📸 Click to Upload Image'}
                  </label>
                  <p className="upload-hint">Supported: JPEG, PNG, GIF, WEBP (Max 5MB)</p>
                </div>
              ) : (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button type="button" onClick={removeImage} className="remove-image-btn">
                    ✗ Remove Image
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product in detail..."
              rows="5"
              required
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading || uploadingImage || !formData.imageUrl} className="submit-btn">
              {loading ? 'Adding Product...' : '➕ Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;