// AdminManageProducts.js - Complete working version with custom delete modal
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageReplaceModal from '../components/ImageReplaceModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import './AdminManageProducts.css';

const AdminManageProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [pendingChanges, setPendingChanges] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedProductForImage, setSelectedProductForImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDescription, setEditingDescription] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('');
  
  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products`);
      const data = await response.json();
      setProducts(data);
      setOriginalProducts(JSON.parse(JSON.stringify(data)));
      setPendingChanges({});
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Make sure server is running.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Show notification with auto-hide
  const showNotificationMessage = (type, text) => {
    if (type === 'success') {
      setMessage(text);
      setNotificationType('success');
    } else {
      setError(text);
      setNotificationType('error');
    }
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
      setTimeout(() => {
        setMessage('');
        setError('');
        setNotificationType('');
      }, 300);
    }, 3000);
  };

  // Check if a product has pending changes
  const hasPendingChanges = (productId) => {
    return pendingChanges[productId] && Object.keys(pendingChanges[productId]).length > 0;
  };

  // Get updated product data (original + pending changes)
  const getUpdatedProduct = (product) => {
    if (!product) return null;
    const changes = pendingChanges[product._id] || {};
    return { ...product, ...changes };
  };

  // Handle field change
  const handleFieldChange = (productId, field, value) => {
    setPendingChanges(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }));
    
    setProducts(prev => prev.map(p => 
      p._id === productId ? { ...p, [field]: value } : p
    ));
  };

  // Handle price change
  const handlePriceChange = (productId, value) => {
    if (value === '') {
      handleFieldChange(productId, 'price', '');
      return;
    }
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue === '') {
      handleFieldChange(productId, 'price', '');
    } else {
      handleFieldChange(productId, 'price', parseInt(numericValue, 10));
    }
  };

  // Handle description edit
  const handleDescriptionEdit = (productId, value) => {
    setPendingChanges(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        description: value
      }
    }));
    
    setProducts(prev => prev.map(p => 
      p._id === productId ? { ...p, description: value } : p
    ));
    setEditingDescription(null);
  };

  // Handle status toggle
  const handleStatusChange = (productId, isInStock) => {
    setPendingChanges(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        inStock: isInStock
      }
    }));
    
    setProducts(prev => prev.map(p => 
      p._id === productId ? { ...p, inStock: isInStock } : p
    ));
  };

  // Handle image replacement
  const handleImageReplace = async (productId, newImageUrl) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: newImageUrl })
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        
        setProducts(prev => prev.map(p => 
          p._id === productId ? { ...p, imageUrl: updatedProduct.imageUrl } : p
        ));
        
        setOriginalProducts(prev => prev.map(p => 
          p._id === productId ? { ...p, imageUrl: updatedProduct.imageUrl } : p
        ));
        
        showNotificationMessage('success', '✅ Image replaced successfully and saved to database!');
        await fetchProducts();
      } else {
        showNotificationMessage('error', 'Failed to update image in database');
      }
    } catch (error) {
      console.error('Error replacing image:', error);
      showNotificationMessage('error', 'Network error. Could not update image.');
    }
    
    setIsModalOpen(false);
    setSelectedProductForImage(null);
  };

  // Open image replace modal
  const openImageModal = (product) => {
    setSelectedProductForImage(product);
    setIsModalOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Confirm delete product
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${productToDelete._id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showNotificationMessage('success', `✅ Product "${productToDelete.name}" deleted successfully!`);
        await fetchProducts();
      } else {
        showNotificationMessage('error', 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotificationMessage('error', 'Network error. Make sure server is running.');
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  // Submit all pending changes
  const handleSubmitChanges = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      showNotificationMessage('error', 'No changes to save.');
      return;
    }

    setLoading(true);
    
    let successCount = 0;
    let failCount = 0;

    const changedProductIds = Object.keys(pendingChanges);
    
    for (const productId of changedProductIds) {
      const updatedProduct = products.find(p => p._id === productId);
      
      if (!updatedProduct) continue;

      try {
        const { _id, __v, ...productWithoutId } = updatedProduct;
        const productToSave = {
          ...productWithoutId,
          price: productWithoutId.price === '' || productWithoutId.price === null ? 0 : Number(productWithoutId.price),
          name: productWithoutId.name === '' ? '' : productWithoutId.name
        };
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productToSave)
        });
        
        if (response.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        console.error('Error updating product:', error);
        failCount++;
      }
    }

    if (successCount > 0) {
      showNotificationMessage('success', `✅ ${successCount} product(s) updated successfully! Changes applied everywhere.`);
      await fetchProducts();
    }
    if (failCount > 0) {
      showNotificationMessage('error', `⚠️ ${failCount} product(s) failed to update.`);
    }
    
    setLoading(false);
  };

  // Cancel all pending changes
  const handleCancelChanges = () => {
    if (Object.keys(pendingChanges).length === 0) {
      showNotificationMessage('error', 'No changes to cancel.');
      return;
    }
    
    setProducts(JSON.parse(JSON.stringify(originalProducts)));
    setPendingChanges({});
    showNotificationMessage('success', 'Changes discarded. Reverted to original state.');
  };

  // Go back to admin dashboard
  const goBackToAdmin = () => {
    if (Object.keys(pendingChanges).length > 0) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/admin/dashboard');
      }
    } else {
      navigate('/admin/dashboard');
    }
  };

  // Truncate description for preview
  const truncateDescription = (text) => {
    if (!text) return '';
    if (text.length <= 100) return text;
    return text.substring(0, 100) + '...';
  };

  // Get display price
  const getDisplayPrice = (product) => {
    if (!product) return '';
    const price = product.price;
    if (price === '' || price === null || price === undefined || price === 0) {
      return '';
    }
    return price;
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => {
    if (!product) return false;
    if (!searchTerm) return true;
    return product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading && products.length === 0) {
    return (
      <div className="admin-loading">
        <div className="loader"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  const hasAnyChanges = Object.keys(pendingChanges).length > 0;

  return (
    <div className="admin-manage-products">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteProduct}
        itemName={productToDelete?.name}
        isDeleting={isDeleting}
      />

      {/* Fixed Notification Bar */}
      {showNotification && (
        <div className={`fixed-notification ${notificationType}`}>
          <span>{message || error}</span>
        </div>
      )}

      {/* Back to Admin Button */}
      <div className="manage-header-top">
        <button onClick={goBackToAdmin} className="back-to-admin-btn">
          ← Back to Admin Dashboard
        </button>
      </div>

      <div className="manage-container">
        <div className="manage-header">
          <h1>Manage Products</h1>
          <p>Edit product details inline. Changes apply across entire website when submitted.</p>
        </div>

        {/* Full-Width Search Bar */}
        <div className="admin-search-container">
          <input
            type="text"
            placeholder="🔍 Search product by name..."
            className="admin-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="clear-search-btn-admin"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Results Count */}
        {searchTerm && (
          <div className="search-results-count">
            Found {filteredProducts.length} product(s) matching "{searchTerm}"
          </div>
        )}

        {hasAnyChanges && (
          <div className="unsaved-changes-banner">
            ⚠️ You have unsaved changes. Click "Submit All Changes" to save.
          </div>
        )}

        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th className="col-image">Image</th>
                <th className="col-name">Product Name</th>
                <th className="col-price">Price (Rs.)</th>
                <th className="col-category">Category</th>
                <th className="col-description">Description</th>
                <th className="col-status">Status</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    {searchTerm ? `No products found matching "${searchTerm}"` : 'No products found. Add some products first!'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  if (!product) return null;
                  const hasChanges = hasPendingChanges(product._id);
                  const updatedProduct = getUpdatedProduct(product);
                  if (!updatedProduct) return null;
                  
                  return (
                    <tr key={product._id} className={hasChanges ? 'row-edited' : ''}>
                      {/* Image Column */}
                      <td className="col-image">
                        <div className="fixed-image-box">
                          <img 
                            src={updatedProduct.imageUrl || 'https://via.placeholder.com/60'} 
                            alt={updatedProduct.name || 'Product'} 
                            className="product-thumb fixed-img"
                            onClick={() => openImageModal(product)}
                            title="Click to replace image"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/60';
                            }}
                          />
                        </div>
                      </td>
                      
                      {/* Product Name */}
                      <td className="col-name">
                        <input
                          type="text"
                          value={updatedProduct.name || ''}
                          onChange={(e) => handleFieldChange(product._id, 'name', e.target.value)}
                          className="edit-input name-input"
                          placeholder="Enter Product Name"
                        />
                      </td>
                      
                      {/* Price */}
                      <td className="col-price">
                        <input
                          type="text"
                          value={getDisplayPrice(updatedProduct)}
                          onChange={(e) => handlePriceChange(product._id, e.target.value)}
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          className="edit-input price-input"
                          placeholder="Enter Price"
                        />
                      </td>
                      
                      {/* Category */}
                      <td className="col-category">
                        <input
                          type="text"
                          value={updatedProduct.category || ''}
                          onChange={(e) => handleFieldChange(product._id, 'category', e.target.value)}
                          className="edit-input category-input"
                          placeholder="Enter Category"
                        />
                      </td>
                      
                      {/* Description */}
                      <td className="col-description">
                        {editingDescription === product._id ? (
                          <div className="chatbox-editor">
                            <textarea
                              defaultValue={updatedProduct.description || ''}
                              className="chatbox-textarea"
                              rows="3"
                              placeholder="Product description..."
                              autoFocus
                            />
                            <div className="chatbox-actions">
                              <button 
                                onClick={() => setEditingDescription(null)}
                                className="chatbox-cancel"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={(e) => {
                                  const textarea = e.target.parentElement.parentElement.querySelector('textarea');
                                  handleDescriptionEdit(product._id, textarea.value);
                                }}
                                className="chatbox-save"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="description-preview chatbox-preview"
                            onClick={() => setEditingDescription(product._id)}
                          >
                            <div className="description-scroll">
                              {updatedProduct.description ? (
                                <p>{truncateDescription(updatedProduct.description)}</p>
                              ) : (
                                <p className="no-description">Click to add description...</p>
                              )}
                            </div>
                            <div className="edit-hint">✏️ Click to edit</div>
                          </div>
                        )}
                      </td>
                      
                      {/* Status */}
                      <td className="col-status">
                        <div className="status-checkboxes">
                          <label className="status-label">
                            <input
                              type="checkbox"
                              checked={updatedProduct.inStock === true}
                              onChange={() => handleStatusChange(product._id, true)}
                              className="status-checkbox"
                            />
                            <span className="status-text in-stock-text">In Stock</span>
                          </label>
                          <label className="status-label">
                            <input
                              type="checkbox"
                              checked={updatedProduct.inStock === false}
                              onChange={() => handleStatusChange(product._id, false)}
                              className="status-checkbox"
                            />
                            <span className="status-text out-of-stock-text">Out of Stock</span>
                          </label>
                        </div>
                      </td>
                      
                      {/* Actions */}
                      <td className="col-actions">
                        <button 
                          onClick={() => openDeleteModal(product)}
                          className="delete-btn"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FIXED ACTION BUTTONS - Bottom Right Corner */}
      <div className="fixed-action-buttons">
        <button 
          onClick={handleCancelChanges} 
          className="fixed-cancel-btn"
          disabled={!hasAnyChanges || loading}
        >
          Cancel Changes
        </button>
        <button 
          onClick={handleSubmitChanges} 
          className="fixed-submit-btn"
          disabled={!hasAnyChanges || loading}
        >
          {loading ? 'Saving...' : '✓ Submit All Changes'}
        </button>
      </div>

      {/* Image Replace Modal */}
      {isModalOpen && selectedProductForImage && (
        <ImageReplaceModal
          product={selectedProductForImage}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProductForImage(null);
          }}
          onReplace={handleImageReplace}
        />
      )}
    </div>
  );
};

export default AdminManageProducts;