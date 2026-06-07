// CategorySection.js - Reusable category section with image and product scroll
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CategorySection.css';

const CategorySection = ({ 
  title, 
  description, 
  image, 
  imageAlt, 
  imagePosition = 'left',
  categoryName,
  backgroundColor = '#FFF9F0'
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/products`);
        const data = await response.json();
        
        // Filter products by category
        const filteredProducts = data.filter(
          product => product.category?.toLowerCase() === categoryName.toLowerCase()
        );
        
        setProducts(filteredProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [categoryName]);

  // Scroll left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  // Scroll right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  // Handle product click
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const imageSection = (
    <div className="category-image-wrapper">
      <div className="category-image-container">
        <img src={image} alt={imageAlt} className="category-main-image" />
        <div className="image-edge-blur left"></div>
        <div className="image-edge-blur right"></div>
      </div>
    </div>
  );

  const textSection = (
    <div className="category-text-wrapper">
      <h2 className="category-title">{title}</h2>
      <div className="category-description">
        {description.map((text, idx) => (
          <p key={idx}>{text}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="category-section" style={{ backgroundColor }}>
      <div className="category-container">
        {/* Image and Text Row */}
        <div className={`category-row ${imagePosition === 'left' ? 'image-left' : 'image-right'}`}>
          {imagePosition === 'left' ? (
            <>
              {imageSection}
              {textSection}
            </>
          ) : (
            <>
              {textSection}
              {imageSection}
            </>
          )}
        </div>

        {/* Products Scroll Row */}
        <div className="products-scroll-section">
          <div className="products-scroll-header">
            <h3 className="scroll-title">Popular {title}</h3>
            <div className="scroll-buttons">
              <button onClick={scrollLeft} className="scroll-btn" aria-label="Scroll left">
                ←
              </button>
              <button onClick={scrollRight} className="scroll-btn" aria-label="Scroll right">
                →
              </button>
            </div>
          </div>

          {loading ? (
            <div className="products-scroll-loading">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="products-scroll-empty">
              <p>No products available in this category yet.</p>
            </div>
          ) : (
            <div className="products-scroll-container" ref={scrollContainerRef}>
              {products.map((product) => (
                <div 
                  key={product._id} 
                  className="scroll-product-card"
                  onClick={() => handleProductClick(product._id)}
                >
                  <div className="scroll-product-image">
                    <img src={product.imageUrl} alt={product.name} />
                  </div>
                  <div className="scroll-product-info">
                    <h4 className="scroll-product-name">{product.name}</h4>
                    <p className="scroll-product-price">Rs. {product.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;