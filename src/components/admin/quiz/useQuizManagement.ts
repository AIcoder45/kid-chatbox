/**
 * Custom hook for quiz management logic
 */

import { useState, useEffect, useCallback } from 'react';
import { adminApi, scheduledTestsApi, ScheduledTest } from '@/services/admin';
import { planApi } from '@/services/api';
import { Topic, Subtopic, Quiz } from '@/services/admin';
import { mapQuizData } from './quizUtils';

export const useQuizManagement = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [plans, setPlans] = useState<Array<{ id: string; name: string }>>([]);
  const [scheduledTests, setScheduledTests] = useState<ScheduledTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuizzes = useCallback(async () => {
    try {
      const data = await adminApi.getAllQuizzes();
      const mappedQuizzes = data.quizzes.map((quiz: any) => mapQuizData(quiz));
      setQuizzes(mappedQuizzes);
    } catch (err) {
      console.error('Failed to load quizzes', err);
    }
  }, []);

  const loadTopics = useCallback(async () => {
    try {
      const data = await adminApi.getTopics({ isActive: true });
      setTopics(data.topics);
    } catch (err) {
      console.error('Failed to load topics', err);
    }
  }, []);

  const loadSubtopics = useCallback(async (topicId: string) => {
    try {
      const data = await adminApi.getTopic(topicId);
      setSubtopics(data.subtopics);
      return data.subtopics;
    } catch (err) {
      console.error('Failed to load subtopics', err);
      setSubtopics([]);
      return [];
    }
  }, []);

  const loadPlans = useCallback(async () => {
    try {
      const data = await planApi.getAllPlans();
      setPlans(data.plans.filter((p) => p.status === 'active'));
    } catch (err) {
      console.error('Failed to load plans', err);
    }
  }, []);

  const loadScheduledTests = useCallback(async () => {
    try {
      const data = await scheduledTestsApi.getScheduledTests();
      const mappedTests = data.scheduledTests.map((test: any) => ({
        ...test,
        quizName: test.quiz_name || test.quizName,
        quizDescription: test.quiz_description || test.quizDescription,
        scheduledBy: test.scheduled_by || test.scheduledBy,
        scheduledByName: test.scheduled_by_name || test.scheduledByName,
        scheduledFor: test.scheduled_for || test.scheduledFor,
        visibleFrom: test.visible_from || test.visibleFrom,
        visibleUntil: test.visible_until || test.visibleUntil,
        durationMinutes: test.duration_minutes || test.durationMinutes,
        planIds: test.plan_ids || test.planIds || [],
        userIds: test.user_ids || test.userIds || [],
        createdAt: test.created_at || test.createdAt,
        updatedAt: test.updated_at || test.updatedAt,
      }));
      setScheduledTests(mappedTests);
    } catch (err) {
      console.error('Failed to load scheduled tests', err);
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadQuizzes(),
        loadTopics(),
        loadPlans(),
        loadScheduledTests(),
      ]);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loadQuizzes, loadTopics, loadPlans, loadScheduledTests]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    quizzes,
    topics,
    subtopics,
    plans,
    scheduledTests,
    loading,
    error,
    loadQuizzes,
    loadTopics,
    loadSubtopics,
    loadPlans,
    loadScheduledTests,
    loadData,
    setQuizzes,
    setScheduledTests,
  };
};

