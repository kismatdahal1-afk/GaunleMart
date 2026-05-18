// ProductCard.js - Fixed to use MongoDB _id
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current category from URL (if any)
  const params = new URLSearchParams(location.search);
  const currentCategory = params.get('category') || 'All';
  
  const handleCardClick = () => {
    if (product && product._id) {
      // Use MongoDB _id instead of id
      const detailUrl = `/product/${product._id}?category=${encodeURIComponent(currentCategory)}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate(detailUrl);
    } else if (product && product.id) {
      // Fallback for backward compatibility
      const detailUrl = `/product/${product.id}?category=${encodeURIComponent(currentCategory)}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate(detailUrl);
    }
  };
  
  if (!product) {
    return null;
  }
  
  const imageUrl = product.imageUrl || 'https://picsum.photos/id/1/300/200';
  
  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image">
        <img src={imageUrl} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">Rs. {product.price.toLocaleString()}</p>
        <div className="product-rating">
          {'★'.repeat(Math.floor(product.rating || 4))}
          {'☆'.repeat(5 - Math.floor(product.rating || 4))}
          <span className="rating-value">({product.rating || 4})</span>
        </div>
        <button className="view-details-btn">View Details</button>
      </div>
    </div>
  );
};

export default ProductCard;