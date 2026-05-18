// NavigationDrawer.js - Vertical sliding navigation drawer with Admin link
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NavigationDrawer.css';
import logoImage from '../images/logo.jpg';

function NavigationDrawer({ isOpen, onClose }) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle link click - close drawer and scroll to top
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose} />

      {/* Drawer */}
      <div className={`navigation-drawer ${isOpen ? 'open' : ''}`}>
        {/* Close button */}
        <button className="drawer-close" onClick={onClose}>
          ✕
        </button>

        {/* Brand Section */}
        <div className="drawer-brand">
          <div className="drawer-logo">
            <div className="drawer-logo-circle">
              <img src={logoImage} alt="GaunleMart Logo" className="drawer-logo-img" />
            </div>
            <h2 className="drawer-brand-name">Gaunle<span className="brand-highlight">Mart</span></h2>
          </div>
          <p className="drawer-brand-description">
            Fresh organic products from local villages, delivered to your doorstep with love and care.
          </p>
          <div className="drawer-trust-badge">
            <span>✓ 100% Organic</span>
            <span>✓ Direct from Farmers</span>
          </div>
        </div>

        {/* Divider */}
        <div className="drawer-divider"></div>

        {/* Quick Links Section - ADDED ADMIN LINK */}
        <div className="drawer-section">
          <h3 className="drawer-section-title">Quick Links</h3>
          <ul className="drawer-links">
            <li><Link to="/" onClick={handleLinkClick}>🏠 Home</Link></li>
            <li><Link to="/products" onClick={handleLinkClick}>📦 Products</Link></li>
            <li><Link to="/cart" onClick={handleLinkClick}>🛒 Cart</Link></li>
            <li><Link to="/blog" onClick={handleLinkClick}>📝 Blog</Link></li>
            <li><Link to="/about" onClick={handleLinkClick}>ℹ️ About</Link></li>
            <li><Link to="/admin/dashboard" onClick={handleLinkClick}>👑 Admin</Link></li>
          </ul>
        </div>

        {/* Policies Section */}
        <div className="drawer-section">
          <h3 className="drawer-section-title">Policies</h3>
          <ul className="drawer-links">
            <li><Link to="/privacy" onClick={handleLinkClick}>🔒 Privacy Policy</Link></li>
            <li><Link to="/return" onClick={handleLinkClick}>🔄 Return Policy</Link></li>
            <li><Link to="/terms" onClick={handleLinkClick}>📜 Terms & Conditions</Link></li>
            <li><Link to="/shipping" onClick={handleLinkClick}>🚚 Shipping Info</Link></li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div className="drawer-section">
          <h3 className="drawer-section-title">Follow Us</h3>
          <div className="drawer-social">
            <a
              href="https://www.facebook.com/kismat.dahal.642239"
              target="_blank"
              rel="noopener noreferrer"
              className="drawer-social-link"
              onClick={handleLinkClick}
            >
              📘 Facebook
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="drawer-social-link"
              onClick={handleLinkClick}
            >
              📷 Instagram
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="drawer-section">
          <h3 className="drawer-section-title">Contact Us</h3>
          <ul className="drawer-contact">
            <li>📞 <a href="tel:+9779764250274">+977 9764250274</a></li>
            <li>✉️ <a href="mailto:higuyskxa@gmail.com">higuyskxa@gmail.com</a></li>
            <li>📍 Kapan, Kathmandu</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default NavigationDrawer;