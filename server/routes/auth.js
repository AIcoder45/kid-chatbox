/**
 * Authentication routes
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { getFreemiumPlan, assignPlanToUser } = require('../utils/plans');
const { trackEvent, EVENT_TYPES } = require('../utils/eventTracker');

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

    // Create user with default status 'pending'
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, age, grade, preferred_language, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING id, email, name, age, grade, preferred_language, status, created_at`,
      [email, passwordHash, name, age || null, grade || null, preferredLanguage || null]
    );

    const user = result.rows[0];

    // Assign default 'student' role
    const studentRoleResult = await pool.query(
      "SELECT id FROM roles WHERE name = 'student'"
    );

    if (studentRoleResult.rows.length > 0) {
      await pool.query(
        'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
        [user.id, studentRoleResult.rows[0].id]
      );
    }

    // Assign Freemium plan to new user
    try {
      const freemiumPlan = await getFreemiumPlan();
      await assignPlanToUser(user.id, freemiumPlan.id);
    } catch (error) {
      console.error(`Error assigning Freemium plan to user ${user.id} (${user.email}):`, error.message || error);
      // Don't fail registration if plan assignment fails
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Track registration event
    await trackEvent({
      userId: user.id,
      eventType: EVENT_TYPES.USER_REGISTER,
      metadata: {
        email: user.email,
        age: user.age,
        grade: user.grade,
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        age: user.age,
        grade: user.grade,
        preferredLanguage: user.preferred_language,
        status: user.status,
        createdAt: user.created_at,
      },
      token,
      message: 'Registration successful. Your account is pending approval.',
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

    // Check if user is approved
    if (user.status === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval. Please wait for admin approval.',
      });
    }

    if (user.status === 'rejected' || user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked. Please contact administrator.',
      });
    }

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Track login event
    await trackEvent({
      userId: user.id,
      eventType: EVENT_TYPES.USER_LOGIN,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

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
      // Create new user with pending status
      result = await pool.query(
        `INSERT INTO users (email, name, password_hash, status, avatar_url)
         VALUES ($1, $2, $3, 'pending', $4)
         RETURNING id, email, name, age, grade, preferred_language, status, created_at`,
        [email, name, null, picture || null] // No password for social login
      );
      user = result.rows[0];

      // Assign default 'student' role
      const studentRoleResult = await pool.query(
        "SELECT id FROM roles WHERE name = 'student'"
      );

      if (studentRoleResult.rows.length > 0) {
        await pool.query(
          'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
          [user.id, studentRoleResult.rows[0].id]
        );
      }

      // Assign Freemium plan to new OAuth user
      try {
        const freemiumPlan = await getFreemiumPlan();
        await assignPlanToUser(user.id, freemiumPlan.id);
      } catch (error) {
        console.error(`Error assigning Freemium plan to OAuth user ${user.id} (${user.email}):`, error.message || error);
        // Don't fail registration if plan assignment fails
      }
    } else {
      user = result.rows[0];
      
      // Update last login
      await pool.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );
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
        `INSERT INTO users (email, name, password_hash, status)
         VALUES ($1, $2, $3, 'pending')
         RETURNING id, email, name, age, grade, preferred_language, status, created_at`,
        [email, name, null]
      );
      user = result.rows[0];

      // Assign default 'student' role
      const studentRoleResult = await pool.query(
        "SELECT id FROM roles WHERE name = 'student'"
      );

      if (studentRoleResult.rows.length > 0) {
        await pool.query(
          'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
          [user.id, studentRoleResult.rows[0].id]
        );
      }

      // Assign Freemium plan to new user
      try {
        const freemiumPlan = await getFreemiumPlan();
        await assignPlanToUser(user.id, freemiumPlan.id);
      } catch (error) {
        console.error(`Error assigning Freemium plan to social login user ${user.id} (${user.email}):`, error.message || error);
        // Don't fail registration if plan assignment fails
      }
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
 * Get current user info
 * GET /api/auth/me
 */
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    // Get user with roles and permissions
    const userResult = await pool.query(
      `SELECT 
        u.id, 
        u.email, 
        u.name, 
        u.age, 
        u.age_group,
        u.grade, 
        u.preferred_language,
        u.status,
        u.avatar_url,
        u.parent_contact,
        u.created_at,
        u.approved_at,
        u.last_login
      FROM users u 
      WHERE u.id = $1`,
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = userResult.rows[0];

    // Get user roles
    const rolesResult = await pool.query(
      `SELECT r.name, r.id
       FROM roles r
       INNER JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = $1`,
      [user.id]
    );

    // Get user permissions
    const permissionsResult = await pool.query(
      `SELECT DISTINCT p.name 
       FROM permissions p
       INNER JOIN role_permissions rp ON p.id = rp.permission_id
       INNER JOIN user_roles ur ON rp.role_id = ur.role_id
       WHERE ur.user_id = $1`,
      [user.id]
    );

    // Get module access
    const moduleAccessResult = await pool.query(
      `SELECT module_name, has_access 
       FROM user_module_access 
       WHERE user_id = $1`,
      [user.id]
    );

    res.json({
      success: true,
      user: {
        ...user,
        roles: rolesResult.rows.map((r) => r.name),
        roleIds: rolesResult.rows.map((r) => r.id),
        permissions: permissionsResult.rows.map((p) => p.name),
        moduleAccess: moduleAccessResult.rows.reduce((acc, row) => {
          acc[row.module_name] = row.has_access;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
