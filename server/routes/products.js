// routes/products.js - Complete Product API routes with PUT for image updates
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/products - Add new product
router.post('/', async (req, res) => {
  try {
    const { name, price, description, category, imageUrl, inStock, rating } = req.body;
    
    if (!name || !price || !description) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, price, and description are required' 
      });
    }
    
    const newProduct = new Product({
      name,
      price: parseFloat(price),
      description,
      category: category || 'General',
      imageUrl: imageUrl || 'https://res.cloudinary.com/placeholder.jpg',
      inStock: inStock !== undefined ? inStock : true,
      rating: rating || 4.0
    });
    
    const savedProduct = await newProduct.save();
    console.log(`✅ Product added: ${savedProduct.name} (ID: ${savedProduct._id})`);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/products/:id - Update product (for image replace and other edits)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    console.log(`🔄 Updating product ${id} with:`, Object.keys(updates));
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log(`✏️ Product updated: ${updatedProduct.name} (ID: ${updatedProduct._id})`);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log(`❌ Product deleted: ${deletedProduct.name} (ID: ${deletedProduct._id})`);
    res.json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;