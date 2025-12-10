/**
 * User profile routes
 */

const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * Get user profile
 */
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, email, name, age, grade, preferred_language, created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = result.rows[0];

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
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update user profile
 */
router.put('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, age, grade, preferredLanguage } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    // Validate age if provided
    if (age !== undefined && age !== null) {
      const ageNum = parseInt(age, 10);
      if (isNaN(ageNum) || ageNum < 6 || ageNum > 14) {
        return res.status(400).json({
          success: false,
          message: 'Age must be between 6 and 14',
        });
      }
    }

    // Update user profile
    const result = await pool.query(
      `UPDATE users
       SET name = $1,
           age = $2,
           grade = $3,
           preferred_language = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, email, name, age, grade, preferred_language, created_at`,
      [name, age || null, grade || null, preferredLanguage || null, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = result.rows[0];

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
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

