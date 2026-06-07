// Home.js - Category-based featured products with hardcoded categories
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategorySection from '../components/CategorySection';
import './Home.css';

// HARDCODED CATEGORIES - ONLY THESE 5 WILL SHOW (Admin added categories ignored)
const HARDCODED_CATEGORIES = [
  {
    name: 'Vegetables',
    description: 'Fresh organic vegetables directly from local farms. Naturally grown with care, delivered to your doorstep.',
    imagePosition: 'left'
  },
  {
    name: 'Groceries',
    description: 'Premium quality daily essentials. From rice to spices, we have everything you need for your kitchen.',
    imagePosition: 'right'
  },
  {
    name: 'Snacks',
    description: 'Delicious and healthy snacks made with authentic Nepali ingredients. Perfect for your cravings.',
    imagePosition: 'left'
  },
  {
    name: 'Spices & Masala',
    description: 'Authentic Nepali spices that add flavor to every dish. Pure, aromatic, and freshly sourced.',
    imagePosition: 'right'
  },
  {
    name: 'Beverage',
    description: 'Refreshing beverages and drinks. From traditional to modern, find your perfect sip here.',
    imagePosition: 'left'
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products`);
      const data = await response.json();
      setAllProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleShopNow = () => {
    navigate('/products');
  };

  const handleVisitProductsPage = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loader"></div>
        <p>Loading amazing products...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="welcome-banner">
            <span className="welcome-text">WELCOME TO</span>
          </div>
          
          <h1 className="hero-title">GAUNLE <span className="title-highlight">MART</span></h1>
          
          <div className="hero-features">
            <span className="feature-badge">ORGANIC</span>
            <span className="feature-divider">•</span>
            <span className="feature-badge">AUTHENTIC</span>
            <span className="feature-divider">•</span>
            <span className="feature-badge">HYGIENIC</span>
            <span className="feature-divider">•</span>
            <span className="feature-badge">QUALITY</span>
          </div>
          
          <p className="hero-tagline">YOUR TRUSTED MART FOR EVERY NEED</p>
          <p className="hero-description">
            From daily groceries to baby care, fashion to home essentials — Gaunle Mart brings quality, variety, and care to your doorstep.
          </p>
          
          <div className="hero-benefits">
            <div className="benefit-card">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">Fresh & Quality</span>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">Wide Variety</span>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">Best Prices</span>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">Customer First</span>
            </div>
          </div>
          
          <button 
            className="hero-cta-btn"
            onClick={handleShopNow}
          >
            SHOP NOW
          </button>
        </div>
      </div>

      {/* Category-Based Featured Products Section */}
      <div id="products-section" className="featured-products-section">
        <div className="section-header">
          <h2 className="section-title">FEATURED PRODUCTS</h2>
          <p className="section-subtitle">Discover our finest in-stock products from Gaunle Mart</p>
        </div>
        
        {HARDCODED_CATEGORIES.map((category, index) => (
          <CategorySection
            key={index}
            category={category.name}
            description={category.description}
            products={allProducts}
            imagePosition={category.imagePosition}
          />
        ))}
        
        {/* Final CTA Button */}
        <div className="final-cta-container">
          <button 
            className="final-cta-btn"
            onClick={handleVisitProductsPage}
          >
            Visit Products Page →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;