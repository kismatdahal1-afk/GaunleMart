// models/Order.js - Order Schema for MongoDB
const mongoose = require('mongoose');

// Define what each order looks like in database
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },
    address: {
      type: String,
      required: [true, 'Delivery address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    items: {
      type: [
        {
          id: { type: String, required: true },
          name: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true, min: 1 },
          imageUrl: { type: String, required: true },
          total: { type: Number, required: true }
        }
      ],
      required: true
    },
    totalItems: {
      type: Number,
      required: true,
      min: 1
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing'
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Create and export the Order model
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;