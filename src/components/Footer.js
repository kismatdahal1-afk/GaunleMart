// Footer.js - Compact footer with 5 columns in one row
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logoImage from '../images/logo.jpg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Function to handle link click - scroll to top
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Column 1: Brand Section */}
        <div className="footer-col">
          <div className="footer-logo">
            <div className="logo-circle">
              <img src={logoImage} alt="GaunleMart Logo" className="footer-logo-img" />
            </div>
            <h2 className="footer-brand-name">Gaunle<span className="brand-highlight">Mart</span></h2>
          </div>
          <p className="brand-description">
            Fresh organic products from local villages, delivered to your doorstep.
          </p>
          <div className="trust-badge">
            <span>✓ 100% Organic</span>
            <span>✓ Direct from Farmers</span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/" onClick={handleLinkClick}>🏠 Home</Link></li>
            <li><Link to="/products" onClick={handleLinkClick}>📦 Products</Link></li>
            <li><Link to="/cart" onClick={handleLinkClick}>🛒 Cart</Link></li>
            <li><Link to="/blog" onClick={handleLinkClick}>📝 Blog</Link></li>
            <li><Link to="/about" onClick={handleLinkClick}>ℹ️ About</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact Section */}
        <div className="footer-col">
          <h3 className="footer-title">Contact Us</h3>
          <ul className="footer-contact">
            <li>
              <span className="contact-icon">📞</span>
              <a href="tel:+9779764250274">+977 9764250274</a>
            </li>
            <li>
              <span className="contact-icon">✉️</span>
              <a href="mailto:higuyskxa@gmail.com">higuyskxa@gmail.com</a>
            </li>
            <li>
              <span className="contact-icon">📍</span>
              <span>Kapan, Kathmandu</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Policies */}
        <div className="footer-col">
          <h3 className="footer-title">Policies</h3>
          <ul className="footer-links">
            <li><Link to="/privacy" onClick={handleLinkClick}>🔒 Privacy Policy</Link></li>
            <li><Link to="/return" onClick={handleLinkClick}>🔄 Return Policy</Link></li>
            <li><Link to="/terms" onClick={handleLinkClick}>📜 Terms & Conditions</Link></li>
            <li><Link to="/shipping" onClick={handleLinkClick}>🚚 Shipping Info</Link></li>
          </ul>
        </div>

        {/* Column 5: Social Media */}
        <div className="footer-col">
          <h3 className="footer-title">Follow Us</h3>
          <div className="social-links">
            <a 
              href="https://www.facebook.com/kismat.dahal.642239" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
              onClick={handleLinkClick}
            >
              📘 Facebook
            </a>
            <a 
              href="https://www.instagram.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
              onClick={handleLinkClick}
            >
              📷 Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>&copy; {currentYear} GaunleMart. All rights reserved.</p>
          <p>Made with ❤️ for Nepal</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;