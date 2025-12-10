/**
 * Validation utilities for quiz inputs
 */

import { QUIZ_CONSTANTS, LANGUAGES, SUBJECTS } from '@/constants/quiz';
import { Language, Subject } from '@/types/quiz';

/**
 * Validates age input
 * @param age - Age value to validate
 * @returns True if age is valid, false otherwise
 */
export function isValidAge(age: unknown): age is number {
  if (typeof age !== 'number') {
    return false;
  }
  return (
    age >= QUIZ_CONSTANTS.MIN_AGE && age <= QUIZ_CONSTANTS.MAX_AGE
  );
}

/**
 * Validates language selection
 * @param language - Language value to validate
 * @returns True if language is valid, false otherwise
 */
export function isValidLanguage(language: unknown): language is Language {
  return (
    typeof language === 'string' &&
    Object.values(LANGUAGES).includes(language as Language)
  );
}

/**
 * Validates subject selection
 * @param subject - Subject value to validate
 * @returns True if subject is valid, false otherwise
 */
export function isValidSubject(subject: unknown): subject is Subject {
  return (
    typeof subject === 'string' &&
    Object.values(SUBJECTS).includes(subject as Subject)
  );
}

/**
 * Validates answer option
 * @param answer - Answer value to validate
 * @returns True if answer is valid, false otherwise
 */
export function isValidAnswer(
  answer: unknown
): answer is 'A' | 'B' | 'C' | 'D' {
  return typeof answer === 'string' && ['A', 'B', 'C', 'D'].includes(answer);
}

/**
 * Validates subtopic input
 * @param subtopic - Subtopic value to validate
 * @returns True if subtopic is valid (non-empty string), false otherwise
 */
export function isValidSubtopic(subtopic: unknown): subtopic is string {
  return typeof subtopic === 'string' && subtopic.trim().length > 0;
}

