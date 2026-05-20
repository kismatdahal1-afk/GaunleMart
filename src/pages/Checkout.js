// Checkout.js - Checkout page with order summary and delivery form
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    email: ''
  });
  
  // Form errors
  const [errors, setErrors] = useState({});
  
  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Generate temporary order ID
  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `GAUNLE-${timestamp}-${random}`;
  };
  
  // Handle place order
  const handlePlaceOrder = () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Create order object
    const orderData = {
      orderId: generateOrderId(),
      orderDate: new Date().toISOString(),
      customer: formData,
      items: cartItems.map(item => ({
        id: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl
      })),
      totalAmount: getTotalPrice(),
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Khalti',
      status: 'Processing',
      estimatedDelivery: '2-5 business days'
    };
    
    // Store order in sessionStorage (temporary - will be replaced with backend)
    sessionStorage.setItem('lastOrder', JSON.stringify(orderData));
    
    // Clear cart
    clearCart();
    
    // Redirect to order confirmation page
    setTimeout(() => {
      setLoading(false);
      navigate('/order-confirmation');
    }, 500);
  };
  
  if (cartItems.length === 0) {
    return null; // Will redirect
  }
  
  const totalPrice = getTotalPrice();
  const shippingCharge = totalPrice > 1500 ? 0 : 100;
  const grandTotal = totalPrice + shippingCharge;
  
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>
        
        <div className="checkout-grid">
          {/* Left Column - Order Summary */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item._id || item.id} className="summary-item">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="summary-item-image"
                  />
                  <div className="summary-item-details">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                    <p className="summary-item-price">Rs. {item.price.toLocaleString()}</p>
                  </div>
                  <div className="summary-item-subtotal">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>Rs. {totalPrice.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>{shippingCharge === 0 ? 'Free' : `Rs. ${shippingCharge}`}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Delivery Form & Payment */}
          <div className="checkout-form-section">
            {/* Delivery Details Form */}
            <div className="delivery-form">
              <h2>Delivery Details</h2>
              
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
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>
              
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
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
              
              <div className="form-group">
                <label>Delivery Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your full delivery address"
                  rows="3"
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>
              
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="payment-method">
              <h2>Payment Method</h2>
              
              <label className="payment-option active">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-option-content">
                  <span className="payment-icon">💵</span>
                  <div>
                    <strong>Cash on Delivery</strong>
                    <p>Pay when you receive your order</p>
                  </div>
                </div>
              </label>
              
              <label className="payment-option disabled">
                <input
                  type="radio"
                  name="payment"
                  value="khalti"
                  disabled
                />
                <div className="payment-option-content">
                  <span className="payment-icon">💳</span>
                  <div>
                    <strong>Khalti</strong>
                    <p>Coming Soon – We will update this feature later</p>
                  </div>
                </div>
              </label>
            </div>
            
            {/* Place Order Button */}
            <button 
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;