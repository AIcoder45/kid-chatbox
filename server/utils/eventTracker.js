/**
 * Event Tracking Utility
 * Comprehensive event logging system for analytics
 */

const { pool } = require('../config/database');

/**
 * Event types enum
 */
const EVENT_TYPES = {
  // User events
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_REGISTER: 'USER_REGISTER',
  USER_APPROVED: 'USER_APPROVED',
  USER_REJECTED: 'USER_REJECTED',
  USER_SUSPENDED: 'USER_SUSPENDED',
  
  // Study events
  TOPIC_VIEWED: 'TOPIC_VIEWED',
  SUBTOPIC_VIEWED: 'SUBTOPIC_VIEWED',
  STUDY_MATERIAL_VIEWED: 'STUDY_MATERIAL_VIEWED',
  STUDY_SESSION_STARTED: 'STUDY_SESSION_STARTED',
  STUDY_SESSION_COMPLETED: 'STUDY_SESSION_COMPLETED',
  STUDY_MATERIAL_COMPLETED: 'STUDY_MATERIAL_COMPLETED',
  CONTENT_REVISITED: 'CONTENT_REVISITED',
  VIDEO_STARTED: 'VIDEO_STARTED',
  VIDEO_PAUSED: 'VIDEO_PAUSED',
  VIDEO_COMPLETED: 'VIDEO_COMPLETED',
  
  // Quiz events
  QUIZ_STARTED: 'QUIZ_STARTED',
  QUIZ_COMPLETED: 'QUIZ_COMPLETED',
  QUIZ_ABANDONED: 'QUIZ_ABANDONED',
  QUESTION_ANSWERED: 'QUESTION_ANSWERED',
  HINT_USED: 'HINT_USED',
  EXPLANATION_VIEWED: 'EXPLANATION_VIEWED',
  
  // Dashboard events
  DASHBOARD_VIEWED: 'DASHBOARD_VIEWED',
  HOME_SCREEN_VIEWED: 'HOME_SCREEN_VIEWED',
  
  // Admin events
  TOPIC_CREATED: 'TOPIC_CREATED',
  TOPIC_UPDATED: 'TOPIC_UPDATED',
  TOPIC_DELETED: 'TOPIC_DELETED',
  QUIZ_CREATED: 'QUIZ_CREATED',
  QUIZ_UPDATED: 'QUIZ_UPDATED',
  QUIZ_DELETED: 'QUIZ_DELETED',
  STUDY_MATERIAL_UPLOADED: 'STUDY_MATERIAL_UPLOADED',
  USER_CREATED: 'USER_CREATED',
  USER_UPDATED: 'USER_UPDATED',
  
  // System events
  IDLE_TIME_DETECTED: 'IDLE_TIME_DETECTED',
  DROPOFF_DETECTED: 'DROPOFF_DETECTED',
};

/**
 * Track an event
 * @param {Object} params - Event parameters
 * @param {string} params.userId - User ID (optional for system events)
 * @param {string} params.eventType - Event type from EVENT_TYPES
 * @param {string} params.resourceType - Resource type (topic, quiz, subtopic, etc.)
 * @param {string} params.resourceId - Resource ID
 * @param {Object} params.metadata - Additional metadata
 * @param {number} params.duration - Duration in seconds (optional)
 * @param {string} params.ipAddress - IP address (optional)
 * @param {string} params.userAgent - User agent (optional)
 */
const trackEvent = async ({
  userId = null,
  eventType,
  resourceType = null,
  resourceId = null,
  metadata = {},
  duration = null,
  ipAddress = null,
  userAgent = null,
}) => {
  try {
    if (!eventType) {
      console.error('Event tracking failed: eventType is required');
      return;
    }

    const query = `
      INSERT INTO activity_logs (
        user_id,
        action,
        event_type,
        resource_type,
        resource_id,
        metadata,
        duration,
        ip_address,
        user_agent,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
    `;

    await pool.query(query, [
      userId,
      eventType, // Keep action for backward compatibility
      eventType,
      resourceType,
      resourceId,
      JSON.stringify(metadata),
      duration,
      ipAddress,
      userAgent,
    ]);
  } catch (error) {
    // Don't throw errors - tracking should not break the app
    console.error('Event tracking failed:', error);
  }
};

