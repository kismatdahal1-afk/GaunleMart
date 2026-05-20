// OrderConfirmation.js - Order confirmation page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get order from sessionStorage
    const storedOrder = sessionStorage.getItem('lastOrder');
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
      setLoading(false);
    } else {
      // No order found, redirect to home
      navigate('/');
    }
  }, [navigate]);
  
  const getStatusStep = (status) => {
    const steps = ['Processing', 'Shipped', 'Delivered'];
    const currentIndex = steps.indexOf(status);
    return currentIndex >= 0 ? currentIndex : 0;
  };
  
  if (loading) {
    return (
      <div className="confirmation-loading">
        <div className="loader"></div>
        <p>Loading order details...</p>
      </div>
    );
  }
  
  if (!order) {
    return null;
  }
  
  const currentStep = getStatusStep(order.status);
  
  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        {/* Header Section */}
        <div className="confirmation-header">
          <div className="success-icon">🎉</div>
          <h1>Thank You for Your Order!</h1>
          <p>Your order has been placed successfully.</p>
          <div className="order-id-badge">Order ID: {order.orderId}</div>
        </div>
        
        <div className="confirmation-grid">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <img src={item.imageUrl} alt={item.name} className="order-item-image" />
                  <div className="order-item-details">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                    <p className="order-item-price">Rs. {item.price.toLocaleString()}</p>
                  </div>
                  <div className="order-item-total">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="order-totals">
              <div className="order-total-row">
                <span>Total Amount:</span>
                <span className="total-amount">Rs. {order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="order-total-row">
                <span>Payment Method:</span>
                <span>{order.paymentMethod}</span>
              </div>
            </div>
          </div>
          
          {/* Delivery Status */}
          <div className="delivery-status">
            <h2>Delivery Status</h2>
            <div className="status-steps">
              <div className={`status-step ${currentStep >= 0 ? 'active' : ''} ${currentStep > 0 ? 'completed' : ''}`}>
                <div className="step-icon">📦</div>
                <div className="step-label">Processing</div>
              </div>
              <div className={`status-line ${currentStep >= 1 ? 'active' : ''}`}></div>
              <div className={`status-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                <div className="step-icon">🚚</div>
                <div className="step-label">Shipped</div>
              </div>
              <div className={`status-line ${currentStep >= 2 ? 'active' : ''}`}></div>
              <div className={`status-step ${currentStep >= 2 ? 'active' : ''}`}>
                <div className="step-icon">✅</div>
                <div className="step-label">Delivered</div>
              </div>
            </div>
            <p className="estimated-delivery">
              Estimated Delivery: <strong>{order.estimatedDelivery}</strong>
            </p>
          </div>
          
          {/* Delivery Details */}
          <div className="delivery-details">
            <h2>Delivery Details</h2>
            <div className="details-card">
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span>{order.customer.fullName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span>{order.customer.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <span>{order.customer.address}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span>{order.customer.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Order Date:</span>
                <span>{new Date(order.orderDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={() => navigate('/products')} className="continue-shopping-btn-confirm">
            Continue Shopping
          </button>
          <button onClick={() => alert('Order tracking will be available soon!')} className="track-order-btn">
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;