// CategorySection.js - Reusable category block with half-screen image and product scroll
import React, { useState, useEffect, useRef } from 'react';
import HorizontalProductScroll from './HorizontalProductScroll';
import './CategorySection.css';

const CategorySection = ({ 
  category, 
  imageUrl, 
  description, 
  products,
  imagePosition = 'left'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  // Fallback images for categories
  const categoryImages = {
    'Vegetables': 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800',
    'Groceries': 'https://images.unsplash.com/photo-1542838132-92c53300491d?w=800',
    'Snacks': 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800',
    'Spices & Masala': 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800',
    'Beverage': 'https://images.unsplash.com/photo-1543364195-bfe6e4932397?w=800'
  };

  const finalImageUrl = imageUrl || categoryImages[category] || 'https://picsum.photos/id/1/800/500';

  return (
    <div 
      className={`category-section ${imagePosition === 'right' ? 'image-right' : 'image-left'} ${isVisible ? 'visible' : ''}`}
      ref={sectionRef}
    >
      <div className="category-container">
        {/* Row 1: Half-screen Image + Text */}
        <div className="category-row">
          {/* Image Column - 50% width */}
          <div className="category-image-col">
            <div className="category-image-wrapper">
              <img 
                src={finalImageUrl} 
                alt={category} 
                className="category-main-image"
                loading="lazy"
              />
              {/* Gradient overlay for smooth edge blending */}
              <div className="image-gradient-overlay"></div>
            </div>
          </div>

          {/* Text Column - 50% width */}
          <div className="category-text-col">
            <div className="category-text-content">
              <h2 className="category-title">{category}</h2>
              <p className="category-description">{description}</p>
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
            <p className="scroll-hint">← Scroll to see more →</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySection;