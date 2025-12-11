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
import { QuizConfig } from '@/types/quiz';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
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
  // Don't set Content-Type for FormData, let axios handle it
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
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
   * Get current user from localStorage
   */
  getCurrentUser: (): { user: unknown; token: string | null } => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');
    return {
      user: userStr ? JSON.parse(userStr) : null,
      token,
    };
  },

  /**
   * Fetch current user from API (includes roles and permissions)
   */
  fetchCurrentUser: async (): Promise<{ user: unknown }> => {
    const response = await apiClient.get<{ success: boolean; user: unknown }>('/auth/me');
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return { user: response.data.user };
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

  /**
   * Start quiz attempt
   */
  startQuizAttempt: async (quizId: string): Promise<{
    attempt: {
      id: string;
      user_id: string;
      quiz_id: string;
      total_questions: number;
      status: string;
      started_at: string;
    };
    quiz: {
      id: string;
      name: string;
      number_of_questions: number;
      time_limit?: number;
      questions: Array<{
        id: string;
        question_type: string;
        question_text: string;
        question_image_url?: string;
        options: unknown;
        correct_answer: string;
        explanation?: string;
        points: number;
      }>;
    };
  }> => {
    const response = await apiClient.post(`/quizzes/${quizId}/attempt`);
    return response.data;
  },

  /**
   * Get quiz attempt (for resuming)
   */
  getQuizAttempt: async (attemptId: string): Promise<{
    attempt: {
      id: string;
      user_id: string;
      quiz_id: string;
      total_questions: number;
      status: string;
      started_at: string;
      answers?: Array<{
        question_id: string;
        user_answer: string;
      }>;
    };
    quiz: {
      id: string;
      name: string;
      number_of_questions: number;
      time_limit?: number;
      questions: Array<{
        id: string;
        question_type: string;
        question_text: string;
        question_image_url?: string;
        options: unknown;
        correct_answer: string;
        explanation?: string;
        points: number;
      }>;
    };
  }> => {
    const response = await apiClient.get(`/quizzes/attempts/${attemptId}`);
    return response.data;
  },
};

/**
 * Quiz Library API endpoints
 */
