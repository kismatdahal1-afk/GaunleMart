// Home.js - Shows only In Stock products (max 6)
// UPDATED: Shop Now button now redirects to Products page instead of scrolling
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // ADDED for navigation
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();  // ADDED for programmatic navigation
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

  // Filter ONLY "In Stock" products and limit to 6
  const inStockProducts = allProducts.filter(product => product.inStock === true);
  const featuredProducts = inStockProducts.slice(0, 6);

  // Handle Shop Now button click - redirect to Products page
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
          
          {/* Shop Now Button - UPDATED: Now redirects to Products page */}
          <button 
            className="hero-cta-btn"
            onClick={handleShopNow}
          >
            SHOP NOW
          </button>
        </div>
      </div>

      {/* Featured Products Section - Only In Stock Products */}
      <div id="products-section" className="products-section">
        <h2 className="section-title">FEATURED PRODUCTS</h2>
        <p className="section-subtitle">Discover our finest in-stock products from Gaunle Mart</p>
        
        {featuredProducts.length === 0 ? (
          <div className="no-products-message">
            <p>No in-stock products available at the moment.</p>
            <button 
              className="add-product-redirect"
              onClick={() => window.location.href = '/admin/dashboard'}
            >
              Go to Admin Panel
            </button>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {featuredProducts.map((product, index) => (
                <div 
                  key={product._id} 
                  className="product-card-wrapper"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            
            {/* View All Products Button */}
            <div className="view-all-container">
              <button 
                className="view-all-btn"
                onClick={() => window.location.href = '/products'}
              >
                View All Products →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;