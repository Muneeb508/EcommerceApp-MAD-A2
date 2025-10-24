const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order from cart
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { shipping_address, payment_method } = req.body;

    // Get cart items
    const cartItems = await Cart.find({ user_id: req.user._id })
      .populate('product_id');

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Prepare order items and calculate total
    const orderItems = cartItems.map(item => ({
      product_id: item.product_id._id,
      name: item.product_id.name,
      image_url: item.product_id.image_url,
      quantity: item.quantity,
      price: item.product_id.price
    }));

    const total_amount = orderItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    // Create order
    const order = await Order.create({
      user_id: req.user._id,
      items: orderItems,
      total_amount,
      shipping_address,
      payment_method,
      status: 'Pending'
    });

    // Clear cart after order
    await Cart.deleteMany({ user_id: req.user._id });

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product_id,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user._id })
      .sort({ order_date: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