/**
 * Track user login
 */
const trackLogin = async (userId, ipAddress = null, userAgent = null) => {
  await trackEvent({
    userId,
    eventType: EVENT_TYPES.USER_LOGIN,
    ipAddress,
    userAgent,
    metadata: { timestamp: new Date().toISOString() },
  });
};

/**
 * Track user logout
 */
const trackLogout = async (userId, sessionDuration = null) => {
  await trackEvent({
    userId,
    eventType: EVENT_TYPES.USER_LOGOUT,
    duration: sessionDuration,
    metadata: { timestamp: new Date().toISOString() },
  });
};

/**
 * Track topic view
 */
const trackTopicView = async (userId, topicId, duration = null) => {
  await trackEvent({
    userId,
    eventType: EVENT_TYPES.TOPIC_VIEWED,
    resourceType: 'topic',
    resourceId: topicId,
    duration,
    metadata: { timestamp: new Date().toISOString() },
  });
};

/**
 * Track subtopic view
 */
const trackSubtopicView = async (userId, subtopicId, duration = null) => {
  await trackEvent({
    userId,
    eventType: EVENT_TYPES.SUBTOPIC_VIEWED,
    resourceType: 'subtopic',
    resourceId: subtopicId,
    duration,
    metadata: { timestamp: new Date().toISOString() },
  });
};

/**
 * Track study material view
 */
const trackStudyMaterialView = async (userId, materialId, progress = null) => {
  await trackEvent({
    userId,
    eventType: EVENT_TYPES.STUDY_MATERIAL_VIEWED,
    resourceType: 'study_material',
    resourceId: materialId,
    metadata: {
      progress,
      timestamp: new Date().toISOString(),
    },
  });
};

/**
 * Track study session start
 */
const trackStudySessionStart = async (userId, topicId, subtopicId) => {
  await trackEvent({
    userId,
    eventType: EVENT_TYPES.STUDY_SESSION_STARTED,
    resourceType: 'topic',
    resourceId: topicId,
    metadata: {
      subtopicId,
      timestamp: new Date().toISOString(),
    },
  });
};

/**
 * Track study session completion
 */
const trackStudySessionComplete = async (userId, topicId, subtopicId, duration, progress) => {
  await trackEvent({
    userId,
    eventType: EVENT_TYPES.STUDY_SESSION_COMPLETED,
    resourceType: 'topic',
    resourceId: topicId,
    duration,
    metadata: {
      subtopicId,
      progress,
      timestamp: new Date().toISOString(),
    },
  });
};

/**
 * Track quiz start
 */
const trackQuizStart = async (userId, quizId) => {
  await trackEvent({
    userId,
    eventType: EVENT_TYPES.QUIZ_STARTED,
    resourceType: 'quiz',
    resourceId: quizId,
    metadata: { timestamp: new Date().toISOString() },
  });
};

/**
 * Track quiz completion
 */
const trackQuizComplete = async (userId, quizId, score, duration, correctAnswers, wrongAnswers) => {
  await trackEvent({
    userId,
    eventType: EVENT_TYPES.QUIZ_COMPLETED,
    resourceType: 'quiz',
    resourceId: quizId,
    duration,
    metadata: {
      score,
      correctAnswers,
      wrongAnswers,
      timestamp: new Date().toISOString(),
    },
  });
};

/**
 * Track question answer
 */
const trackQuestionAnswer = async (userId, quizId, questionId, isCorrect, timeTaken) => {
  await trackEvent({
    userId,
    eventType: EVENT_TYPES.QUESTION_ANSWERED,
    resourceType: 'quiz_question',
    resourceId: questionId,
    metadata: {
      quizId,
      isCorrect,
      timeTaken,
      timestamp: new Date().toISOString(),
    },
  });
};

/**
 * Track hint usage
 */
const trackHintUsed = async (userId, questionId, quizId) => {
  await trackEvent({
    userId,
    eventType: EVENT_TYPES.HINT_USED,
    resourceType: 'quiz_question',
    resourceId: questionId,
    metadata: {
      quizId,
      timestamp: new Date().toISOString(),
    },
  });
};

