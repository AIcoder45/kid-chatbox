/**
 * Topic Form Component
 * Form for creating and editing topics with validation
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
} from '@/shared/design-system';
import {
  AGE_GROUP_LABELS,
  DIFFICULTY_LABELS,
  TOPIC_CATEGORIES,
  TOPIC_MESSAGES,
} from '@/constants/topics';

interface TopicFormData {
  title: string;
  description: string;
  ageGroup: string;
  difficultyLevel: string;
  category: string;
  thumbnailUrl: string;
}

interface TopicFormErrors {
  title?: string;
  ageGroup?: string;
  difficultyLevel?: string;
  description?: string;
}

interface TopicFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TopicFormData) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Validates topic form data
 * @param formData - Topic form data to validate
 * @returns Validation errors object
 */
const validateTopicForm = (formData: TopicFormData): TopicFormErrors => {
  const errors: TopicFormErrors = {};

  if (!formData.title.trim()) {
    errors.title = TOPIC_MESSAGES.VALIDATION_TITLE_REQUIRED;
  } else if (formData.title.trim().length < 3) {
    errors.title = TOPIC_MESSAGES.VALIDATION_TITLE_MIN_LENGTH;
  } else if (formData.title.length > 255) {
    errors.title = TOPIC_MESSAGES.VALIDATION_TITLE_MAX_LENGTH;
  }

  if (!formData.ageGroup) {
    errors.ageGroup = TOPIC_MESSAGES.VALIDATION_AGE_GROUP_REQUIRED;
  }

  if (!formData.difficultyLevel) {
    errors.difficultyLevel = TOPIC_MESSAGES.VALIDATION_DIFFICULTY_REQUIRED;
  }

  if (formData.description && formData.description.length > 1000) {
    errors.description = TOPIC_MESSAGES.VALIDATION_DESCRIPTION_MAX_LENGTH;
  }

  return errors;
};

/**
 * Topic Form Component
 * @param isOpen - Whether the modal is open
 * @param onClose - Callback to close the modal
 * @param onSubmit - Callback when form is submitted
 * @param isLoading - Whether the form is submitting
 */
export const TopicForm: React.FC<TopicFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<TopicFormData>({
    title: '',
    description: '',
    ageGroup: '',
    difficultyLevel: '',
    category: '',
    thumbnailUrl: '',
  });
  const [formErrors, setFormErrors] = useState<TopicFormErrors>({});

  /**
   * Handles form submission
   */
  const handleSubmit = async () => {
    const errors = validateTopicForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    await onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      ageGroup: '',
      difficultyLevel: '',
      category: '',
      thumbnailUrl: '',
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
      ageGroup: '',
      difficultyLevel: '',
      category: '',
      thumbnailUrl: '',
    });
    setFormErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size={{ base: 'full', md: 'lg' }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Topic</ModalHeader>
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
                placeholder="e.g., Introduction to Mathematics"
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
                placeholder="Brief description of the topic"
                rows={3}
              />
              {formErrors.description && (
                <Text fontSize="sm" color="red.500" mt={1}>{formErrors.description}</Text>
              )}
            </FormControl>

            <HStack spacing={4} w="100%">
              <FormControl isRequired isInvalid={!!formErrors.ageGroup}>
                <FormLabel>Age Group</FormLabel>
                <Select
                  value={formData.ageGroup}
                  onChange={(e) => {
                    setFormData({ ...formData, ageGroup: e.target.value });
                    if (formErrors.ageGroup) {
                      setFormErrors({ ...formErrors, ageGroup: undefined });
                    }
                  }}
                  placeholder="Select age group"
                >
                  {Object.entries(AGE_GROUP_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
                {formErrors.ageGroup && <Text fontSize="sm" color="red.500" mt={1}>{formErrors.ageGroup}</Text>}
              </FormControl>

              <FormControl isRequired isInvalid={!!formErrors.difficultyLevel}>
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
            </HStack>

            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Select category (optional)"
              >
                <option value="">None</option>
                {Object.values(TOPIC_CATEGORIES).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Thumbnail URL</FormLabel>
              <Input
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                type="url"
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
            Create Topic
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

