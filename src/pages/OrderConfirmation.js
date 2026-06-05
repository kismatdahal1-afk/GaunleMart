// OrderConfirmation.js - Receipt style order confirmation page
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch order data from localStorage
    const storedOrder = localStorage.getItem('orderData');
    console.log('🔍 OrderConfirmation - Checking localStorage');
    console.log('📦 orderData:', storedOrder);
    
    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);
      console.log('✅ Order found:', parsedOrder.orderId);
      setOrderData(parsedOrder);
    } else {
      console.log('❌ No order found in localStorage');
      // Redirect to products page after 3 seconds if no order
      setTimeout(() => {
        navigate('/products');
      }, 3000);
    }
    setLoading(false);
  }, [navigate]);

  const goBackToCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="order-loading">
        <div className="loader"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="order-not-found">
        <div className="order-not-found-content">
          <span className="not-found-icon">⚠️</span>
          <h2>No Order Found</h2>
          <p>We couldn't find any order information. Please place an order first.</p>
          <Link to="/products" className="shop-now-btn">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const { 
    orderId, 
    orderDateFormatted, 
    items, 
    totalItems, 
    subtotal, 
    deliveryFee, 
    grandTotal, 
    deliveryDetails,
    notes
  } = orderData;

  return (
    <div className="order-confirmation-page">
      {/* Back Button */}
      <div className="confirmation-back-btn-container">
        <button onClick={goBackToCheckout} className="confirmation-back-btn">
          ← Back to Checkout
        </button>
      </div>

      <div className="confirmation-container">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">✓</div>
          <h1 className="success-title">Order Placed Successfully!</h1>
          <p className="success-message">Thank you for shopping with GaunleMart</p>
        </div>

        {/* Order Info Card */}
        <div className="info-card">
          <div className="info-row">
            <span className="info-label">Order ID:</span>
            <span className="info-value order-id">{orderId}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Date & Time:</span>
            <span className="info-value">{orderDateFormatted}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Status:</span>
            <span className="info-value order-status-processing">Processing</span>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="summary-card">
          <h3 className="card-title">Order Summary</h3>
          <div className="summary-items">
            {items && items.map((item, index) => (
              <div key={index} className="summary-item">
                <img src={item.imageUrl} alt={item.name} className="summary-item-img" />
                <div className="summary-item-details">
                  <div className="summary-item-name">{item.name}</div>
                  <div className="summary-item-meta">
                    Rs. {item.price.toLocaleString()} x {item.quantity}
                  </div>
                </div>
                <div className="summary-item-total">
                  Rs. {item.total.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          
          <div className="summary-totals">
            <div className="total-line">
              <span>Subtotal ({totalItems} items):</span>
              <span>Rs. {subtotal?.toLocaleString() || 0}</span>
            </div>
            <div className="total-line">
              <span>Delivery Fee:</span>
              <span>Rs. {deliveryFee || 0}</span>
            </div>
            <div className="total-line grand">
              <span>Grand Total:</span>
              <span>Rs. {grandTotal?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        {/* Delivery Details Card */}
        <div className="delivery-card">
          <h3 className="card-title">Delivery Details</h3>
          <div className="delivery-info">
            <div className="delivery-field">
              <span className="field-label">Name:</span>
              <span className="field-value">{deliveryDetails?.fullName}</span>
            </div>
            <div className="delivery-field">
              <span className="field-label">Phone:</span>
              <span className="field-value">{deliveryDetails?.phone}</span>
            </div>
            <div className="delivery-field">
              <span className="field-label">Email:</span>
              <span className="field-value">{deliveryDetails?.email}</span>
            </div>
            <div className="delivery-field">
              <span className="field-label">Address:</span>
              <span className="field-value">{deliveryDetails?.address}, {deliveryDetails?.city}</span>
            </div>
            {notes && (
              <div className="delivery-field">
                <span className="field-label">Order Notes:</span>
                <span className="field-value">{notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <Link to="/products" className="action-btn continue-shopping">
            Continue Shopping
          </Link>
          <Link to="/" className="action-btn go-home">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;