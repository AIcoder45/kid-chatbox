/**
 * Subtopic Form Component
 * Form for creating subtopics with validation
 */

import { useState } from 'react';
import {
  VStack,
  HStack,
  Button,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@/shared/design-system';
import { DIFFICULTY_LABELS, SUBTOPIC_MESSAGES } from '@/constants/topics';

interface SubtopicFormData {
  title: string;
  description: string;
  difficultyLevel: string;
  illustrationUrl: string;
  videoUrl: string;
  voiceNarrationUrl: string;
  aiStory: string;
  orderIndex: number;
}

interface SubtopicFormErrors {
  title?: string;
  difficultyLevel?: string;
  description?: string;
}

interface SubtopicFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubtopicFormData) => Promise<void>;
  topicTitle?: string;
  defaultOrderIndex?: number;
  isLoading?: boolean;
}

/**
 * Validates subtopic form data
 * @param formData - Subtopic form data to validate
 * @returns Validation errors object
 */
const validateSubtopicForm = (formData: SubtopicFormData): SubtopicFormErrors => {
  const errors: SubtopicFormErrors = {};

  if (!formData.title.trim()) {
    errors.title = SUBTOPIC_MESSAGES.VALIDATION_TITLE_REQUIRED;
  } else if (formData.title.trim().length < 3) {
    errors.title = SUBTOPIC_MESSAGES.VALIDATION_TITLE_MIN_LENGTH;
  } else if (formData.title.length > 255) {
    errors.title = SUBTOPIC_MESSAGES.VALIDATION_TITLE_MAX_LENGTH;
  }

  if (!formData.difficultyLevel) {
    errors.difficultyLevel = SUBTOPIC_MESSAGES.VALIDATION_DIFFICULTY_REQUIRED;
  }

  if (formData.description && formData.description.length > 1000) {
    errors.description = SUBTOPIC_MESSAGES.VALIDATION_DESCRIPTION_MAX_LENGTH;
  }

  return errors;
};

/**
 * Subtopic Form Component
 * @param isOpen - Whether the modal is open
 * @param onClose - Callback to close the modal
 * @param onSubmit - Callback when form is submitted
 * @param topicTitle - Title of the parent topic
 * @param defaultOrderIndex - Default order index for the subtopic
 * @param isLoading - Whether the form is submitting
 */
export const SubtopicForm: React.FC<SubtopicFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  topicTitle = '',
  defaultOrderIndex = 0,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<SubtopicFormData>({
    title: '',
    description: '',
    difficultyLevel: '',
    illustrationUrl: '',
    videoUrl: '',
    voiceNarrationUrl: '',
    aiStory: '',
    orderIndex: defaultOrderIndex,
  });
  const [formErrors, setFormErrors] = useState<SubtopicFormErrors>({});

  /**
   * Handles form submission
   */
  const handleSubmit = async () => {
    const errors = validateSubtopicForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    await onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      difficultyLevel: '',
      illustrationUrl: '',
      videoUrl: '',
      voiceNarrationUrl: '',
      aiStory: '',
      orderIndex: defaultOrderIndex,
    });
    setFormErrors({});
  };

  /**
   * Handles modal close
   */
  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      difficultyLevel: '',
      illustrationUrl: '',
      videoUrl: '',
      voiceNarrationUrl: '',
      aiStory: '',
      orderIndex: defaultOrderIndex,
    });
    setFormErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size={{ base: 'full', md: 'xl' }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Subtopic{topicTitle ? ` for ${topicTitle}` : ''}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={{ base: 3, md: 4 }}>
            <FormControl isRequired isInvalid={!!formErrors.title}>
              <FormLabel>Title</FormLabel>
              <Input
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (formErrors.title) {
                    setFormErrors({ ...formErrors, title: undefined });
                  }
                }}
                placeholder="e.g., Basic Addition"
              />
              {formErrors.title && <Text fontSize="sm" color="red.500" mt={1}>{formErrors.title}</Text>}
            </FormControl>

            <FormControl isInvalid={!!formErrors.description}>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (formErrors.description) {
                    setFormErrors({ ...formErrors, description: undefined });
                  }
                }}
                placeholder="Brief description of the subtopic"
                rows={3}
              />
              {formErrors.description && (
                <Text fontSize="sm" color="red.500" mt={1}>{formErrors.description}</Text>
              )}
            </FormControl>

            <HStack spacing={4} w="100%">
              <FormControl isRequired isInvalid={!!formErrors.difficultyLevel} flex={1}>
                <FormLabel>Difficulty Level</FormLabel>
                <Select
                  value={formData.difficultyLevel}
                  onChange={(e) => {
                    setFormData({ ...formData, difficultyLevel: e.target.value });
                    if (formErrors.difficultyLevel) {
                      setFormErrors({ ...formErrors, difficultyLevel: undefined });
                    }
                  }}
                  placeholder="Select difficulty"
                >
                  {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
                {formErrors.difficultyLevel && (
                  <Text fontSize="sm" color="red.500" mt={1}>{formErrors.difficultyLevel}</Text>
                )}
              </FormControl>

              <FormControl flex={1}>
                <FormLabel>Order Index</FormLabel>
                <NumberInput
                  value={formData.orderIndex}
                  onChange={(_: string, value: number) =>
                    setFormData({ ...formData, orderIndex: isNaN(value) ? 0 : value })
                  }
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>Illustration URL</FormLabel>
              <Input
                value={formData.illustrationUrl}
                onChange={(e) => setFormData({ ...formData, illustrationUrl: e.target.value })}
                placeholder="https://example.com/illustration.jpg"
                type="url"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Video URL</FormLabel>
              <Input
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://example.com/video.mp4"
                type="url"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Voice Narration URL</FormLabel>
              <Input
                value={formData.voiceNarrationUrl}
                onChange={(e) =>
                  setFormData({ ...formData, voiceNarrationUrl: e.target.value })
                }
                placeholder="https://example.com/audio.mp3"
                type="url"
              />
            </FormControl>

            <FormControl>
              <FormLabel>AI Story</FormLabel>
              <Textarea
                value={formData.aiStory}
                onChange={(e) => setFormData({ ...formData, aiStory: e.target.value })}
                placeholder="AI-generated story content"
                rows={4}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter flexWrap="wrap">
          <Button
            variant="ghost"
            mr={3}
            onClick={handleClose}
            w={{ base: '100%', sm: 'auto' }}
            mb={{ base: 2, sm: 0 }}
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
            w={{ base: '100%', sm: 'auto' }}
          >
            Create Subtopic
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

