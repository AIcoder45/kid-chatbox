/**
 * Edit Question Modal Component
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
  VStack,
  HStack,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  Badge,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
} from '@/shared/design-system';
import { QuizQuestion } from '@/services/admin';

interface EditQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: QuizQuestion | null;
  onUpdate: (question: QuizQuestion) => void;
  loading: boolean;
}

export const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  isOpen,
  onClose,
  question,
  onUpdate,
  loading,
}) => {
  const [editedQuestion, setEditedQuestion] = React.useState<QuizQuestion | null>(question);

  React.useEffect(() => {
    setEditedQuestion(question);
  }, [question]);

  if (!editedQuestion) return null;

  const handleUpdate = () => {
    onUpdate(editedQuestion);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxW="90vw" maxH="90vh">
        <ModalHeader>Edit Question</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" maxH="calc(90vh - 140px)">
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Question Text</FormLabel>
              <Textarea
                value={editedQuestion.questionText || ''}
                onChange={(e) =>
                  setEditedQuestion({ ...editedQuestion, questionText: e.target.value })
                }
                rows={3}
                placeholder="Enter the question text here..."
              />
            </FormControl>

            {editedQuestion.options &&
              typeof editedQuestion.options === 'object' &&
              !Array.isArray(editedQuestion.options) &&
              editedQuestion.options !== null ? (
                <FormControl>
                  <FormLabel>Options</FormLabel>
                  <VStack spacing={2}>
                    {Object.entries(editedQuestion.options as Record<string, unknown>).map(
                      ([key, value]) => (
                        <HStack key={key} w="100%">
                          <Badge minW="40px" textAlign="center">
                            {String(key)}
                          </Badge>
                          <Input
                            value={typeof value === 'string' ? value : String(value || '')}
                            onChange={(e) => {
                              const newOptions = {
                                ...(editedQuestion.options as Record<string, unknown>),
                                [key]: e.target.value,
                              };
                              setEditedQuestion({ ...editedQuestion, options: newOptions });
                            }}
                          />
                        </HStack>
                      )
                    )}
                  </VStack>
                </FormControl>
              ) : null}

            <FormControl>
              <FormLabel>Correct Answer</FormLabel>
              <Input
                value={
                  Array.isArray(editedQuestion.correctAnswer)
                    ? editedQuestion.correctAnswer.join(', ')
                    : String(editedQuestion.correctAnswer)
                }
                onChange={(e) => {
                  const value = e.target.value;
                  const answer = value.includes(',')
                    ? value.split(',').map((v) => v.trim())
                    : value.trim();
                  setEditedQuestion({ ...editedQuestion, correctAnswer: answer });
                }}
                placeholder="A or A, B for multiple"
              />
              <Text fontSize="sm" color="gray.500" mt={1}>
                Enter option letter(s). Use comma for multiple correct answers.
              </Text>
            </FormControl>

            <FormControl>
              <FormLabel>Explanation</FormLabel>
              <Textarea
                value={editedQuestion.explanation || ''}
                onChange={(e) =>
                  setEditedQuestion({ ...editedQuestion, explanation: e.target.value })
                }
                rows={3}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Hint (Optional)</FormLabel>
              <Input
                value={editedQuestion.hint || ''}
                onChange={(e) =>
                  setEditedQuestion({ ...editedQuestion, hint: e.target.value })
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Points</FormLabel>
              <NumberInput
                value={editedQuestion.points}
                onChange={(_, value) =>
                  setEditedQuestion({ ...editedQuestion, points: value || 1 })
                }
                min={1}
                max={10}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleUpdate} isLoading={loading}>
            Update Question
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

