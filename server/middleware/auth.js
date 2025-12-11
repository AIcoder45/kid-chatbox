/**
 * Authentication middleware
 */

const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Verify JWT token and attach user to request
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from database with roles and permissions
    const result = await pool.query(
      `SELECT 
        u.id, 
        u.email, 
        u.name, 
        u.age, 
        u.grade, 
        u.preferred_language,
        u.status,
        u.avatar_url,
        u.age_group,
        u.last_login
      FROM users u 
      WHERE u.id = $1`,
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = result.rows[0];

    // Get user roles
    const rolesResult = await pool.query(
      `SELECT r.name 
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

    req.user = {
      ...user,
      roles: rolesResult.rows.map((r) => r.name),
      permissions: permissionsResult.rows.map((p) => p.name),
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    next(error);
  }
};

module.exports = { authenticateToken };

