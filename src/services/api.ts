/**
 * Backend API service for authentication, quiz results, and analytics
 */

import axios from 'axios';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  SocialLoginData,
  QuizResultRequest,
  QuizResultResponse,
  QuizHistoryResponse,
  StudySessionRequest,
  StudySessionResponse,
  StudyHistoryResponse,
  AnalyticsData,
  RecommendedTopicsResponse,
  User,
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Extract error message from axios error
 * @param error - The error object (can be axios error or regular error)
 * @returns User-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Axios error - check response data first
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    // Network error or no response
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return 'Network error. Please check your connection and try again.';
    }
    // Status code errors
    if (error.response?.status) {
      return `Request failed with status ${error.response.status}`;
    }
    return error.message || 'An unexpected error occurred';
  }
  // Regular Error object
  if (error instanceof Error) {
    return error.message;
  }
  // Unknown error type
  return 'An unexpected error occurred';
};

/**
 * Authentication API endpoints
 */
export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Social login (Google/Apple)
   */
  socialLogin: async (data: SocialLoginData): Promise<AuthResponse> => {
    // Use /google endpoint for Google, /social for others
    const endpoint = data.provider === 'google' ? '/auth/google' : '/auth/social';
    const response = await apiClient.post<AuthResponse>(endpoint, {
      token: data.token,
      email: data.email,
      name: data.name,
    });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Logout - clears authentication data and dispatches logout event
   */
  logout: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    // Dispatch custom event to notify App component
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
  },

  /**
   * Get current user
   */
  getCurrentUser: (): { user: unknown; token: string | null } => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');
    return {
      user: userStr ? JSON.parse(userStr) : null,
      token,
    };
  },
};

/**
 * Quiz results API endpoints
 */
export const quizApi = {
  /**
   * Save quiz result to backend
   */
  saveQuizResult: async (data: QuizResultRequest): Promise<QuizResultResponse> => {
    const response = await apiClient.post<QuizResultResponse>('/quiz/results', data);
    return response.data;
  },

  /**
   * Get user's quiz history
   */
  getQuizHistory: async (userId: string): Promise<QuizHistoryResponse> => {
    const response = await apiClient.get<QuizHistoryResponse>(`/quiz/history/${userId}`);
    return response.data;
  },
};

/**
 * Study API endpoints
 */
export const studyApi = {
  /**
   * Save study session to backend
   */
  saveStudySession: async (data: StudySessionRequest): Promise<StudySessionResponse> => {
    const response = await apiClient.post<StudySessionResponse>('/study/sessions', data);
    return response.data;
  },

  /**
   * Get user's study history
   */
  getStudyHistory: async (userId: string): Promise<StudyHistoryResponse> => {
    const response = await apiClient.get<StudyHistoryResponse>(`/study/history/${userId}`);
    return response.data;
  },
};

/**
 * Profile API endpoints
 */
export const profileApi = {
  /**
   * Get user profile
   */
  getProfile: async (): Promise<{ user: User }> => {
    const response = await apiClient.get<{ success: boolean; user: User }>('/profile');
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return { user: response.data.user };
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: {
    name: string;
    age?: number;
    grade?: string;
    preferredLanguage?: string;
  }): Promise<{ user: User; message: string }> => {
    const response = await apiClient.put<{
      success: boolean;
      user: User;
      message: string;
    }>('/profile', data);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return {
      user: response.data.user,
      message: response.data.message,
    };
  },
};

/**
 * Analytics API endpoints
 */
export const analyticsApi = {
  /**
   * Get user analytics and performance data
   */
  getAnalytics: async (userId: string): Promise<AnalyticsData> => {
    const response = await apiClient.get<AnalyticsData>(`/analytics/${userId}`);
    return response.data;
  },

  /**
   * Get recommended topics for improvement
   */
  getRecommendedTopics: async (userId: string): Promise<RecommendedTopicsResponse> => {
    const response = await apiClient.get<RecommendedTopicsResponse>(
      `/analytics/recommendations/${userId}`
    );
    return response.data;
  },
};

