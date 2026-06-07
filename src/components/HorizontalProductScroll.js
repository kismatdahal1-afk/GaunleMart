// HorizontalProductScroll.js - Horizontal scrollable product row for category sections
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './HorizontalProductScroll.css';

const HorizontalProductScroll = ({ products, categoryName }) => {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  // Handle product click
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll left handler
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  // Scroll right handler
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="horizontal-scroll-empty">
        <p>No products available in {categoryName}</p>
      </div>
    );
  }

  return (
    <div className="horizontal-scroll-wrapper">
      <div className="scroll-container" ref={scrollContainerRef}>
        {products.map((product) => (
          <div 
            key={product._id} 
            className="scroll-product-card"
            onClick={() => handleProductClick(product._id)}
          >
            <div className="scroll-product-image">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                loading="lazy"
              />
            </div>
            <div className="scroll-product-info">
              <h4 className="scroll-product-name">{product.name}</h4>
              <p className="scroll-product-price">Rs. {product.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      
      {products.length > 4 && (
        <>
          <button className="scroll-btn scroll-left" onClick={scrollLeft} aria-label="Scroll left">
            ‹
          </button>
          <button className="scroll-btn scroll-right" onClick={scrollRight} aria-label="Scroll right">
            ›
          </button>
        </>
      )}
    </div>
  );
};

export default HorizontalProductScroll;