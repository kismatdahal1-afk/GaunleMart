// Cart.js - Displays all items in shopping cart with checkout navigation
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate(); // Added for checkout navigation
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getTotalPrice,
    clearCart 
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        {/* FIXED: Redirects to Products page instead of Home */}
        <Link to="/products" className="shop-now-btn">Shop Now</Link>
      </div>
    );
  }

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      updateQuantity(productId, newQuantity);
    }
  };

  // Handle checkout button click - navigate to checkout page
  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Shopping Cart</h1>
      
      <div className="cart-container">
        <div className="cart-items">
          <div className="cart-header">
            <div>Product</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Total</div>
            <div>Action</div>
          </div>
          
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-product">
                <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                <div className="cart-item-name">{item.name}</div>
              </div>
              <div className="cart-item-price">Rs. {item.price.toLocaleString()}</div>
              <div className="cart-item-quantity">
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="qty-control-btn"
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                  min="1"
                  max="99"
                  className="cart-qty-input"
                />
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="qty-control-btn"
                >
                  +
                </button>
              </div>
              <div className="cart-item-total">
                Rs. {(item.price * item.quantity).toLocaleString()}
              </div>
              <div className="cart-item-action">
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Total Items:</span>
            <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>
          <div className="summary-row">
            <span>Total Price:</span>
            <span className="summary-total">Rs. {getTotalPrice().toLocaleString()}</span>
          </div>
          <button onClick={clearCart} className="clear-cart-btn">
            Clear Cart
          </button>
          <button onClick={handleCheckout} className="checkout-btn">
            Proceed to Checkout
          </button>
          <Link to="/products" className="continue-shopping-link">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;