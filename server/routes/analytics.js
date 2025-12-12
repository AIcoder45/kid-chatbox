/**
 * Analytics routes
 */

const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * Get available quizzes for filtering (unique subject+subtopic combinations)
 * GET /api/analytics/quiz-rankings/quizzes
 */
router.get('/quiz-rankings/quizzes', authenticateToken, async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT
        subject,
        subtopic,
        COUNT(*) as attempt_count,
        COUNT(DISTINCT user_id) as participant_count,
        AVG(score_percentage) as avg_score,
        MAX(timestamp) as last_attempt
      FROM quiz_results
      GROUP BY subject, subtopic
      HAVING COUNT(*) > 0
      ORDER BY last_attempt DESC, attempt_count DESC
    `);

    const quizzes = result.rows.map((row) => ({
      id: `${row.subject}_${row.subtopic}`,
      subject: row.subject,
      subtopic: row.subtopic,
      displayName: `${row.subject} - ${row.subtopic}`,
      attemptCount: parseInt(row.attempt_count),
      participantCount: parseInt(row.participant_count),
      avgScore: Math.round(parseFloat(row.avg_score) || 0),
      lastAttempt: row.last_attempt,
    }));

    res.json({
      success: true,
      quizzes,
    });
  } catch (error) {
    console.error('Error fetching quiz list:', error);
    next(error);
  }
});

/**
 * Get quiz rankings (student accessible)
 * GET /api/analytics/quiz-rankings?quizId=&subject=&subtopic=&sortBy=score|time|questions|composite
 * NOTE: This must come BEFORE /:userId route to avoid route conflict
 */
router.get('/quiz-rankings', authenticateToken, async (req, res, next) => {
  try {
    const { quizId, subject, subtopic, sortBy = 'composite', limit = 100 } = req.query;

    let query = `
      SELECT 
        qr.id,
        qr.user_id,
        qr.timestamp,
        qr.subject,
        qr.subtopic,
        qr.age,
        qr.language,
        qr.correct_count,
        qr.wrong_count,
        qr.time_taken,
        qr.score_percentage,
        u.name as user_name,
        u.email as user_email,
        (qr.correct_count + qr.wrong_count) as total_questions
      FROM quiz_results qr
      LEFT JOIN users u ON qr.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    // If quizId is provided, parse it to get subject and subtopic
    if (quizId && typeof quizId === 'string' && quizId.includes('_')) {
      const [quizSubject, ...subtopicParts] = quizId.split('_');
      const quizSubtopic = subtopicParts.join('_');
      paramCount++;
      query += ` AND qr.subject = $${paramCount}`;
      params.push(quizSubject);
      paramCount++;
      query += ` AND qr.subtopic = $${paramCount}`;
      params.push(quizSubtopic);
    } else {
      // Use individual subject/subtopic filters if quizId not provided
      if (subject) {
        paramCount++;
        query += ` AND qr.subject ILIKE $${paramCount}`;
        params.push(`%${subject}%`);
      }

      if (subtopic) {
        paramCount++;
        query += ` AND qr.subtopic ILIKE $${paramCount}`;
        params.push(`%${subtopic}%`);
      }
    }

    query += ` ORDER BY qr.timestamp DESC LIMIT $${++paramCount}`;
    params.push(parseInt(limit) || 100);

    const result = await pool.query(query, params);

    // Calculate composite scores and rankings
    const participants = result.rows.map((row) => {
      const totalQuestions = parseInt(row.total_questions) || 1;
      const correctAnswers = parseInt(row.correct_count) || 0;
      const timeTaken = parseInt(row.time_taken) || 1;
      const scorePercentage = parseFloat(row.score_percentage) || 0;

      // Calculate components (normalized to 0-100 scale)
      const scoreComponent = scorePercentage * 0.6;
      const questionsComponent = (correctAnswers / totalQuestions) * 100 * 0.2;
      const avgTimePerQuestion = timeTaken / totalQuestions;
      const idealTimePerQuestion = 30;
      const timeEfficiency = Math.max(0, Math.min(100, (idealTimePerQuestion / avgTimePerQuestion) * 100));
      const timeComponent = timeEfficiency * 0.2;
      const compositeScore = scoreComponent + questionsComponent + timeComponent;

      return {
        attemptId: row.id,
        userId: row.user_id,
        userName: row.user_name || 'Unknown',
        userEmail: row.user_email || '',
        subject: row.subject,
        subtopic: row.subtopic,
        age: row.age,
        language: row.language,
        timestamp: row.timestamp,
        scorePercentage: Math.round(scorePercentage),
        correctAnswers,
        totalQuestions,
        wrongAnswers: parseInt(row.wrong_count) || 0,
        timeTaken,
        timeTakenFormatted: formatTime(timeTaken),
        compositeScore: Math.round(compositeScore * 10) / 10,
        scoreBreakdown: {
          scoreComponent: Math.round(scoreComponent * 10) / 10,
          questionsComponent: Math.round(questionsComponent * 10) / 10,
          timeComponent: Math.round(timeComponent * 10) / 10,
        },
      };
    });

    // Sort by selected criteria
    let sortedParticipants = [...participants];
    switch (sortBy) {
      case 'score':
        sortedParticipants.sort((a, b) => b.scorePercentage - a.scorePercentage);
        break;
      case 'time':
        sortedParticipants.sort((a, b) => a.timeTaken - b.timeTaken);
        break;
      case 'questions':
        sortedParticipants.sort((a, b) => {
          const ratioA = a.correctAnswers / a.totalQuestions;
          const ratioB = b.correctAnswers / b.totalQuestions;
          return ratioB - ratioA;
        });
        break;
      case 'composite':
      default:
        sortedParticipants.sort((a, b) => b.compositeScore - a.compositeScore);
        break;
    }

    // Assign ranks
    sortedParticipants.forEach((participant, index) => {
      participant.rank = index + 1;
    });

    // Group by subject/subtopic for summary
    const summary = {
      totalAttempts: participants.length,
      totalParticipants: new Set(participants.map((p) => p.userId)).size,
      averageScore: participants.length > 0
        ? Math.round(participants.reduce((sum, p) => sum + p.scorePercentage, 0) / participants.length)
        : 0,
      averageTime: participants.length > 0
        ? Math.round(participants.reduce((sum, p) => sum + p.timeTaken, 0) / participants.length)
        : 0,
      subjects: {},
    };

    participants.forEach((p) => {
      if (!summary.subjects[p.subject]) {
        summary.subjects[p.subject] = {
          attempts: 0,
          averageScore: 0,
          participants: new Set(),
        };
      }
      summary.subjects[p.subject].attempts++;
      summary.subjects[p.subject].participants.add(p.userId);
    });

    // Calculate average scores per subject
    Object.keys(summary.subjects).forEach((subject) => {
      const subjectParticipants = participants.filter((p) => p.subject === subject);
      summary.subjects[subject].averageScore = subjectParticipants.length > 0
        ? Math.round(
            subjectParticipants.reduce((sum, p) => sum + p.scorePercentage, 0) /
              subjectParticipants.length
          )
        : 0;
      summary.subjects[subject].participants = summary.subjects[subject].participants.size;
    });

    res.json({
      success: true,
      summary,
      leaderboard: sortedParticipants,
      participants: sortedParticipants,
    });
  } catch (error) {
    console.error('Error in quiz rankings:', error);
    next(error);
  }
});

/**
 * Format time in seconds to readable format
 */
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}

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

