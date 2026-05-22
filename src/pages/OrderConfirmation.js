// OrderConfirmation.js - Fixed version with proper data reading
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Small delay to ensure localStorage is ready
    setTimeout(() => {
      const storedOrder = localStorage.getItem('orderData');
      console.log('🔍 Checking localStorage for orderData:', storedOrder);
      
      if (storedOrder) {
        const parsedOrder = JSON.parse(storedOrder);
        console.log('✅ Order data found:', parsedOrder);
        setOrderData(parsedOrder);
      } else {
        console.log('❌ No order data found in localStorage');
      }
      setLoading(false);
    }, 100);
  }, []);

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
          <button onClick={() => navigate('/products')} className="shop-now-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const { 
    orderId, 
    orderDateFormatted, 
    items, 
    totalItems, 
    totalPrice, 
    deliveryDetails, 
    status, 
    statusSteps,
    deliveryFee,
    grandTotal 
  } = orderData;

  const finalDeliveryFee = deliveryFee !== undefined ? deliveryFee : (totalPrice > 1500 ? 0 : 100);
  const finalGrandTotal = grandTotal !== undefined ? grandTotal : (totalPrice + finalDeliveryFee);

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-back-btn-container">
        <button onClick={goBackToCheckout} className="confirmation-back-btn">
          ← Back to Checkout
        </button>
      </div>

      <div className="confirmation-container">
        <div className="success-header">
          <div className="success-icon">✓</div>
          <h1 className="success-title">Order Placed Successfully!</h1>
          <p className="success-message">Thank you for shopping with GaunleMart</p>
        </div>

        <div className="info-card">
          <div className="info-row">
            <span className="info-label">Order ID:</span>
            <span className="info-value order-id">{orderId}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Date & Time:</span>
            <span className="info-value">{orderDateFormatted || new Date().toLocaleString()}</span>
          </div>
        </div>

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
              <span>Subtotal ({totalItems || 0} items):</span>
              <span>Rs. {(totalPrice || 0).toLocaleString()}</span>
            </div>
            <div className="total-line">
              <span>Delivery Fee:</span>
              <span>Rs. {finalDeliveryFee}</span>
            </div>
            <div className="total-line grand">
              <span>Grand Total:</span>
              <span>Rs. {finalGrandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="delivery-card">
          <h3 className="card-title">Delivery Details</h3>
          <div className="delivery-info">
            <div className="delivery-field">
              <span className="field-label">Name:</span>
              <span className="field-value">{deliveryDetails?.fullName || 'N/A'}</span>
            </div>
            <div className="delivery-field">
              <span className="field-label">Phone:</span>
              <span className="field-value">{deliveryDetails?.phone || 'N/A'}</span>
            </div>
            <div className="delivery-field">
              <span className="field-label">Email:</span>
              <span className="field-value">{deliveryDetails?.email || 'N/A'}</span>
            </div>
            <div className="delivery-field">
              <span className="field-label">Address:</span>
              <span className="field-value">{deliveryDetails?.address || 'N/A'}, {deliveryDetails?.city || 'N/A'}</span>
            </div>
            {deliveryDetails?.notes && (
              <div className="delivery-field">
                <span className="field-label">Notes:</span>
                <span className="field-value">{deliveryDetails.notes}</span>
              </div>
            )}
          </div>
        </div>

        <div className="status-card">
          <h3 className="card-title">Order Status</h3>
          <div className="status-steps">
            {(statusSteps || ['Processing', 'Confirmed', 'Shipped', 'Delivered']).map((step, index) => {
              const currentStepIndex = (statusSteps || ['Processing']).indexOf(status || 'Processing');
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={index} className={`status-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                  <div className="step-dot">
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <div className="step-label">{step}</div>
                  {index < (statusSteps || []).length - 1 && <div className="step-line"></div>}
                </div>
              );
            })}
          </div>
          <div className="status-message">
            Your order is currently being processed. You will receive an email confirmation shortly.
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate('/products')} className="action-btn continue-shopping">
            Continue Shopping
          </button>
          <button onClick={() => navigate('/')} className="action-btn go-home">
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;