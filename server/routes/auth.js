/**
 * Authentication routes
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Register a new user
 */
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, age, grade, preferredLanguage } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required',
      });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, age, grade, preferred_language)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, name, age, grade, preferred_language, created_at`,
      [email, passwordHash, name, age || null, grade || null, preferredLanguage || null]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        age: user.age,
        grade: user.grade,
        preferredLanguage: user.preferred_language,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Login with email and password
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        age: user.age,
        grade: user.grade,
        preferredLanguage: user.preferred_language,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Google OAuth callback - Verify Google token and create/login user
 */
router.post('/google', async (req, res, next) => {
  try {
    const { token: googleToken, email, name, picture } = req.body;

    if (!googleToken || !email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Google token, email, and name are required',
      });
    }

    // Verify Google token (in production, verify with Google API)
    // For now, we'll trust the token from frontend
    // In production, use: https://www.npmjs.com/package/google-auth-library

    // Find or create user
    let result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    let user;

    if (result.rows.length === 0) {
      // Create new user
      result = await pool.query(
        `INSERT INTO users (email, name, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, email, name, age, grade, preferred_language, created_at`,
        [email, name, null] // No password for social login
      );
      user = result.rows[0];
    } else {
      user = result.rows[0];
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        age: user.age,
        grade: user.grade,
        preferredLanguage: user.preferred_language,
        createdAt: user.created_at,
      },
      token: jwtToken,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Social login (Google/Apple) - Legacy endpoint
 */
router.post('/social', async (req, res, next) => {
  try {
    const { provider, token, email, name } = req.body;

    if (!provider || !email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Provider, email, and name are required',
      });
    }

    // For Google, use the /google endpoint
    if (provider === 'google') {
      return router.handle({ ...req, url: '/google', method: 'POST' }, res, next);
    }

    // Find or create user
    let result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    let user;

    if (result.rows.length === 0) {
      // Create new user
      result = await pool.query(
        `INSERT INTO users (email, name, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, email, name, age, grade, preferred_language, created_at`,
        [email, name, null]
      );
      user = result.rows[0];
    } else {
      user = result.rows[0];
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        age: user.age,
        grade: user.grade,
        preferredLanguage: user.preferred_language,
        createdAt: user.created_at,
      },
      token: jwtToken,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
