// CategorySection.js - Reusable category block with fixed 16:9 images and blur edges
import React, { useState, useEffect, useRef } from 'react';
import HorizontalProductScroll from './HorizontalProductScroll';
import './CategorySection.css';

// Import local images from assets
import img1 from '../assets/images/img1.jpg';
import img2 from '../assets/images/img2.jpg';
import img3 from '../assets/images/img3.jpg';
import img4 from '../assets/images/img4.jpg';
import img5 from '../assets/images/img5.jpg';

const CategorySection = ({ 
  category, 
  imagePosition = 'left',
  products 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Category-specific images (local)
  const categoryImages = {
    'Vegetables': img1,
    'Groceries': img2,
    'Snacks': img3,
    'Spices & Masala': img4,
    'Beverage': img5
  };

  // Category-specific descriptions
  const categoryDescriptions = {
    'Vegetables': {
      line1: 'Fresh and locally sourced vegetables for your daily needs',
      line2: 'Naturally grown with care and full of nutrition',
      line3: 'Handpicked to ensure quality and freshness every day',
      line4: 'Perfect for healthy and delicious home-cooked meals'
    },
    'Groceries': {
      line1: 'All essential daily items in one convenient place',
      line2: 'High-quality products you can trust every day',
      line3: 'From grains to oils, everything for your kitchen',
      line4: 'Making your daily shopping simple and reliable'
    },
    'Snacks': {
      line1: 'Tasty and crunchy snacks for every mood',
      line2: 'Perfect for tea time, travel, or quick bites',
      line3: 'A variety of flavors loved by everyone',
      line4: 'Enjoy freshness and taste in every bite'
    },
    'Spices & Masala': {
      line1: 'Authentic spices to enhance your cooking',
      line2: 'Rich aroma and traditional flavors',
      line3: 'Carefully selected for best quality',
      line4: 'Bring real taste to your kitchen'
    },
    'Beverage': {
      line1: 'Refreshing drinks for every moment',
      line2: 'From juices to soft drinks and more',
      line3: 'Perfect to stay cool and energized',
      line4: 'Enjoy your favorite beverages anytime'
    }
  };

  const currentImage = categoryImages[category];
  const currentDescription = categoryDescriptions[category];

  // Intersection Observer for one-time scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Filter products by category (case-insensitive)
  const categoryProducts = products.filter(
    (product) => product.category && product.category.toLowerCase() === category.toLowerCase()
  );

  return (
    <div 
      className={`category-section ${imagePosition === 'right' ? 'image-right' : 'image-left'} ${isVisible ? 'visible' : ''}`}
      ref={sectionRef}
    >
      <div className="category-container">
        {/* Row 1: Half-screen Image + Text */}
        <div className="category-row">
          {/* Image Column - 50% width with fixed 16:9 aspect ratio */}
          <div className="category-image-col">
            <div className="category-image-wrapper">
              <img 
                src={currentImage} 
                alt={category} 
                className="category-main-image"
                loading="lazy"
              />
              {/* Soft blur gradient overlay for edge blending */}
              <div className="image-blur-gradient"></div>
            </div>
          </div>

          {/* Text Column - 50% width */}
          <div className="category-text-col">
            <div className="category-text-content">
              <h2 className="category-title">{category}</h2>
              <div className="category-description-list">
                <p className="category-desc-item">✓ {currentDescription?.line1}</p>
                <p className="category-desc-item">✓ {currentDescription?.line2}</p>
                <p className="category-desc-item">✓ {currentDescription?.line3}</p>
                <p className="category-desc-item">✓ {currentDescription?.line4}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Scrollable Product Cards */}
        <div className="category-products-row">
          <HorizontalProductScroll 
            products={categoryProducts} 
            categoryName={category}
          />
          {/* Underline scroll indicator */}
          <div className="scroll-indicator">
            <div className="scroll-line"></div>
            <p className="scroll-hint">← Scroll to see more products →</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySection;