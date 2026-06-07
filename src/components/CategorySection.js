// CategorySection.js - Reusable category section with image and product scroll
import React, { useState, useEffect, useRef } from 'react';
import HorizontalProductScroll from './HorizontalProductScroll';
import './CategorySection.css';

const CategorySection = ({ 
  category, 
  imageUrl, 
  description, 
  products,
  imagePosition = 'left' // 'left' or 'right'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
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
  }, []);

  // Filter products by category
  const categoryProducts = products.filter(
    (product) => product.category && product.category.toLowerCase() === category.toLowerCase()
  );

  // Get category image (fallback if not provided)
  const categoryImage = imageUrl || `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 1}/500/400`;

  return (
    <div 
      className={`category-section ${imagePosition === 'right' ? 'image-right' : 'image-left'} ${isVisible ? 'visible' : ''}`}
      ref={sectionRef}
    >
      <div className="category-container">
        {/* Left Side - Image with blur effect */}
        <div className="category-image-wrapper">
          <div className="category-image-container">
            <img 
              src={categoryImage} 
              alt={category} 
              className="category-image"
              loading="lazy"
            />
            <div className="image-blur-overlay"></div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="category-content-wrapper">
          <div className="category-text">
            <h2 className="category-title">{category}</h2>
            <p className="category-description">{description}</p>
          </div>
          
          {/* Horizontal Scroll Products */}
          <HorizontalProductScroll 
            products={categoryProducts} 
            categoryName={category}
          />
        </div>
      </div>
    </div>
  );
};

export default CategorySection;