/**
 * Track explanation view
 */
const trackExplanationViewed = async (userId, questionId, quizId) => {
  await trackEvent({
    userId,
    eventType: EVENT_TYPES.EXPLANATION_VIEWED,
    resourceType: 'quiz_question',
    resourceId: questionId,
    metadata: {
      quizId,
      timestamp: new Date().toISOString(),
    },
  });
};

/**
 * Track video events
 */
const trackVideoStart = async (userId, videoId, resourceType = 'subtopic') => {
  await trackEvent({
    userId,
    eventType: EVENT_TYPES.VIDEO_STARTED,
    resourceType,
    resourceId: videoId,
    metadata: { timestamp: new Date().toISOString() },
  });
};

const trackVideoPause = async (userId, videoId, duration) => {
  await trackEvent({
    userId,
    eventType: EVENT_TYPES.VIDEO_PAUSED,
    resourceType: 'video',
    resourceId: videoId,
    duration,
    metadata: { timestamp: new Date().toISOString() },
  });
};

const trackVideoComplete = async (userId, videoId, duration) => {
  await trackEvent({
    userId,
    eventType: EVENT_TYPES.VIDEO_COMPLETED,
    resourceType: 'video',
    resourceId: videoId,
    duration,
    metadata: { timestamp: new Date().toISOString() },
  });
};

/**
 * Track dashboard view
 */
const trackDashboardView = async (userId) => {
  await trackEvent({
    userId,
    eventType: EVENT_TYPES.DASHBOARD_VIEWED,
    metadata: { timestamp: new Date().toISOString() },
  });
};

/**
 * Track content revisit
 */
const trackContentRevisit = async (userId, resourceType, resourceId) => {
  await trackEvent({
    userId,
    eventType: EVENT_TYPES.CONTENT_REVISITED,
    resourceType,
    resourceId,
    metadata: { timestamp: new Date().toISOString() },
  });
};

/**
 * Track idle time
 */
const trackIdleTime = async (userId, duration, lastActivity) => {
  await trackEvent({
    userId,
    eventType: EVENT_TYPES.IDLE_TIME_DETECTED,
    duration,
    metadata: {
      lastActivity,
      timestamp: new Date().toISOString(),
    },
  });
};

/**
 * Track dropoff
 */
const trackDropoff = async (userId, resourceType, resourceId, dropoffPoint) => {
  await trackEvent({
    userId,
    eventType: EVENT_TYPES.DROPOFF_DETECTED,
    resourceType,
    resourceId,
    metadata: {
      dropoffPoint,
      timestamp: new Date().toISOString(),
    },
  });
};

/**
 * Track admin actions
 */
const trackTopicCreated = async (adminId, topicId) => {
  await trackEvent({
    userId: adminId,
    eventType: EVENT_TYPES.TOPIC_CREATED,
    resourceType: 'topic',
    resourceId: topicId,
    metadata: { timestamp: new Date().toISOString() },
  });
};

const trackQuizCreated = async (adminId, quizId) => {
  await trackEvent({
    userId: adminId,
    eventType: EVENT_TYPES.QUIZ_CREATED,
    resourceType: 'quiz',
    resourceId: quizId,
    metadata: { timestamp: new Date().toISOString() },
  });
};

const trackUserApproved = async (adminId, userId) => {
  await trackEvent({
    userId: adminId,
    eventType: EVENT_TYPES.USER_APPROVED,
    resourceType: 'user',
    resourceId: userId,
    metadata: { timestamp: new Date().toISOString() },
  });
};

module.exports = {
  EVENT_TYPES,
  trackEvent,
  trackLogin,
  trackLogout,
  trackTopicView,
  trackSubtopicView,
  trackStudyMaterialView,
  trackStudySessionStart,
  trackStudySessionComplete,
  trackQuizStart,
  trackQuizComplete,
  trackQuestionAnswer,
  trackHintUsed,
  trackExplanationViewed,
  trackVideoStart,
  trackVideoPause,
  trackVideoComplete,
  trackDashboardView,
  trackContentRevisit,
  trackIdleTime,
  trackDropoff,
  trackTopicCreated,
  trackQuizCreated,
  trackUserApproved,
};

