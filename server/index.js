/**
 * Express server for KidChatbox API
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const studyRoutes = require('./routes/study');
const analyticsRoutes = require('./routes/analytics');
const profileRoutes = require('./routes/profile');
const { initializeDatabase } = require('./config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'KidChatbox API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/profile', profileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;

