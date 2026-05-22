// routes/orderRoutes.js - Order management API routes with better error handling
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET /api/orders - Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/orders/:id - Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  try {
    console.log('📦 Received order data:', JSON.stringify(req.body, null, 2));
    
    const {
      orderId,
      customerName,
      phone,
      email,
      address,
      city,
      items,
      totalItems,
      subtotal,
      deliveryFee,
      grandTotal,
      notes
    } = req.body;

    // Validate required fields
    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }
    if (!customerName) {
      return res.status(400).json({ message: 'customerName is required' });
    }
    if (!phone) {
      return res.status(400).json({ message: 'phone is required' });
    }
    if (!email) {
      return res.status(400).json({ message: 'email is required' });
    }
    if (!address) {
      return res.status(400).json({ message: 'address is required' });
    }
    if (!city) {
      return res.status(400).json({ message: 'city is required' });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least one item' });
    }

    // Create new order
    const newOrder = new Order({
      orderId,
      customerName,
      phone,
      email,
      address,
      city,
      items: items,
      totalItems: totalItems || items.length,
      subtotal: subtotal || 0,
      deliveryFee: deliveryFee || 0,
      grandTotal: grandTotal || 0,
      notes: notes || '',
      status: 'Processing'
    });

    const savedOrder = await newOrder.save();
    console.log(`✅ Order created successfully: ${savedOrder.orderId}`);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/orders/:id - Update order status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log(`✏️ Order ${updatedOrder.orderId} status updated to: ${status}`);
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/orders/:id - Delete order
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    console.log(`❌ Order deleted: ${deletedOrder.orderId}`);
    res.json({ message: 'Order deleted successfully', order: deletedOrder });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;