export const quizLibraryApi = {
  /**
   * Save quiz to library
   */
  saveToLibrary: async (data: {
    title?: string;
    description?: string;
    subject: string;
    subtopics?: string[];
    difficulty: string;
    age_group?: number;
    language?: string;
    question_count?: number;
    time_limit?: number;
    grade_level?: string;
    exam_style?: string;
    questions: unknown[];
    config?: QuizConfig;
  }): Promise<{ success: boolean; quiz: unknown; message: string }> => {
    const response = await apiClient.post('/quiz-library', data);
    return response.data;
  },

  /**
   * Get quizzes from library
   */
  getQuizzes: async (params?: {
    subject?: string;
    difficulty?: string;
    tags?: string[];
    grade_level?: string;
    exam_style?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ success: boolean; quizzes: unknown[]; count: number }> => {
    const response = await apiClient.get('/quiz-library', { params });
    return response.data;
  },

  /**
   * Get quiz by ID
   */
  getQuizById: async (id: string): Promise<{ success: boolean; quiz: unknown }> => {
    const response = await apiClient.get(`/quiz-library/${id}`);
    return response.data;
  },

  /**
   * Get suggested quizzes based on subject and tags
   */
  getSuggestions: async (params: {
    subject: string;
    tags?: string[];
  }): Promise<{ success: boolean; suggestions: unknown[] }> => {
    const response = await apiClient.get('/quiz-library/suggestions', { params });
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

  /**
   * Get shared study library with search
   */
  getStudyLibrary: async (params?: {
    search?: string;
    subject?: string;
    age?: number;
    difficulty?: string;
    language?: string;
    limit?: number;
    offset?: number;
    sortBy?: 'timestamp' | 'popularity';
  }): Promise<{
    success: boolean;
    sessions: unknown[];
    pagination: { total: number; limit: number; offset: number; pages: number };
  }> => {
    try {
      const response = await apiClient.get('/study-library', { params });
      if (response.data.success === false) {
        throw new Error(response.data.message || 'Failed to load study library');
      }
      return response.data;
    } catch (error: any) {
      console.error('Study library API error:', error);
      throw error;
    }
  },

  /**
   * Get study session by ID from library
   */
  getStudySession: async (id: string): Promise<{ session: unknown }> => {
    const response = await apiClient.get(`/study-library/${id}`);
    return response.data;
  },

  /**
   * Get popular study sessions
   */
  getPopularStudySessions: async (limit?: number): Promise<{ sessions: unknown[] }> => {
    const response = await apiClient.get('/study-library/popular', {
      params: { limit },
    });
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

/**
 * Plan API endpoints
 */
/**
 * Scheduled Tests API for students
 */
export const scheduledTestsApi = {
  /**
   * Get scheduled tests for current user
   */
  getMyScheduledTests: async (): Promise<{
    scheduledTests: Array<{
      id: string;
      quizId: string;
      quizName: string;
      quizDescription?: string;
      quizAgeGroup: string;
      quizDifficulty: string;
      numberOfQuestions: number;
      passingPercentage: number;
      timeLimit?: number;
      scheduledFor: string;
      visibleFrom: string;
      visibleUntil?: string;
      durationMinutes?: number;
      status: 'scheduled' | 'active' | 'completed' | 'cancelled';
      instructions?: string;
      scheduledByName?: string;
    }>;
  }> => {
    const response = await apiClient.get('/scheduled-tests/my-tests');
    return response.data;
  },

  /**
   * Get scheduled test by ID (for students)
   */
  getScheduledTest: async (testId: string): Promise<{
    scheduledTest: {
      id: string;
      quiz_id: string;
      quiz_name: string;
      quiz_description?: string;
      quiz_age_group: string;
      quiz_difficulty: string;
      number_of_questions: number;
      passing_percentage: number;
      time_limit?: number;
      scheduled_for: string;
      visible_from: string;
      visible_until?: string;
      duration_minutes?: number;
      status: 'scheduled' | 'active' | 'completed' | 'cancelled';
      instructions?: string;
    };
  }> => {
    const response = await apiClient.get(`/scheduled-tests/${testId}`);
    return response.data;
  },
};

export const planApi = {
  /**
   * Get all plans
   */
  getAllPlans: async (): Promise<{
    success: boolean;
    plans: Array<{
      id: string;
      name: string;
      description: string | null;
      daily_quiz_limit: number;
      daily_topic_limit: number;
      monthly_cost: number;
      status: string;
    }>;
  }> => {
    const response = await apiClient.get('/plans');
    return response.data;
  },

  /**
   * Get user's current plan and usage
   */
  getUserPlan: async (userId: string): Promise<{
    success: boolean;
    plan: {
      id: string;
      name: string;
      description: string | null;
      daily_quiz_limit: number;
      daily_topic_limit: number;
      monthly_cost: number;
      status: string;
    };
    usage: {
      quizCount: number;
      topicCount: number;
      date: string;
    };
    limits: {
      dailyQuizLimit: number;
      dailyTopicLimit: number;
      remainingQuizzes: number;
      remainingTopics: number;
    };
  }> => {
    const response = await apiClient.get(`/plans/user/${userId}`);
    return response.data;
  },
};

/**
 * Public API endpoints (no authentication required)
 */
export const publicApi = {
  /**
   * Track home page view
   */
  trackHomeView: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post('/public/home-view');
      return response.data;
    } catch (error) {
      // Don't throw - tracking failures shouldn't break the app
      console.error('Failed to track home view:', error);
      return { success: false, message: 'Failed to track view' };
    }
  },

  /**
   * Get total home page views count
   */
  getTotalHomeViews: async (): Promise<{ success: boolean; totalViews: number }> => {
    try {
      const response = await apiClient.get<{ success: boolean; totalViews: number }>(
        '/public/home-views'
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get home views:', error);
      return { success: false, totalViews: 0 };
    }
  },
};

