require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const app = express();

// Security middlewares
app.use(helmet());
if (!process.env.FRONTEND_URL) {
  throw new Error('FRONTEND_URL environment variable is required!');
}
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/auth', authLimiter);

app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const formRoutes = require('./routes/form');
app.use('/api/forms', formRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Feedback Collection Platform API is running');
});

// MongoDB connection
const PORT = process.env.PORT || 4000;
if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI environment variable is required!');
}
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
