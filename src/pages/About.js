// About.js - Simple about page
import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About GaunleMart</h1>
        <p>Welcome to GaunleMart, your trusted online marketplace for authentic Nepali products.</p>
        
        <h2>Our Mission</h2>
        <p>To bring fresh, organic products from local villages directly to your doorstep while supporting local farmers and artisans.</p>
        
        <h2>Our Vision</h2>
        <p>To become Nepal's most trusted online marketplace for organic and locally sourced products.</p>
        
        <h2>Why Choose Us?</h2>
        <ul>
          <li>✓ 100% Organic Products</li>
          <li>✓ Direct from Farmers</li>
          <li>✓ Best Prices Guaranteed</li>
          <li>✓ Fast Delivery</li>
        </ul>
      </div>
    </div>
  );
};

export default About;