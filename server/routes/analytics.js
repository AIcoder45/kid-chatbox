/**
 * Analytics routes
 */

const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * Get user analytics
 */
router.get('/:userId', authenticateToken, async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Verify user can only access their own analytics
    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Get total quizzes
    const totalQuizzesResult = await pool.query(
      'SELECT COUNT(*) as count FROM quiz_results WHERE user_id = $1',
      [userId]
    );
    const totalQuizzes = parseInt(totalQuizzesResult.rows[0].count, 10);

    // Get per-subject accuracy
    const subjectAccuracyResult = await pool.query(
      `SELECT 
        subject,
        AVG(score_percentage) as avg_score,
        COUNT(*) as quiz_count
      FROM quiz_results
      WHERE user_id = $1
      GROUP BY subject`,
      [userId]
    );

    const perSubjectAccuracy = {};
    subjectAccuracyResult.rows.forEach((row) => {
      perSubjectAccuracy[row.subject] = Math.round(parseFloat(row.avg_score));
    });

    // Get per-subtopic accuracy
    const subtopicAccuracyResult = await pool.query(
      `SELECT 
        subtopic,
        AVG(score_percentage) as avg_score,
        COUNT(*) as quiz_count
      FROM quiz_results
      WHERE user_id = $1
      GROUP BY subtopic`,
      [userId]
    );

    const perSubtopicAccuracy = {};
    subtopicAccuracyResult.rows.forEach((row) => {
      perSubtopicAccuracy[row.subtopic] = Math.round(parseFloat(row.avg_score));
    });

    // Get total time spent studying (sum of time_taken)
    const timeSpentResult = await pool.query(
      'SELECT SUM(time_taken) as total_time FROM quiz_results WHERE user_id = $1',
      [userId]
    );
    const timeSpentStudying = parseInt(timeSpentResult.rows[0].total_time || 0, 10);

    // Get improvement trend (last 10 quizzes)
    const trendResult = await pool.query(
      `SELECT score_percentage
       FROM quiz_results
       WHERE user_id = $1
       ORDER BY timestamp DESC
       LIMIT 10`,
      [userId]
    );
    const improvementTrend = trendResult.rows
      .reverse()
      .map((row) => Math.round(parseFloat(row.score_percentage)));

    // Get last three scores
    const lastScoresResult = await pool.query(
      `SELECT 
        score_percentage,
        subject,
        timestamp
      FROM quiz_results
      WHERE user_id = $1
      ORDER BY timestamp DESC
      LIMIT 3`,
      [userId]
    );

    const lastThreeScores = lastScoresResult.rows.map((row) => ({
      score: Math.round(parseFloat(row.score_percentage)),
      subject: row.subject,
      date: row.timestamp.toISOString(),
    }));

    // Identify strengths (subjects with >70% accuracy)
    const strengths = Object.entries(perSubjectAccuracy)
      .filter(([_, score]) => score >= 70)
      .map(([subject]) => subject);

    // Identify weaknesses (subjects with <50% accuracy)
    const weaknesses = Object.entries(perSubjectAccuracy)
      .filter(([_, score]) => score < 50)
      .map(([subject]) => subject);

    // Get recommended topics (weakest subtopics)
    const recommendedTopics = subtopicAccuracyResult.rows
      .filter((row) => parseFloat(row.avg_score) < 60)
      .sort((a, b) => parseFloat(a.avg_score) - parseFloat(b.avg_score))
      .slice(0, 5)
      .map((row) => row.subtopic);

    res.json({
      success: true,
      total_quizzes: totalQuizzes,
      per_subject_accuracy: perSubjectAccuracy,
      per_subtopic_accuracy: perSubtopicAccuracy,
      time_spent_studying: timeSpentStudying,
      improvement_trend: improvementTrend,
      last_three_scores: lastThreeScores,
      strengths,
      weaknesses,
      recommended_topics: recommendedTopics,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get recommended topics for improvement
 */
router.get('/recommendations/:userId', authenticateToken, async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Verify user can only access their own recommendations
    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Get weakest subtopics
    const result = await pool.query(
      `SELECT 
        DISTINCT qr.subject,
        qr.subtopic,
        AVG(qr.score_percentage) as avg_score,
        COUNT(*) as quiz_count
      FROM quiz_results qr
      WHERE qr.user_id = $1
      GROUP BY qr.subject, qr.subtopic
      HAVING AVG(qr.score_percentage) < 70
      ORDER BY AVG(qr.score_percentage) ASC
      LIMIT 10`,
      [userId]
    );

    const topics = result.rows.map((row) => ({
      subject: row.subject,
      subtopic: row.subtopic,
      reason: `Your average score is ${Math.round(parseFloat(row.avg_score))}%. Practice more to improve!`,
    }));

    res.json({
      success: true,
      topics,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

