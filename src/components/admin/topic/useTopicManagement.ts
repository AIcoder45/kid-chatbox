/**
 * Custom hook for topic management logic
 */

import { useState, useCallback } from 'react';
import { useToast } from '@/shared/design-system';
import { adminApi, Topic, Subtopic } from '@/services/admin';
import { TOPIC_MESSAGES, SUBTOPIC_MESSAGES } from '@/constants/topics';

interface UseTopicManagementReturn {
  topics: Topic[];
  subtopics: Subtopic[];
  loading: boolean;
  error: string | null;
  formLoading: boolean;
  setTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
  setSubtopics: React.Dispatch<React.SetStateAction<Subtopic[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setFormLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loadTopics: () => Promise<void>;
  loadSubtopics: (topicId: string) => Promise<void>;
  handleTopicSubmit: (formData: {
    title: string;
    description: string;
    ageGroup: string;
    difficultyLevel: string;
    category: string;
    thumbnailUrl: string;
  }) => Promise<void>;
  handleDeleteTopic: (id: string, selectedTopicId?: string | null) => Promise<void>;
  handleSubtopicSubmit: (
    topicId: string,
    formData: {
      title: string;
      description: string;
      difficultyLevel: string;
      illustrationUrl: string;
      videoUrl: string;
      voiceNarrationUrl: string;
      aiStory: string;
      orderIndex: number;
    }
  ) => Promise<void>;
  handleDeleteSubtopic: (id: string, topicId: string) => Promise<void>;
}

/**
 * Custom hook for topic management
 */
export const useTopicManagement = (): UseTopicManagementReturn => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const toast = useToast();

  /**
   * Loads all topics from the API
   */
  const loadTopics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getTopics({ isActive: true });
      setTopics(data.topics);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : TOPIC_MESSAGES.LOAD_ERROR;
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Loads subtopics for a specific topic
   */
  const loadSubtopics = useCallback(async (topicId: string) => {
    try {
      const data = await adminApi.getTopic(topicId);
      setSubtopics(data.subtopics);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : SUBTOPIC_MESSAGES.LOAD_ERROR;
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
      });
    }
  }, [toast]);

  /**
   * Handles topic form submission
   */
  const handleTopicSubmit = useCallback(
    async (formData: {
      title: string;
      description: string;
      ageGroup: string;
      difficultyLevel: string;
      category: string;
      thumbnailUrl: string;
    }) => {
      try {
        setFormLoading(true);
        await adminApi.createTopic({
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          ageGroup: formData.ageGroup,
          difficultyLevel: formData.difficultyLevel,
          category: formData.category.trim() || undefined,
          thumbnailUrl: formData.thumbnailUrl.trim() || undefined,
          isActive: true,
        });
        toast({
          title: 'Success',
          description: TOPIC_MESSAGES.CREATE_SUCCESS,
          status: 'success',
          duration: 3000,
        });
        await loadTopics();
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : TOPIC_MESSAGES.CREATE_ERROR;
        toast({
          title: 'Error',
          description: errorMessage,
          status: 'error',
          duration: 3000,
        });
        throw err;
      } finally {
        setFormLoading(false);
      }
    },
    [toast, loadTopics]
  );

  /**
   * Handles topic deletion
   */
  const handleDeleteTopic = useCallback(
    async (id: string, selectedTopicId?: string | null) => {
      if (
        !window.confirm(
          'Are you sure you want to delete this topic? This will also delete all associated subtopics.'
        )
      ) {
        return;
      }

      try {
        await adminApi.deleteTopic(id);
        toast({
          title: 'Success',
          description: TOPIC_MESSAGES.DELETE_SUCCESS,
          status: 'success',
          duration: 3000,
        });
        if (selectedTopicId === id) {
          setSubtopics([]);
        }
        await loadTopics();
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : TOPIC_MESSAGES.DELETE_ERROR;
        toast({
          title: 'Error',
          description: errorMessage,
          status: 'error',
          duration: 3000,
        });
      }
    },
    [toast, loadTopics]
  );

  /**
   * Handles subtopic form submission
   */
  const handleSubtopicSubmit = useCallback(
    async (
      topicId: string,
      formData: {
        title: string;
        description: string;
        difficultyLevel: string;
        illustrationUrl: string;
        videoUrl: string;
        voiceNarrationUrl: string;
        aiStory: string;
        orderIndex: number;
      }
    ) => {
      try {
        setFormLoading(true);
        await adminApi.createSubtopic(topicId, {
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          difficultyLevel: formData.difficultyLevel,
          illustrationUrl: formData.illustrationUrl.trim() || undefined,
          videoUrl: formData.videoUrl.trim() || undefined,
          voiceNarrationUrl: formData.voiceNarrationUrl.trim() || undefined,
          aiStory: formData.aiStory.trim() || undefined,
          orderIndex: formData.orderIndex,
          isActive: true,
        });
        toast({
          title: 'Success',
          description: SUBTOPIC_MESSAGES.CREATE_SUCCESS,
          status: 'success',
          duration: 3000,
        });
        await loadSubtopics(topicId);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : SUBTOPIC_MESSAGES.CREATE_ERROR;
        toast({
          title: 'Error',
          description: errorMessage,
          status: 'error',
          duration: 3000,
        });
        throw err;
      } finally {
        setFormLoading(false);
      }
    },
    [toast, loadSubtopics]
  );

  /**
   * Handles subtopic deletion
   */
  const handleDeleteSubtopic = useCallback(
    async (id: string, topicId: string) => {
      if (!window.confirm('Are you sure you want to delete this subtopic?')) {
        return;
      }

      try {
        await adminApi.deleteSubtopic(id);
        toast({
          title: 'Success',
          description: SUBTOPIC_MESSAGES.DELETE_SUCCESS,
          status: 'success',
          duration: 3000,
        });
        await loadSubtopics(topicId);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : SUBTOPIC_MESSAGES.DELETE_ERROR;
        toast({
          title: 'Error',
          description: errorMessage,
          status: 'error',
          duration: 3000,
        });
      }
    },
    [toast, loadSubtopics]
  );

  return {
    topics,
    subtopics,
    loading,
    error,
    formLoading,
    setTopics,
    setSubtopics,
    setLoading,
    setError,
    setFormLoading,
    loadTopics,
    loadSubtopics,
    handleTopicSubmit,
    handleDeleteTopic,
    handleSubtopicSubmit,
    handleDeleteSubtopic,
  };
};


