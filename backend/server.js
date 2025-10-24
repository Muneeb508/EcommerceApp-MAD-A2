const express = require('express');
const cors = require('cors');
const connectDatabase = require('./config/database');

// Configuration (no .env file needed)
process.env.PORT = process.env.PORT || '3000';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'ecommerce_jwt_secret_key_2024';

// Initialize express app
const app = express();

// Connect to database
connectDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/profile', require('./routes/profile'));

// Health check route
app.get('/', (req, res) => {
  res.json({ message: '🛍️ E-Commerce API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

