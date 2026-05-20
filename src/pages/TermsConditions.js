// TermsConditions.js - With watermark logo
import React from 'react';
import './PolicyPages.css';

const TermsConditions = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1 style={{ textAlign: "center" }}>Terms & Conditions</h1>
        <p style={{ textAlign: "right" }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <h2>Acceptance of Terms</h2>
        <p>By using GaunleMart, you agree to these Terms & Conditions.</p>
        
        <h2>Products and Pricing</h2>
        <p>All prices are in Nepalese Rupees (Rs.) and are subject to change without notice.</p>
        
        <h2>Shipping Policy</h2>
        <p>We ship to all locations within Nepal. Delivery times vary by location.</p>
        
        <h2>Account Responsibility</h2>
        <p>You are responsible for maintaining the confidentiality of your account.</p>
      </div>
    </div>
  );
};

export default TermsConditions;