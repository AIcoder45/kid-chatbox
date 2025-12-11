/**
 * Application-wide constants
 */

export const APP_CONSTANTS = {
  APP_NAME: 'GuruAI',
  BRAND_NAME: 'GuruAI',
  MIN_AGE: 6,
  MAX_AGE: 14,
  DEFAULT_QUIZ_QUESTIONS: 15,
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    SOCIAL: '/auth/social',
    LOGOUT: '/auth/logout',
  },
  QUIZ: {
    SAVE_RESULT: '/quiz/results',
    HISTORY: '/quiz/history',
  },
  ANALYTICS: {
    GET: '/analytics',
    RECOMMENDATIONS: '/analytics/recommendations',
  },
} as const;

export const MESSAGES = {
  WELCOME: 'Welcome back! 👋',
  DASHBOARD_GREETING: 'Hello! What would you like to do today?',
  STUDY_MODE_TITLE: 'AI Study Mode 📚',
  QUIZ_MODE_TITLE: 'AI Quiz Mode 🎯',
  LAST_SCORES: 'Your Recent Scores',
  SUGGESTED_TOPICS: 'Suggested Topics to Improve',
  MOTIVATIONAL: 'Keep practicing! You\'re doing great! 🌟',
  QUIZ_SAVED: 'Your quiz results have been saved! Great job! 🎉',
  QUIZ_HISTORY_TITLE: 'Quiz History 📋',
  QUIZ_HISTORY_EMPTY: 'No quiz history yet. Complete a quiz to see your results here!',
  QUIZ_HISTORY_LOADING: 'Loading your quiz history...',
  QUIZ_HISTORY_ERROR: 'Failed to load quiz history. Please try again.',
  VIEW_QUIZ_DETAILS: 'View Details',
  BACK_TO_DASHBOARD: 'Back to Dashboard',
  NO_QUIZZES_YET: 'You haven\'t completed any quizzes yet.',
} as const;

