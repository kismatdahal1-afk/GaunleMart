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
    console.log('Stored Order:', storedOrder); // Debug log
    
    if (storedOrder) {
      setOrderData(JSON.parse(storedOrder));
    }
    setLoading(false);
  }, []);

  // Back to checkout button handler
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

  const { orderId, orderDateFormatted, items, totalItems, totalPrice, deliveryDetails, status, statusSteps } = orderData;
  const deliveryFee = totalPrice > 1500 ? 0 : 100;
  const grandTotal = totalPrice + deliveryFee;

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
        </div>

        {/* Order Summary Card */}
        <div className="summary-card">
          <h3 className="card-title">Order Summary</h3>
          <div className="summary-items">
            {items.map((item, index) => (
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
              <span>Rs. {totalPrice.toLocaleString()}</span>
            </div>
            <div className="total-line">
              <span>Delivery Fee:</span>
              <span>Rs. {deliveryFee}</span>
            </div>
            <div className="total-line grand">
              <span>Grand Total:</span>
              <span>Rs. {grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery Details Card */}
        <div className="delivery-card">
          <h3 className="card-title">Delivery Details</h3>
          <div className="delivery-info">
            <div className="delivery-field">
              <span className="field-label">Name:</span>
              <span className="field-value">{deliveryDetails.fullName}</span>
            </div>
            <div className="delivery-field">
              <span className="field-label">Phone:</span>
              <span className="field-value">{deliveryDetails.phone}</span>
            </div>
            <div className="delivery-field">
              <span className="field-label">Email:</span>
              <span className="field-value">{deliveryDetails.email}</span>
            </div>
            <div className="delivery-field">
              <span className="field-label">Address:</span>
              <span className="field-value">{deliveryDetails.address}, {deliveryDetails.city}</span>
            </div>
            {deliveryDetails.notes && (
              <div className="delivery-field">
                <span className="field-label">Notes:</span>
                <span className="field-value">{deliveryDetails.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Order Status Card */}
        <div className="status-card">
          <h3 className="card-title">Order Status</h3>
          <div className="status-steps">
            {statusSteps.map((step, index) => {
              const currentStepIndex = statusSteps.indexOf(status);
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={index} className={`status-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                  <div className="step-dot">
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <div className="step-label">{step}</div>
                  {index < statusSteps.length - 1 && <div className="step-line"></div>}
                </div>
              );
            })}
          </div>
          <div className="status-message">
            Your order is currently being processed. You will receive an email confirmation shortly.
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