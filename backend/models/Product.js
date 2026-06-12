const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  price:         { type: Number, required: true },
  originalPrice: { type: Number },
  discount:      { type: Number, default: 0 },
  category:      { type: String, enum: ['men', 'women', 'kids', 'accessories'], required: true },
  subcategory:   { type: String },
  description:   { type: String },
  image:         { type: String },
  sizes:         [String],
  colors:        [String],
  stock:         { type: Number, default: 100 },
  rating:        { type: Number, default: 0 },
  reviews:       { type: Number, default: 0 },
  badge:         { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
