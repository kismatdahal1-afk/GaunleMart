// HamburgerIcon.js - Three-line menu icon
import React from 'react';
import './HamburgerIcon.css';

const HamburgerIcon = ({ onClick, isOpen }) => {
  return (
    <button 
      className={`hamburger-icon ${isOpen ? 'active' : ''}`} 
      onClick={onClick}
      aria-label="Menu"
    >
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
    </button>
  );
};

export default HamburgerIcon;