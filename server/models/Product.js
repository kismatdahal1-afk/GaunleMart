// models/Product.js - Product Schema for MongoDB
const mongoose = require('mongoose');

// Define what each product looks like in database
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
      type: String,
      default: 'General',
      trim: true
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required']
    },
    rating: {
      type: Number,
      default: 4.0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5']
    },
    inStock: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Create and export the Product model
const Product = mongoose.model('Product', productSchema);
module.exports = Product;