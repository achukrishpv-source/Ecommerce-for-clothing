const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET /api/wishlist
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('wishlist');
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/wishlist (toggle)
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { productId, name, price, image, category } = req.body;
    const idx = user.wishlist.findIndex(i => i.productId === productId);
    if (idx > -1) user.wishlist.splice(idx, 1);
    else user.wishlist.push({ productId, name, price, image, category });
    await user.save();
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/wishlist/:productId
router.delete('/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(i => i.productId !== req.params.productId);
    await user.save();
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
