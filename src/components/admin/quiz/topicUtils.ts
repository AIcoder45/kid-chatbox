/**
 * Topic and Subtopic utility functions
 */

import { adminApi } from '@/services/admin';
import { Topic } from '@/services/admin';
import { useToast } from '@/shared/design-system';

interface EnsureTopicSubtopicParams {
  useManualInput: boolean;
  manualTopicName: string;
  manualSubtopicName: string;
  selectedTopic: string;
  selectedSubtopic: string;
  topics: Topic[];
  ageGroup: string;
  difficulty: string;
  loadTopics: () => Promise<void>;
  toast: ReturnType<typeof useToast>;
}

/**
 * Helper function to create or find topic and subtopic
 * Returns the subtopicId to use for quiz creation
 */
export const ensureTopicAndSubtopic = async ({
  useManualInput,
  manualTopicName,
  manualSubtopicName,
  selectedSubtopic,
  topics,
  ageGroup,
  difficulty,
  loadTopics,
  toast,
}: EnsureTopicSubtopicParams): Promise<string | undefined> => {
  if (!useManualInput) {
    // Use existing selected topic/subtopic
    return selectedSubtopic && selectedSubtopic.trim() ? selectedSubtopic : undefined;
  }

  // Manual input mode - create topic and subtopic if needed
  if (!manualTopicName.trim()) {
    return undefined; // No topic specified
  }

  try {
    // Check if topic exists with same name
    const existingTopics = topics.filter(
      (t) => t.title.toLowerCase().trim() === manualTopicName.toLowerCase().trim()
    );

    let topicId: string;
    if (existingTopics.length > 0) {
      topicId = existingTopics[0].id;
    } else {
      // Create new topic
      const topicData = await adminApi.createTopic({
        title: manualTopicName.trim(),
        description: '',
        ageGroup: ageGroup || '6-8',
        difficultyLevel: difficulty || 'Basic',
        category: undefined,
        thumbnailUrl: undefined,
        isActive: true,
      });
      topicId = topicData.topic.id;
      // Reload topics to include the new one
      await loadTopics();
    }

    // Handle subtopic if provided
    if (manualSubtopicName.trim()) {
      // Check if subtopic exists for this topic
      const topicData = await adminApi.getTopic(topicId);
      const existingSubtopics = topicData.subtopics.filter(
        (s) => s.title.toLowerCase().trim() === manualSubtopicName.toLowerCase().trim()
      );

      if (existingSubtopics.length > 0) {
        return existingSubtopics[0].id;
      } else {
        // Create new subtopic
        const subtopicData = await adminApi.createSubtopic(topicId, {
          title: manualSubtopicName.trim(),
          description: '',
          difficultyLevel: difficulty || 'Basic',
          illustrationUrl: undefined,
          videoUrl: undefined,
          voiceNarrationUrl: undefined,
          aiStory: undefined,
          orderIndex: 0,
          isActive: true,
        });
        return subtopicData.subtopic.id;
      }
    }

    return undefined; // No subtopic specified
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to create topic/subtopic';
    toast({
      title: 'Error',
      description: errorMessage,
      status: 'error',
      duration: 5000,
    });
    throw err;
  }
};

