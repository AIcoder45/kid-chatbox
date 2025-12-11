/**
 * Quiz routes
 */

const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { checkModuleAccess } = require('../middleware/rbac');
const { incrementQuizCount } = require('../utils/plans');

const router = express.Router();

/**
 * Save quiz result
 */
router.post('/results', authenticateToken, checkModuleAccess('quiz'), async (req, res, next) => {
  try {
    const {
      subject,
      subtopic,
      age,
      language,
      answers,
      correct_count,
      wrong_count,
      explanation_of_mistakes,
      time_taken,
      score_percentage,
    } = req.body;

    const userId = req.user.id;

    // Validate input
    if (
      !subject ||
      !subtopic ||
      !age ||
      !language ||
      !answers ||
      !Array.isArray(answers) ||
      correct_count === undefined ||
      wrong_count === undefined ||
      time_taken === undefined ||
      score_percentage === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Start transaction
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Insert quiz result
      const resultQuery = `
        INSERT INTO quiz_results (
          user_id, subject, subtopic, age, language,
          correct_count, wrong_count, explanation_of_mistakes,
          time_taken, score_percentage
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `;

      const result = await client.query(resultQuery, [
        userId,
        subject,
        subtopic,
        age,
        language,
        correct_count,
        wrong_count,
        explanation_of_mistakes || '',
        time_taken,
        score_percentage,
      ]);

      const quizResultId = result.rows[0].id;

      // Insert quiz answers
      const answerQuery = `
        INSERT INTO quiz_answers (
          quiz_result_id, question_number, question,
          child_answer, correct_answer, explanation, is_correct, options
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;

      for (const answer of answers) {
        await client.query(answerQuery, [
          quizResultId,
          answer.questionNumber,
          answer.question,
          answer.childAnswer || null,
          answer.correctAnswer,
          answer.explanation,
          answer.isCorrect,
          answer.options ? JSON.stringify(answer.options) : null,
        ]);
      }

      // Increment quiz count for plan limits (only for AI-generated quizzes)
      // Scheduled tests are handled separately
      try {
        await incrementQuizCount(userId);
      } catch (incrementError) {
        // Log error but don't fail the request
        console.error('Error incrementing quiz count:', incrementError);
      }

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        id: quizResultId,
        message: 'Quiz result saved successfully',
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
});

/**
 * Get user's quiz history
 */
router.get('/history/:userId', authenticateToken, checkModuleAccess('quiz'), async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Verify user can only access their own history
    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const result = await pool.query(
      `SELECT 
        qr.id,
        qr.timestamp,
        qr.subject,
        qr.subtopic,
        qr.age,
        qr.language,
        qr.correct_count,
        qr.wrong_count,
        qr.time_taken,
        qr.score_percentage,
        qr.explanation_of_mistakes,
        json_agg(
          json_build_object(
            'questionNumber', qa.question_number,
            'question', qa.question,
            'childAnswer', qa.child_answer,
            'correctAnswer', qa.correct_answer,
            'explanation', qa.explanation,
            'isCorrect', qa.is_correct,
            'options', qa.options
          )
        ) as answers
      FROM quiz_results qr
      LEFT JOIN quiz_answers qa ON qr.id = qa.quiz_result_id
      WHERE qr.user_id = $1
      GROUP BY qr.id
      ORDER BY qr.timestamp DESC
      LIMIT 50`,
      [userId]
    );

    res.json({
      success: true,
      results: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

