// ReturnPolicy.js - With watermark logo
import React from 'react';
import './PolicyPages.css';

const ReturnPolicy = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1 style={{ textAlign: "center" }}>Return Policy</h1>
        <p style={{ textAlign: "right" }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2>30-Day Return Window</h2>
        <p>You have 30 days from the date of delivery to return any unused product.</p>
        
        <h2>Return Conditions</h2>
        <p>Products must be unused, in original packaging, and with all tags attached.</p>
        
        <h2>How to Return</h2>
        <p>Contact our customer service at +977 9764250274 to initiate a return.</p>
        
        <h2>Refund Process</h2>
        <p>Refunds will be processed within 7-10 business days after we receive the returned item.</p>
      </div>
    </div>
  );
};

export default ReturnPolicy;