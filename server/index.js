// index.js - Main server with MongoDB + Cloudinary + Orders
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/mongodb');

// Import routes
const productRoutes = require('./routes/products');
const uploadRoutes = require('./routes/upload');
const orderRoutes = require('./routes/orderRoutes');  // ← ADD THIS

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);  // ← ADD THIS

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'GaunleMart API is running!' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
  console.log(`📸 Upload API: http://localhost:${PORT}/api/upload`);
  console.log(`📋 Orders API: http://localhost:${PORT}/api/orders`);  // ← ADD THIS
});