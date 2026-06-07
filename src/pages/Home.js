// Home.js - Shows category-based featured products section
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategorySection from '../components/CategorySection';
import './Home.css';

// Category configuration - Add/remove categories here
const CATEGORY_CONFIG = [
  {
    name: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500',
    description: 'Fresh organic vegetables directly from local farms. Naturally grown with care, delivered to your doorstep.',
    imagePosition: 'left'
  },
  {
    name: 'Groceries',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491d?w=500',
    description: 'Premium quality daily essentials. From rice to spices, we have everything you need for your kitchen.',
    imagePosition: 'right'
  },
  {
    name: 'Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500',
    description: 'Delicious and healthy snacks made with authentic Nepali ingredients. Perfect for your cravings.',
    imagePosition: 'left'
  },
  {
    name: 'Spices',
    imageUrl: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=500',
    description: 'Authentic Nepali spices that add flavor to every dish. Pure, aromatic, and freshly sourced.',
    imagePosition: 'right'
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
        
        {CATEGORY_CONFIG.map((category, index) => (
          <CategorySection
            key={index}
            category={category.name}
            imageUrl={category.imageUrl}
            description={category.description}
            products={allProducts}
            imagePosition={category.imagePosition}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;