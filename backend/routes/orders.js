const router = require('express').Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');

// POST /api/orders
router.post('/', auth, async (req, res) => {
  try {
    const { items, address, payment, total } = req.body;
    const order = await Order.create({ user: req.user.id, items, address, payment, total });
    await User.findByIdAndUpdate(req.user.id, { cart: [] });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders
router.get('/', auth, async (req, res) => {
  try {
    res.json(await Order.find({ user: req.user.id }).sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/orders/:id/cancel
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'placed') return res.status(400).json({ message: 'Cannot cancel this order' });
    order.status = 'cancelled';
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
