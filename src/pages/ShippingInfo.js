// ShippingInfo.js
import React from 'react';
import './PolicyPages.css';

const ShippingInfo = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1 style={{ textAlign: "center" }}>Shipping Information</h1>
        <p style={{ textAlign: "right" }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <h2>Delivery Areas</h2>
        <p>We deliver to all major cities and towns across Nepal.</p>
        
        <h2>Delivery Time</h2>
        <p>Kathmandu Valley: 1-2 business days</p>
        <p>Outside Valley: 3-5 business days</p>
        
        <h2>Shipping Charges</h2>
        <p>Free shipping on orders over Rs. 1500. Otherwise, Rs. 100 shipping fee applies.</p>
        
        <h2>Order Tracking</h2>
        <p>You will receive a tracking number via email once your order ships.</p>
      </div>
    </div>
  );
};

export default ShippingInfo;