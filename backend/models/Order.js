const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:   [{ productId: String, name: String, price: Number, image: String, size: String, color: String, qty: Number }],
  address: { name: String, phone: String, street: String, city: String, state: String, pincode: String },
  payment: { method: String, status: { type: String, default: 'pending' } },
  total:   { type: Number, required: true },
  status:  { type: String, enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'placed' },
  trackingId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
