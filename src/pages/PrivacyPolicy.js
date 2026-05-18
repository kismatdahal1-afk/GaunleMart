// PrivacyPolicy.js
import React from 'react';
import './PolicyPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1 style={{ textAlign: "center" }}>Privacy Policy</h1>
        <p style={{ textAlign: "right" }}>
  Last updated: {new Date().toLocaleDateString()}
</p>
        
        <h2>Information We Collect</h2>
        <p>At GaunleMart, we collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.</p>
        
        <h2>How We Use Your Information</h2>
        <p>We use your information to process orders, communicate with you, and improve our services.</p>
        
        <h2>Information Sharing</h2>
        <p>We do not share your personal information with third parties except as necessary to fulfill your orders.</p>
        
        <h2>Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact us at higuyskxa@gmail.com</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;