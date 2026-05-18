// ProductDetail.js - Fetches product from MongoDB using _id
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  const params = new URLSearchParams(location.search);
  const returnCategory = params.get('category') || 'All';

  // Show notification with auto-hide
  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // UPDATED: Using environment variable for API URL
  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Product not found');
        } else {
          setError('Failed to load product');
        }
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      setProduct(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Network error. Make sure the server is running.');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 99) {
      setQuantity(value);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < 99) {
      setQuantity(quantity + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      const cartProduct = {
        ...product,
        id: product._id
      };
      addToCart(cartProduct, quantity);
      showNotificationMessage(`✓ ${product.name} added to cart successfully!`);
    }
  };
  
  const goBack = () => {
    let productsUrl = '/products';
    if (returnCategory && returnCategory !== 'All') {
      productsUrl = `/products?category=${encodeURIComponent(returnCategory)}`;
    }
    navigate(productsUrl);
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loader"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>{error || "Sorry, the product you're looking for doesn't exist."}</p>
        <button onClick={() => navigate('/')} className="back-home-btn">
          Back to Home
        </button>
      </div>
    );
  }

  const imageUrl = product.imageUrl || 'https://picsum.photos/id/1/400/400';
  const isInStock = product.inStock === true;
  const stockText = isInStock ? '✓ In Stock' : '✗ Out of Stock';
  const stockClass = isInStock ? 'in-stock' : 'out-of-stock';

  return (
    <div className="product-detail">
      {showNotification && (
        <div className="fixed-notification-cart success">
          <span>{notificationMessage}</span>
        </div>
      )}

      <div className="product-detail-wrapper">
        <div className="back-button-container">
          <button onClick={goBack} className="back-button" title="Back to Products">
            ← Back to Products
          </button>
        </div>
        
        <div className="product-detail-container">
          <div className="product-detail-image">
            <img src={imageUrl} alt={product.name} />
          </div>
          
          <div className="product-detail-info">
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-category">{product.category || 'General'}</p>
            <p className="product-detail-price">Rs. {product.price.toLocaleString()}</p>
            
            <div className="product-detail-rating">
              {'★'.repeat(Math.floor(product.rating || 4))}
              {'☆'.repeat(5 - Math.floor(product.rating || 4))}
              <span className="rating-text">({product.rating || 4} out of 5)</span>
            </div>
            
            <div className="product-detail-stock">
              <span className={stockClass}>{stockText}</span>
            </div>
            
            <div className="product-detail-description">
              <h3>Description</h3>
              <p>{product.description || 'No description available.'}</p>
            </div>
            
            <div className="product-detail-quantity">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button onClick={decreaseQuantity} className="qty-btn" disabled={!isInStock}>-</button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={handleQuantityChange}
                  min="1"
                  max="99"
                  className="qty-input"
                  disabled={!isInStock}
                />
                <button onClick={increaseQuantity} className="qty-btn" disabled={!isInStock}>+</button>
              </div>
            </div>
            
            <button 
              onClick={handleAddToCart} 
              className="add-to-cart-btn"
              disabled={!isInStock}
            >
              {isInStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            
            <button onClick={() => navigate('/')} className="continue-shopping-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;