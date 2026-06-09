const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  phone:    { type: String },
  password: { type: String, required: true },
  cart:     [{ productId: String, name: String, price: Number, image: String, size: String, color: String, qty: Number }],
  wishlist: [{ productId: String, name: String, price: Number, image: String, category: String }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
