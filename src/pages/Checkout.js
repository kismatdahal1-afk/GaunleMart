// Checkout.js - Fixed version with proper navigation
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (10 digits)';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.address.trim()) newErrors.address = 'Delivery address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderId = () => {
    const prefix = 'GAUNLE';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${timestamp}-${random}`;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const deliveryFee = getTotalPrice() > 1500 ? 0 : 100;
    const grandTotal = getTotalPrice() + deliveryFee;
    
    // Prepare order data
    const orderData = {
      orderId: generateOrderId(),
      orderDate: new Date().toISOString(),
      items: cartItems.map(item => ({
        id: item.id || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        total: item.price * item.quantity
      })),
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: getTotalPrice(),
      deliveryFee: deliveryFee,
      grandTotal: grandTotal,
      deliveryDetails: {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        notes: formData.notes
      },
      status: 'Processing',
      statusSteps: ['Processing', 'Confirmed', 'Shipped', 'Delivered'],
      orderDateFormatted: new Date().toLocaleDateString('en-NP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    
    // Store in localStorage
    localStorage.setItem('orderData', JSON.stringify(orderData));
    
    // Clear cart
    clearCart();
    
    // Navigate to confirmation page
    navigate('/order-confirmation');
  };

  const goBackToCart = () => {
    navigate('/cart');
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-back-btn-container">
        <button onClick={goBackToCart} className="checkout-back-btn">
          ← Back to Cart
        </button>
      </div>

      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>
        
        <div className="checkout-grid">
          <div className="checkout-form-section">
            <h2>Delivery Information</h2>
            <form className="delivery-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
                
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label>Delivery Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address"
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label>Order Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Special instructions for delivery..."
                  rows="3"
                />
              </div>
            </form>
          </div>
          
          <div className="checkout-summary-section">
            <h2>Order Summary</h2>
            <div className="checkout-items">
              {cartItems.map(item => (
                <div key={item.id} className="checkout-item">
                  <img src={item.imageUrl} alt={item.name} className="checkout-item-img" />
                  <div className="checkout-item-details">
                    <div className="checkout-item-name">{item.name}</div>
                    <div className="checkout-item-price">
                      Rs. {item.price.toLocaleString()} x {item.quantity}
                    </div>
                  </div>
                  <div className="checkout-item-total">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="checkout-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>Rs. {getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="total-row">
                <span>Delivery Fee:</span>
                <span>Rs. {getTotalPrice() > 1500 ? 0 : 100}</span>
              </div>
              <div className="total-row grand-total">
                <span>Grand Total:</span>
                <span>Rs. {(getTotalPrice() + (getTotalPrice() > 1500 ? 0 : 100)).toLocaleString()}</span>
              </div>
            </div>
            
            <button 
              onClick={handlePlaceOrder}
              className="place-order-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
            
            <Link to="/cart" className="checkout-cart-link">
              ← Return to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;