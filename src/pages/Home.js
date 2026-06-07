// Home.js - Complete with Category-Based Featured Products UI
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategorySection from '../components/CategorySection';
import './Home.css';

// Import local images
import img1 from '../images/img1.jpg';
import img2 from '../images/img2.jpg';
import img3 from '../images/img3.jpg';
import img4 from '../images/img4.jpg';
import img5 from '../images/img5.jpg';

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleShopNow = () => {
    navigate('/products');
  };

  // Categories with EXACT text descriptions
  const categories = [
    {
      title: "Vegetables",
      description: [
        "Fresh and locally sourced vegetables for your daily needs",
        "Naturally grown with care and full of nutrition",
        "Handpicked to ensure quality and freshness every day",
        "Perfect for healthy and delicious home-cooked meals"
      ],
      image: img1,
      imageAlt: "Fresh Vegetables",
      imagePosition: "left",
      categoryName: "Vegetables",
      bgColor: "#FFF9F0"
    },
    {
      title: "Grocery",
      description: [
        "All essential daily items in one convenient place",
        "High-quality products you can trust every day",
        "From grains to oils, everything for your kitchen",
        "Making your daily shopping simple and reliable"
      ],
      image: img2,
      imageAlt: "Grocery Items",
      imagePosition: "right",
      categoryName: "Groceries",
      bgColor: "#FFF9F0"
    },
    {
      title: "Snacks",
      description: [
        "Tasty and crunchy snacks for every mood",
        "Perfect for tea time, travel, or quick bites",
        "A variety of flavors loved by everyone",
        "Enjoy freshness and taste in every bite"
      ],
      image: img3,
      imageAlt: "Snacks",
      imagePosition: "left",
      categoryName: "Snacks",
      bgColor: "#FFF9F0"
    },
    {
      title: "Spices & Masala",
      description: [
        "Authentic spices to enhance your cooking",
        "Rich aroma and traditional flavors",
        "Carefully selected for best quality",
        "Bring real taste to your kitchen"
      ],
      image: img4,
      imageAlt: "Spices and Masala",
      imagePosition: "right",
      categoryName: "Spices",
      bgColor: "#FFF9F0"
    },
    {
      title: "Beverages",
      description: [
        "Refreshing drinks for every moment",
        "From juices to soft drinks and more",
        "Perfect to stay cool and energized",
        "Enjoy your favorite beverages anytime"
      ],
      image: img5,
      imageAlt: "Beverages",
      imagePosition: "left",
      categoryName: "Beverages",
      bgColor: "#FFF9F0"
    }
  ];

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
      <div className="featured-categories-section">
        <div className="section-header">
          <h2 className="section-title">FEATURED PRODUCTS</h2>
          <p className="section-subtitle">Discover our finest in-stock products from Gaunle Mart</p>
        </div>
        
        {categories.map((category, index) => (
          <CategorySection
            key={index}
            title={category.title}
            description={category.description}
            image={category.image}
            imageAlt={category.imageAlt}
            imagePosition={category.imagePosition}
            categoryName={category.categoryName}
            backgroundColor={category.bgColor}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;