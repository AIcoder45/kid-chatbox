/**
 * Study Material API routes
 * Handles study material management
 */

const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * Create study material
 * POST /api/study-material
 */
router.post('/', checkPermission('manage_study_material'), async (req, res, next) => {
  try {
    const { subtopicId, contentType, title, content, orderIndex, ageGroup } = req.body;

    if (!subtopicId || !contentType || !title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Subtopic ID, content type, title, and content are required',
      });
    }

    const validContentTypes = [
      'text',
      'animated_story',
      'illustrated_diagram',
      'step_by_step',
      'example',
      'video',
      'voice_narration',
    ];

    if (!validContentTypes.includes(contentType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid content type. Must be one of: ${validContentTypes.join(', ')}`,
      });
    }

    const result = await pool.query(
      `INSERT INTO study_material (
        subtopic_id, content_type, title, content, order_index, age_group, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        subtopicId,
        contentType,
        title,
        JSON.stringify(content),
        orderIndex || 0,
        ageGroup || null,
        req.user.id,
      ]
    );

    res.status(201).json({
      success: true,
      material: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get study materials for a subtopic
 * GET /api/study-material/subtopic/:subtopicId
 */
router.get('/subtopic/:subtopicId', async (req, res, next) => {
  try {
    const { subtopicId } = req.params;
    const { ageGroup } = req.query;

    let query = `
      SELECT * FROM study_material 
      WHERE subtopic_id = $1 AND is_published = true
    `;
    const params = [subtopicId];

    if (ageGroup) {
      query += ' AND (age_group = $2 OR age_group IS NULL)';
      params.push(ageGroup);
    }

    query += ' ORDER BY order_index, created_at';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      materials: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get study material by ID
 * GET /api/study-material/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM study_material WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Study material not found',
      });
    }

    res.json({
      success: true,
      material: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update study material
 * PUT /api/study-material/:id
 */
router.put('/:id', checkPermission('manage_study_material'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { contentType, title, content, orderIndex, ageGroup, isPublished } = req.body;

    const updates = [];
    const params = [];
    let paramCount = 0;

    if (contentType !== undefined) {
      updates.push(`content_type = $${++paramCount}`);
      params.push(contentType);
    }
    if (title !== undefined) {
      updates.push(`title = $${++paramCount}`);
      params.push(title);
    }
    if (content !== undefined) {
      updates.push(`content = $${++paramCount}`);
      params.push(JSON.stringify(content));
    }
    if (orderIndex !== undefined) {
      updates.push(`order_index = $${++paramCount}`);
      params.push(orderIndex);
    }
    if (ageGroup !== undefined) {
      updates.push(`age_group = $${++paramCount}`);
      params.push(ageGroup);
    }
    if (isPublished !== undefined) {
      updates.push(`is_published = $${++paramCount}`);
      params.push(isPublished);
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
      `UPDATE study_material SET ${updates.join(', ')} WHERE id = $${++paramCount} RETURNING *`,
      params
    );

    res.json({
      success: true,
      material: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete study material
 * DELETE /api/study-material/:id
 */
router.delete('/:id', checkPermission('manage_study_material'), async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM study_material WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Study material deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

