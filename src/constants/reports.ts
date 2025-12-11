/**
 * Report-related constants
 */

export const REPORT_CONSTANTS = {
  CSV_SEPARATOR: ',',
  DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  EXPORT_FILENAME_PREFIX: 'quiz-report',
} as const;

export const REPORT_MESSAGES = {
  EXPORT_SUCCESS: 'Report exported successfully',
  EXPORT_ERROR: 'Failed to export report',
  NO_PARTICIPANTS: 'No participants found for this quiz',
  LOADING_PARTICIPANTS: 'Loading participants...',
} as const;

