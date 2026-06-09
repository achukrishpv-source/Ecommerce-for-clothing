const router = require('express').Router();
const Product = require('../models/Product');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };
    res.json(await Product.find(filter));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products (admin use)
router.post('/', async (req, res) => {
  try {
    res.status(201).json(await Product.create(req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
