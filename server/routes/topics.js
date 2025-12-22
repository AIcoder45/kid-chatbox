/**
 * Topics API routes
 * Handles topic and subtopic management
 */

const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * Create a new topic
 * POST /api/topics
 */
router.post('/', checkPermission('manage_topics'), async (req, res, next) => {
  try {
    const {
      title,
      description,
      ageGroup,
      difficultyLevel,
      thumbnailUrl,
      category,
      learningOutcomes,
    } = req.body;

    if (!title || !ageGroup || !difficultyLevel) {
      return res.status(400).json({
        success: false,
        message: 'Title, age group, and difficulty level are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO topics (
        title, description, age_group, difficulty_level, 
        thumbnail_url, category, learning_outcomes, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        title,
        description || null,
        ageGroup,
        difficultyLevel,
        thumbnailUrl || null,
        category || null,
        learningOutcomes ? JSON.stringify(learningOutcomes) : null,
        req.user.id,
      ]
    );

    res.status(201).json({
      success: true,
      topic: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get all topics with filters
 * GET /api/topics?ageGroup=6-8&category=science
 */
router.get('/', async (req, res, next) => {
  try {
    const { ageGroup, category, difficultyLevel, isActive } = req.query;

    let query = 'SELECT * FROM topics WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (ageGroup) {
      paramCount++;
      query += ` AND age_group = $${paramCount}`;
      params.push(ageGroup);
    }

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (difficultyLevel) {
      paramCount++;
      query += ` AND difficulty_level = $${paramCount}`;
      params.push(difficultyLevel);
    }

    if (isActive !== undefined) {
      paramCount++;
      query += ` AND is_active = $${paramCount}`;
      params.push(isActive === 'true');
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      topics: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get topic by ID with subtopics
 * GET /api/topics/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const topicResult = await pool.query('SELECT * FROM topics WHERE id = $1', [id]);

    if (topicResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found',
      });
    }

    const subtopicsResult = await pool.query(
      `SELECT * FROM subtopics 
       WHERE topic_id = $1 AND is_active = true 
       ORDER BY order_index, created_at`,
      [id]
    );

    res.json({
      success: true,
      topic: topicResult.rows[0],
      subtopics: subtopicsResult.rows,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update topic
 * PUT /api/topics/:id
 */
router.put('/:id', checkPermission('manage_topics'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      ageGroup,
      difficultyLevel,
      thumbnailUrl,
      category,
      learningOutcomes,
      isActive,
    } = req.body;

    const updates = [];
    const params = [];
    let paramCount = 0;

    if (title !== undefined) {
      updates.push(`title = $${++paramCount}`);
      params.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${++paramCount}`);
      params.push(description);
    }
    if (ageGroup !== undefined) {
      updates.push(`age_group = $${++paramCount}`);
      params.push(ageGroup);
    }
    if (difficultyLevel !== undefined) {
      updates.push(`difficulty_level = $${++paramCount}`);
      params.push(difficultyLevel);
    }
    if (thumbnailUrl !== undefined) {
      updates.push(`thumbnail_url = $${++paramCount}`);
      params.push(thumbnailUrl);
    }
    if (category !== undefined) {
      updates.push(`category = $${++paramCount}`);
      params.push(category);
    }
    if (learningOutcomes !== undefined) {
      updates.push(`learning_outcomes = $${++paramCount}`);
      params.push(JSON.stringify(learningOutcomes));
    }
    if (isActive !== undefined) {
      updates.push(`is_active = $${++paramCount}`);
      params.push(isActive);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update',
      });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    const result = await pool.query(
      `UPDATE topics SET ${updates.join(', ')} WHERE id = $${++paramCount} RETURNING *`,
      params
    );

    res.json({
      success: true,
      topic: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete topic
 * DELETE /api/topics/:id
 */
router.delete('/:id', checkPermission('manage_topics'), async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM topics WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Topic deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Create subtopic
 * POST /api/topics/:topicId/subtopics
 */
router.post('/:topicId/subtopics', checkPermission('manage_subtopics'), async (req, res, next) => {
  try {
    const { topicId } = req.params;
    const {
      title,
      description,
      difficultyLevel,
      illustrationUrl,
      videoUrl,
      voiceNarrationUrl,
      aiStory,
      keyPoints,
      orderIndex,
    } = req.body;

    if (!title || !difficultyLevel) {
      return res.status(400).json({
        success: false,
        message: 'Title and difficulty level are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO subtopics (
        topic_id, title, description, difficulty_level,
        illustration_url, video_url, voice_narration_url,
        ai_story, key_points, order_index, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        topicId,
        title,
        description || null,
        difficultyLevel,
        illustrationUrl || null,
        videoUrl || null,
        voiceNarrationUrl || null,
        aiStory || null,
        keyPoints ? JSON.stringify(keyPoints) : null,
        orderIndex || 0,
        req.user.id,
      ]
    );

    res.status(201).json({
      success: true,
      subtopic: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get subtopics for a topic
 * GET /api/topics/:topicId/subtopics
 */
router.get('/:topicId/subtopics', async (req, res, next) => {
  try {
    const { topicId } = req.params;

    const result = await pool.query(
      `SELECT * FROM subtopics 
       WHERE topic_id = $1 AND is_active = true 
       ORDER BY order_index, created_at`,
      [topicId]
    );

    res.json({
      success: true,
      subtopics: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update subtopic
 * PUT /api/topics/subtopics/:id
 */
router.put('/subtopics/:id', checkPermission('manage_subtopics'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      difficultyLevel,
      illustrationUrl,
      videoUrl,
      voiceNarrationUrl,
      aiStory,
      keyPoints,
      orderIndex,
      isActive,
    } = req.body;

    const updates = [];
    const params = [];
    let paramCount = 0;

    if (title !== undefined) {
      updates.push(`title = $${++paramCount}`);
      params.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${++paramCount}`);
      params.push(description);
    }
    if (difficultyLevel !== undefined) {
      updates.push(`difficulty_level = $${++paramCount}`);
      params.push(difficultyLevel);
    }
    if (illustrationUrl !== undefined) {
      updates.push(`illustration_url = $${++paramCount}`);
      params.push(illustrationUrl);
    }
    if (videoUrl !== undefined) {
      updates.push(`video_url = $${++paramCount}`);
      params.push(videoUrl);
    }
    if (voiceNarrationUrl !== undefined) {
      updates.push(`voice_narration_url = $${++paramCount}`);
      params.push(voiceNarrationUrl);
    }
    if (aiStory !== undefined) {
      updates.push(`ai_story = $${++paramCount}`);
      params.push(aiStory);
    }
    if (keyPoints !== undefined) {
      updates.push(`key_points = $${++paramCount}`);
      params.push(JSON.stringify(keyPoints));
    }
    if (orderIndex !== undefined) {
      updates.push(`order_index = $${++paramCount}`);
      params.push(orderIndex);
    }
    if (isActive !== undefined) {
      updates.push(`is_active = $${++paramCount}`);
      params.push(isActive);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update',
      });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    const result = await pool.query(
      `UPDATE subtopics SET ${updates.join(', ')} WHERE id = $${++paramCount} RETURNING *`,
      params
    );

    res.json({
      success: true,
      subtopic: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete subtopic
 * DELETE /api/topics/subtopics/:id
 */
router.delete('/subtopics/:id', checkPermission('manage_subtopics'), async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM subtopics WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Subtopic deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;


