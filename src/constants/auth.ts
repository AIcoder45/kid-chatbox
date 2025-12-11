/**
 * Authentication-related constants
 */

export const LOGIN_CONSTANTS = {
  BRAND_NAME: 'GuruAI',
  BRAND_LOGO: '📚',
  WELCOME_TITLE: 'Welcome Back!',
  WELCOME_SUBTITLE: 'Sign in to continue your learning journey',
  EMAIL_LABEL: 'Email Address',
  EMAIL_PLACEHOLDER: 'your.email@example.com',
  PASSWORD_LABEL: 'Password',
  PASSWORD_PLACEHOLDER: 'Enter your password',
  LOGIN_BUTTON: 'Sign In',
  GOOGLE_BUTTON: 'Continue with Google',
  GOOGLE_LOADING: 'Loading Google Sign-In...',
  OR_DIVIDER: 'OR',
  NO_ACCOUNT_TEXT: "Don't have an account?",
  SIGN_UP_LINK: 'Sign Up',
  BACK_HOME: 'Back to Home',
  FONT_INCREASE_TOOLTIP: 'Increase font size',
  FONT_DECREASE_TOOLTIP: 'Decrease font size',
  FONT_RESET_TOOLTIP: 'Reset font size',
  LOGIN_ERROR: 'Login failed. Please try again.',
  GOOGLE_ERROR: 'Google login failed. Please try again.',
  GOOGLE_NOT_CONFIGURED: 'Google Sign-In is not configured. Please set VITE_GOOGLE_CLIENT_ID in .env file.',
  GOOGLE_LOADING_ERROR: 'Google Sign-In is still loading. Please wait a moment and try again.',
  GOOGLE_BLOCKED: 'Google Sign-In popup was blocked or not available. Please check your browser settings or use email/password login.',
  GOOGLE_CANCELLED: 'Google Sign-In cancelled. Please try again.',
} as const;

export const REGISTER_CONSTANTS = {
  BRAND_NAME: 'GuruAI',
  BRAND_LOGO: '📚',
  WELCOME_TITLE: 'Create Account',
  WELCOME_SUBTITLE: 'Join us and start your learning adventure',
  NAME_LABEL: 'Full Name',
  NAME_PLACEHOLDER: 'Enter your full name',
  EMAIL_LABEL: 'Email Address',
  EMAIL_PLACEHOLDER: 'your.email@example.com',
  PASSWORD_LABEL: 'Password',
  PASSWORD_PLACEHOLDER: 'Create a password',
  CONFIRM_PASSWORD_LABEL: 'Confirm Password',
  CONFIRM_PASSWORD_PLACEHOLDER: 'Re-enter your password',
  REGISTER_BUTTON: 'Create Account',
  GOOGLE_BUTTON: 'Sign up with Google',
  GOOGLE_LOADING: 'Loading Google Sign-In...',
  OR_DIVIDER: 'OR',
  HAVE_ACCOUNT_TEXT: 'Already have an account?',
  SIGN_IN_LINK: 'Sign In',
} as const;

