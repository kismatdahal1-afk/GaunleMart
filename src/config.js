// Centralized configuration for the application
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Default admin credentials (should be moved to backend in production)
export const ADMIN_CONFIG = {
  // Note: In production, authentication should be handled by backend with proper JWT tokens
  // This is a temporary client-side solution for demo purposes only
  useClientAuth: false, // Set to false to disable client-side auth
};

// Category names (consistent across the app)
export const CATEGORIES = {
  GROCERIES: 'Groceries',
  ELECTRONICS: 'Electronics',
  CLOTHING: 'Clothing',
  HOME: 'Home',
  BEAUTY: 'Beauty',
  GENERAL: 'General'
};

// Validation patterns
export const VALIDATION = {
  PHONE_REGEX: /^[0-9]{10}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export default {
  API_URL,
  ADMIN_CONFIG,
  CATEGORIES,
  VALIDATION
};
