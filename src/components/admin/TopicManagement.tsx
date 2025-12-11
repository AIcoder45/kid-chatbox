/**
 * Topic Management Component
 * Create, edit, and manage topics and subtopics with validation and error handling
 */

import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  useDisclosure,
} from '@/shared/design-system';
import { Topic } from '@/services/admin';
import { SUBTOPIC_MESSAGES } from '@/constants/topics';
import { useTopicManagement } from '@/components/admin/topic/useTopicManagement';
import { TopicForm } from '@/components/admin/topic/TopicForm';
import { SubtopicForm } from '@/components/admin/topic/SubtopicForm';
import { TopicList } from '@/components/admin/topic/TopicList';
import { SubtopicList } from '@/components/admin/topic/SubtopicList';
import { useToast } from '@/shared/design-system';

/**
 * Topic Management component
 * Allows admins to create and manage topics and subtopics
 */
export const TopicManagement: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const toast = useToast();

  const {
    topics,
    subtopics,
    loading,
    error,
    formLoading,
    loadTopics,
    loadSubtopics,
    handleTopicSubmit,
    handleDeleteTopic,
    handleSubtopicSubmit,
    handleDeleteSubtopic,
  } = useTopicManagement();

  // Topic modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Subtopic modal
  const {
    isOpen: isSubtopicOpen,
    onOpen: onSubtopicOpen,
    onClose: onSubtopicClose,
  } = useDisclosure();

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  useEffect(() => {
    if (selectedTopic) {
      loadSubtopics(selectedTopic.id);
    }
  }, [selectedTopic, loadSubtopics]);

  /**
   * Handles topic form submission with modal close
   */
  const handleTopicFormSubmit = async (formData: {
    title: string;
    description: string;
    ageGroup: string;
    difficultyLevel: string;
    category: string;
    thumbnailUrl: string;
  }) => {
    await handleTopicSubmit(formData);
    onClose();
  };

  /**
   * Handles topic deletion
   */
  const handleDelete = async (id: string) => {
    await handleDeleteTopic(id, selectedTopic?.id);
    if (selectedTopic?.id === id) {
      setSelectedTopic(null);
    }
  };

  /**
   * Handles opening the subtopic creation modal
   */
  const handleCreateSubtopic = () => {
    if (!selectedTopic) {
      toast({
        title: 'Error',
        description: SUBTOPIC_MESSAGES.VALIDATION_TOPIC_REQUIRED,
        status: 'error',
        duration: 3000,
      });
      return;
    }
    onSubtopicOpen();
  };

  /**
   * Handles subtopic form submission with modal close
   */
  const handleSubtopicFormSubmit = async (formData: {
    title: string;
    description: string;
    difficultyLevel: string;
    illustrationUrl: string;
    videoUrl: string;
    voiceNarrationUrl: string;
    aiStory: string;
    orderIndex: number;
  }) => {
    if (!selectedTopic) {
      toast({
        title: 'Error',
        description: SUBTOPIC_MESSAGES.VALIDATION_TOPIC_REQUIRED,
        status: 'error',
        duration: 3000,
      });
      return;
    }
    await handleSubtopicSubmit(selectedTopic.id, formData);
    onSubtopicClose();
  };

  /**
   * Handles subtopic deletion
   */
  const handleSubtopicDelete = async (id: string) => {
    if (selectedTopic) {
      await handleDeleteSubtopic(id, selectedTopic.id);
    }
  };

  if (loading && topics.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box padding={{ base: 4, md: 6 }}>
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        <HStack justifyContent="space-between" flexWrap="wrap" spacing={{ base: 2, md: 4 }}>
          <Heading size={{ base: 'md', md: 'lg' }}>Topic Management</Heading>
          <HStack spacing={2} flexWrap="wrap">
            <Button colorScheme="green" onClick={onOpen} size={{ base: 'sm', md: 'md' }}>
              + Create Topic
            </Button>
            {selectedTopic && (
              <Button colorScheme="blue" onClick={handleCreateSubtopic} size={{ base: 'sm', md: 'md' }}>
                + Create Subtopic
              </Button>
            )}
          </HStack>
        </HStack>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <HStack spacing={4} align="start" flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
          <TopicList
            topics={topics}
            selectedTopic={selectedTopic}
            onTopicSelect={setSelectedTopic}
            onTopicDelete={handleDelete}
          />

          {selectedTopic && (
            <SubtopicList
              subtopics={subtopics}
              topicTitle={selectedTopic.title}
              onCreateClick={handleCreateSubtopic}
              onDelete={handleSubtopicDelete}
            />
          )}
        </HStack>

        {/* Topic Creation Modal */}
        <TopicForm
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleTopicFormSubmit}
          isLoading={formLoading}
        />

        {/* Subtopic Creation Modal */}
        <SubtopicForm
          isOpen={isSubtopicOpen}
          onClose={onSubtopicClose}
          onSubmit={handleSubtopicFormSubmit}
          topicTitle={selectedTopic?.title}
          defaultOrderIndex={subtopics.length}
          isLoading={formLoading}
        />
      </VStack>
    </Box>
  );
};
