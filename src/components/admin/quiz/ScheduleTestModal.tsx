/**
 * Schedule Test Modal Component
 */

import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  CheckboxGroup,
  Checkbox,
  Text,
} from '@/shared/design-system';
import { Quiz } from '@/services/admin';

interface ScheduleTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    quizId: string;
    scheduledFor: string;
    visibleFrom: string;
    visibleUntil: string;
    durationMinutes: string;
    planIds: string[];
    userIds: string[];
    instructions: string;
  }) => Promise<void>;
  quizzes: Quiz[];
  plans: Array<{ id: string; name: string }>;
  formData: {
    quizId: string;
    scheduledFor: string;
    visibleFrom: string;
    visibleUntil: string;
    durationMinutes: string;
    planIds: string[];
    userIds: string[];
    instructions: string;
  };
  setFormData: (data: any) => void;
  isEditing: boolean;
  loading: boolean;
}

export const ScheduleTestModal: React.FC<ScheduleTestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  quizzes,
  plans,
  formData,
  setFormData,
  isEditing,
  loading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditing ? 'Edit Scheduled Test' : 'Schedule Test'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired isDisabled={isEditing}>
              <FormLabel>Quiz</FormLabel>
              <Select
                value={formData.quizId}
                onChange={(e) => setFormData({ ...formData, quizId: e.target.value })}
                placeholder="Select quiz"
                isDisabled={isEditing}
              >
                {quizzes
                  .filter((q) => q.isActive)
                  .map((quiz) => (
                    <option key={quiz.id} value={quiz.id}>
                      {quiz.name}
                    </option>
                  ))}
              </Select>
              {isEditing && (
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Quiz cannot be changed when editing
                </Text>
              )}
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Scheduled For</FormLabel>
              <Input
                type="datetime-local"
                value={formData.scheduledFor}
                onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
              />
              <Text fontSize="sm" color="gray.500" mt={1}>
                When the test should be scheduled
              </Text>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Visible From</FormLabel>
              <Input
                type="datetime-local"
                value={formData.visibleFrom}
                onChange={(e) => setFormData({ ...formData, visibleFrom: e.target.value })}
              />
              <Text fontSize="sm" color="gray.500" mt={1}>
                When the exam will become visible to students
              </Text>
            </FormControl>

            <HStack>
              <FormControl>
                <FormLabel>Visible Until</FormLabel>
                <Input
                  type="datetime-local"
                  value={formData.visibleUntil}
                  onChange={(e) => setFormData({ ...formData, visibleUntil: e.target.value })}
                />
                <Text fontSize="sm" color="gray.500" mt={1}>
                  When the exam will no longer be visible (optional)
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel>Duration (minutes)</FormLabel>
                <Input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                  placeholder="60"
                />
                <Text fontSize="sm" color="gray.500" mt={1}>
                  How long the exam will be visible (optional)
                </Text>
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>Select Plans</FormLabel>
              <CheckboxGroup
                value={formData.planIds}
                onChange={(values) => setFormData({ ...formData, planIds: values as string[] })}
              >
                <VStack align="start" spacing={2}>
                  {plans.map((plan) => (
                    <Checkbox key={plan.id} value={plan.id}>
                      {plan.name}
                    </Checkbox>
                  ))}
                </VStack>
              </CheckboxGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Instructions</FormLabel>
              <Textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="Optional instructions for students"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={() => onSubmit(formData)} isLoading={loading}>
            {isEditing ? 'Update Test' : 'Schedule Test'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

