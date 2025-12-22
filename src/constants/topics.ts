/**
 * Topic and Subtopic Management Constants
 * Centralized constants for topic management features
 */

export const AGE_GROUPS = {
  SIX_TO_EIGHT: '6-8',
  NINE_TO_ELEVEN: '9-11',
  TWELVE_TO_FOURTEEN: '12-14',
} as const;

export const AGE_GROUP_LABELS: Record<string, string> = {
  [AGE_GROUPS.SIX_TO_EIGHT]: '6-8 years',
  [AGE_GROUPS.NINE_TO_ELEVEN]: '9-11 years',
  [AGE_GROUPS.TWELVE_TO_FOURTEEN]: '12-14 years',
} as const;

export const DIFFICULTY_LEVELS_TOPIC = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export const DIFFICULTY_LABELS: Record<string, string> = {
  [DIFFICULTY_LEVELS_TOPIC.EASY]: 'Easy',
  [DIFFICULTY_LEVELS_TOPIC.MEDIUM]: 'Medium',
  [DIFFICULTY_LEVELS_TOPIC.HARD]: 'Hard',
} as const;

export const TOPIC_CATEGORIES = {
  SCIENCE: 'Science',
  MATHEMATICS: 'Mathematics',
  LANGUAGE: 'Language',
  SOCIAL_STUDIES: 'Social Studies',
  ARTS: 'Arts',
  GENERAL_KNOWLEDGE: 'General Knowledge',
  OTHER: 'Other',
} as const;

export const TOPIC_MESSAGES = {
  CREATE_SUCCESS: 'Topic created successfully',
  UPDATE_SUCCESS: 'Topic updated successfully',
  DELETE_SUCCESS: 'Topic deleted successfully',
  CREATE_ERROR: 'Failed to create topic',
  UPDATE_ERROR: 'Failed to update topic',
  DELETE_ERROR: 'Failed to delete topic',
  LOAD_ERROR: 'Failed to load topics',
  VALIDATION_TITLE_REQUIRED: 'Title is required',
  VALIDATION_AGE_GROUP_REQUIRED: 'Age group is required',
  VALIDATION_DIFFICULTY_REQUIRED: 'Difficulty level is required',
  VALIDATION_TITLE_MIN_LENGTH: 'Title must be at least 3 characters',
  VALIDATION_TITLE_MAX_LENGTH: 'Title must not exceed 255 characters',
  VALIDATION_DESCRIPTION_MAX_LENGTH: 'Description must not exceed 1000 characters',
} as const;

export const SUBTOPIC_MESSAGES = {
  CREATE_SUCCESS: 'Subtopic created successfully',
  UPDATE_SUCCESS: 'Subtopic updated successfully',
  DELETE_SUCCESS: 'Subtopic deleted successfully',
  CREATE_ERROR: 'Failed to create subtopic',
  UPDATE_ERROR: 'Failed to update subtopic',
  DELETE_ERROR: 'Failed to delete subtopic',
  LOAD_ERROR: 'Failed to load subtopics',
  VALIDATION_TITLE_REQUIRED: 'Title is required',
  VALIDATION_DIFFICULTY_REQUIRED: 'Difficulty level is required',
  VALIDATION_TOPIC_REQUIRED: 'Please select a topic first',
  VALIDATION_TITLE_MIN_LENGTH: 'Title must be at least 3 characters',
  VALIDATION_TITLE_MAX_LENGTH: 'Title must not exceed 255 characters',
  VALIDATION_DESCRIPTION_MAX_LENGTH: 'Description must not exceed 1000 characters',
} as const;


