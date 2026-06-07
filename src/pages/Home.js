// Home.js - Shows only In Stock products (max 6) with Featured Categories section
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Home.css';

// Import local category images
import img1 from '../images/img1';
import img2 from '../images/img2';
import img3 from '../images/img3';
import img4 from '../images/img4';
import img5 from '../images/img5';

const Home = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Refs for scroll animation
  const categoryRefs = useRef([]);

  // Category data
  const categories = [
    {
      id: 1,
      name: "Vegetables",
      image: img1,
      imageAlt: "Fresh Vegetables",
      side: "image-left",
      description: [
        "Fresh and locally sourced vegetables for your daily needs",
        "Naturally grown with care and full of nutrition",
        "Handpicked to ensure quality and freshness every day",
        
      ]
    },
    {
      id: 2,
      name: "Grocery",
      image: img2,
      imageAlt: "Grocery Items",
      side: "image-right",
      description: [
        "All essential daily items in one convenient place",
        "High-quality products you can trust every day",
        "From grains to oils, everything for your kitchen",
        "Making your daily shopping simple and reliable"
      ]
    },
    {
      id: 3,
      name: "Snacks",
      image: img3,
      imageAlt: "Snacks",
      side: "image-left",
      description: [
        "Tasty and crunchy snacks for every mood",
        "Perfect for tea time, travel, or quick bites",
        "A variety of flavors loved by everyone",
        "Enjoy freshness and taste in every bite"
      ]
    },
    {
      id: 4,
      name: "Spices & Masala",
      image: img4,
      imageAlt: "Spices and Masala",
      side: "image-right",
      description: [
        "Authentic spices to enhance your cooking",
        "Rich aroma and traditional flavors",
        "Carefully selected for best quality",
        "Bring real taste to your kitchen"
      ]
    },
    {
      id: 5,
      name: "Beverages",
      image: img5,
      imageAlt: "Beverages",
      side: "image-left",
      description: [
        "Refreshing drinks for every moment",
        "From juices to soft drinks and more",
        "Perfect to stay cool and energized",
        "Enjoy your favorite beverages anytime"
      ]
    }
  ];

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

  // Scroll animation observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    categoryRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Filter ONLY "In Stock" products and limit to 6
  const inStockProducts = allProducts.filter(product => product.inStock === true);
  const featuredProducts = inStockProducts.slice(0, 6);

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

      {/* ========== FEATURED CATEGORIES SECTION ========== */}
      <div className="featured-categories-section">
        <div className="categories-header">
          <h2 className="categories-title">Shop by Category</h2>
          <p className="categories-subtitle">Explore our diverse range of quality products</p>
        </div>

        {categories.map((category, index) => (
          <div 
            key={category.id}
            ref={el => categoryRefs.current[index] = el}
            className={`category-row ${category.side} animate-on-scroll-category`}
          >
            {category.side === 'image-left' ? (
              <>
                <div className="category-image-wrapper">
                  <div className="category-image-container">
                    <img 
                      src={category.image} 
                      alt={category.imageAlt} 
                      className="category-image"
                    />
                    <div className="image-edge-blur image-edge-left"></div>
                    <div className="image-edge-blur image-edge-right"></div>
                  </div>
                </div>
                <div className="category-text-wrapper">
                  <h3 className="category-name">{category.name}</h3>
                  <div className="category-description">
                    {category.description.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  <button 
                    className="category-shop-btn"
                    onClick={() => navigate('/products')}
                  >
                    Shop Now →
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="category-text-wrapper">
                  <h3 className="category-name">{category.name}</h3>
                  <div className="category-description">
                    {category.description.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  <button 
                    className="category-shop-btn"
                    onClick={() => navigate('/products')}
                  >
                    Shop Now →
                  </button>
                </div>
                <div className="category-image-wrapper">
                  <div className="category-image-container">
                    <img 
                      src={category.image} 
                      alt={category.imageAlt} 
                      className="category-image"
                    />
                    <div className="image-edge-blur image-edge-left"></div>
                    <div className="image-edge-blur image-edge-right"></div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Featured Products Section */}
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