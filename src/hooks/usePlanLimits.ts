/**
 * Hook to check user plan limits
 * Provides plan information and helper functions to check if user can take quizzes
 */

import { useState, useEffect } from 'react';
import { planApi } from '@/services/api';
import { authApi } from '@/services/api';

interface PlanInfo {
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
}

interface UsePlanLimitsReturn {
  planInfo: PlanInfo | null;
  loading: boolean;
  canTakeQuiz: boolean;
  canAccessTopic: boolean;
  refreshPlanInfo: () => Promise<void>;
}

/**
 * Hook to get and check user plan limits
 */
export const usePlanLimits = (): UsePlanLimitsReturn => {
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPlanInfo = async () => {
    try {
      setLoading(true);
      const { user } = authApi.getCurrentUser();
      if (!user || !(user as { id: string }).id) {
        setPlanInfo(null);
        return;
      }

      const data = await planApi.getUserPlan((user as { id: string }).id);
      setPlanInfo(data);
    } catch (error) {
      console.error('Failed to load plan info:', error);
      // Set default freemium plan if API fails
      setPlanInfo({
        plan: {
          id: 'freemium',
          name: 'Freemium Plan',
          description: 'Free plan with basic limits',
          daily_quiz_limit: 1,
          daily_topic_limit: 1,
          monthly_cost: 0,
          status: 'active',
        },
        usage: {
          quizCount: 0,
          topicCount: 0,
          date: new Date().toISOString().split('T')[0],
        },
        limits: {
          dailyQuizLimit: 1,
          dailyTopicLimit: 1,
          remainingQuizzes: 1,
          remainingTopics: 1,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlanInfo();
  }, []);

  const canTakeQuiz = planInfo ? planInfo.limits.remainingQuizzes > 0 : true;
  const canAccessTopic = planInfo ? planInfo.limits.remainingTopics > 0 : true;

  return {
    planInfo,
    loading,
    canTakeQuiz,
    canAccessTopic,
    refreshPlanInfo: loadPlanInfo,
  };
};

