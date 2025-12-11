/**
 * Plan limits validation middleware
 * Checks if user has exceeded daily limits before allowing quiz/topic access
 */

const {
  canTakeQuiz,
  canAccessTopic,
  incrementQuizCount,
  incrementTopicCount,
} = require('../utils/plans');

/**
 * Middleware to check if user can take a quiz
 * Returns 403 if daily limit exceeded
 */
const checkQuizLimit = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const limitCheck = await canTakeQuiz(userId);

    if (!limitCheck.allowed) {
      return res.status(403).json({
        success: false,
        message: `Daily quiz limit reached. You have used ${limitCheck.used} of ${limitCheck.limit} quizzes today.`,
        limit: limitCheck.limit,
        used: limitCheck.used,
        remaining: limitCheck.remaining,
      });
    }

    // Attach limit info to request for use in route handler
    req.planLimits = {
      quiz: limitCheck,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if user can access a topic
 * Returns 403 if daily limit exceeded
 */
const checkTopicLimit = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const limitCheck = await canAccessTopic(userId);

    if (!limitCheck.allowed) {
      return res.status(403).json({
        success: false,
        message: `Daily topic limit reached. You have used ${limitCheck.used} of ${limitCheck.limit} topics today.`,
        limit: limitCheck.limit,
        used: limitCheck.used,
        remaining: limitCheck.remaining,
      });
    }

    // Attach limit info to request for use in route handler
    req.planLimits = {
      topic: limitCheck,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to increment quiz count after successful quiz start
 * Should be called after checkQuizLimit
 */
const incrementQuizUsage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await incrementQuizCount(userId);
    next();
  } catch (error) {
    // Don't fail the request if increment fails
    console.error('Error incrementing quiz count:', error);
    next();
  }
};

/**
 * Middleware to increment topic count after successful topic access
 * Should be called after checkTopicLimit
 */
const incrementTopicUsage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await incrementTopicCount(userId);
    next();
  } catch (error) {
    // Don't fail the request if increment fails
    console.error('Error incrementing topic count:', error);
    next();
  }
};

module.exports = {
  checkQuizLimit,
  checkTopicLimit,
  incrementQuizUsage,
  incrementTopicUsage,
};

