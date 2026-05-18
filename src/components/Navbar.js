// Navbar.js - Navigation bar with hamburger menu drawer
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import HamburgerIcon from './HamburgerIcon';
import NavigationDrawer from './NavigationDrawer';
import logoImage from '../images/logo.jpg';
import './Navbar.css';

const Navbar = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Function to scroll to top when clicking links
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const openDrawer = () => {
    setIsDrawerOpen(true);
  };
  
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };
  
  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <Link to="/" className="logo-link" onClick={handleLinkClick}>
              <div className="nav-logo-circle">
                <img src={logoImage} alt="GaunleMart Logo" className="nav-logo-img" />
              </div>
              <span className="nav-logo-text">Gaunle<span className="logo-highlight">Mart</span></span>
            </Link>
          </div>
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={handleLinkClick}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className="nav-link" onClick={handleLinkClick}>Products</Link>
            </li>
            <li className="nav-item">
              <Link to="/cart" className="nav-link" onClick={handleLinkClick}>
                Cart
                {totalItems > 0 && (
                  <span className="cart-count">{totalItems}</span>
                )}
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/blog" className="nav-link" onClick={handleLinkClick}>Blog</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/dashboard" className="nav-link admin-link" onClick={handleLinkClick}>👑 Admin</Link>
            </li>
            <li className="nav-item hamburger-item">
              <HamburgerIcon onClick={openDrawer} isOpen={isDrawerOpen} />
            </li>
          </ul>
        </div>
      </nav>
      
      {/* Navigation Drawer */}
      <NavigationDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </>
  );
};

export default Navbar;