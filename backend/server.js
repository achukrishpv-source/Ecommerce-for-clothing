const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/wishlist', require('./routes/wishlist'));

// Health check — shows all collections and counts
app.get('/', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const stats = {};
    for (const col of collections) {
      stats[col.name] = await db.collection(col.name).countDocuments();
    }
    res.json({
      message: 'ASKR Clothing API running',
      database: mongoose.connection.name,
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      collections: stats
    });
  } catch (err) {
    res.json({ message: 'ASKR Clothing API running', error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
