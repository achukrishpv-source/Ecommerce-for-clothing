const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET /api/cart
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('cart');
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/cart
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { productId, name, price, image, size, color } = req.body;
    const existing = user.cart.find(i => i.productId === productId && i.size === size);
    if (existing) existing.qty += 1;
    else user.cart.push({ productId, name, price, image, size, color, qty: 1 });
    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/cart/:productId
router.delete('/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(i => i.productId !== req.params.productId);
    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/cart (clear cart)
router.delete('/', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { cart: [] });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
