/**
 * Public routes - No authentication required
 */

const express = require('express');
const { pool } = require('../config/database');
const { trackEvent, EVENT_TYPES } = require('../utils/eventTracker');

const router = express.Router();

/**
 * Track home page view
 * POST /api/public/home-view
 */
router.post('/home-view', async (req, res, next) => {
  try {
    // Get IP address (handles proxies)
    const ipAddress =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.headers['x-real-ip'] ||
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      null;
    const userAgent = req.headers['user-agent'] || null;

    // Track the home screen view event
    await trackEvent({
      userId: null, // Public view, no user ID
      eventType: EVENT_TYPES.HOME_SCREEN_VIEWED,
      resourceType: 'home_page',
      resourceId: null, // No specific resource ID for home page view
      metadata: {
        timestamp: new Date().toISOString(),
        referrer: req.headers.referer || null,
        page: 'home',
      },
      ipAddress,
      userAgent,
    });

    res.json({
      success: true,
      message: 'Home page view tracked',
    });
  } catch (error) {
    // Don't fail the request if tracking fails
    console.error('Failed to track home view:', error);
    res.json({
      success: true,
      message: 'Home page view tracked',
    });
  }
});

/**
 * Get total home page views count
 * GET /api/public/home-views
 */
router.get('/home-views', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as total_views
       FROM activity_logs
       WHERE event_type = $1`,
      [EVENT_TYPES.HOME_SCREEN_VIEWED]
    );

    const totalViews = parseInt(result.rows[0].total_views, 10) || 0;

    res.json({
      success: true,
      totalViews,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

