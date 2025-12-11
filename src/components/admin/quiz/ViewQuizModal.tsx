/**
 * View Quiz Modal Component
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
  Text,
  Heading,
  Button,
  Badge,
  Box,
  Card,
  CardBody,
} from '@/shared/design-system';
import { Quiz, QuizQuestion } from '@/services/admin';

interface ViewQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: { quiz: Quiz; questions: QuizQuestion[] } | null;
  onEditQuestion: (question: QuizQuestion) => void;
}

export const ViewQuizModal: React.FC<ViewQuizModalProps> = ({
  isOpen,
  onClose,
  quiz,
  onEditQuestion,
}) => {
  if (!quiz) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="90vh" maxW="90vw">
        <ModalHeader>
          <VStack align="start" spacing={1}>
            <Text fontSize="lg" fontWeight="bold">
              {quiz.quiz.name}
            </Text>
            <HStack spacing={4} flexWrap="wrap">
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                <Text as="span" fontWeight="bold">Age Group:</Text> {quiz.quiz.ageGroup || 'N/A'}
              </Text>
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                <Text as="span" fontWeight="bold">Questions:</Text> {quiz.quiz.numberOfQuestions || 0}
              </Text>
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                <Text as="span" fontWeight="bold">Status:</Text>{' '}
                <Badge colorScheme={quiz.quiz.isActive ? 'green' : 'red'} size="sm">
                  {quiz.quiz.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Text>
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                <Text as="span" fontWeight="bold">Time Limit:</Text>{' '}
                {quiz.quiz.timeLimit ? `${quiz.quiz.timeLimit} min` : 'No limit'}
              </Text>
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                <Text as="span" fontWeight="bold">Difficulty:</Text> {quiz.quiz.difficulty || 'N/A'}
              </Text>
            </HStack>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {quiz.quiz.description && (
              <Box>
                <Text fontWeight="bold" mb={2}>Description:</Text>
                <Text>{quiz.quiz.description}</Text>
              </Box>
            )}

            <Box>
              <HStack justify="space-between" mb={3}>
                <Heading size="sm">Questions ({quiz.questions.length})</Heading>
                <Text fontSize="sm" color="gray.500">
                  Passing: {quiz.quiz.passingPercentage}% | Time Limit: {quiz.quiz.timeLimit ? `${quiz.quiz.timeLimit} min` : 'No limit'}
                </Text>
              </HStack>

              <VStack spacing={4} align="stretch">
                {quiz.questions.map((question, index) => {
                  const options = question.options as Record<string, string> | undefined;
                  const correctAnswer = question.correctAnswer as string | string[] | undefined;

                  return (
                    <Card key={question.id} variant="outline" borderWidth="2px">
                      <CardBody>
                        <HStack justify="space-between" mb={3}>
                          <Text fontWeight="bold" color="blue.600" fontSize="lg">
                            Question {index + 1} of {quiz.questions.length}
                          </Text>
                          <HStack spacing={2}>
                            <Badge colorScheme="purple">{question.questionType}</Badge>
                            <Badge colorScheme="green">{question.points} pts</Badge>
                            <Button
                              size="xs"
                              colorScheme="blue"
                              variant="outline"
                              onClick={() => onEditQuestion(question)}
                            >
                              Edit
                            </Button>
                          </HStack>
                        </HStack>

                        <Text mb={4} fontSize="md" fontWeight="medium" color="gray.700">
                          {question.questionText && question.questionText.trim() !== '' 
                            ? question.questionText 
                            : 'No question text provided'}
                        </Text>

                        {question.questionImageUrl && (
                          <Box mb={3}>
                            <img
                              src={question.questionImageUrl}
                              alt="Question illustration"
                              style={{ maxWidth: '100%', borderRadius: '8px' }}
                            />
                          </Box>
                        )}

                        {options && Object.keys(options).length > 0 ? (
                          <Box mb={3}>
                            <Text fontWeight="bold" mb={2} fontSize="sm" color="gray.600">
                              Answer Options:
                            </Text>
                            <VStack align="stretch" spacing={2}>
                              {Object.entries(options).map(([key, value]) => {
                                const isCorrect = Array.isArray(correctAnswer)
                                  ? correctAnswer.includes(key)
                                  : String(correctAnswer).toUpperCase() === String(key).toUpperCase();
                                return (
                                  <HStack
                                    key={key}
                                    p={3}
                                    bg={isCorrect ? 'green.50' : 'gray.50'}
                                    borderRadius="md"
                                    border={isCorrect ? '2px solid' : '1px solid'}
                                    borderColor={isCorrect ? 'green.400' : 'gray.300'}
                                    _hover={{ bg: isCorrect ? 'green.100' : 'gray.100' }}
                                  >
                                    <Badge
                                      colorScheme={isCorrect ? 'green' : 'gray'}
                                      minW="40px"
                                      fontSize="sm"
                                      p={1}
                                    >
                                      {key}
                                    </Badge>
                                    <Text flex={1} fontSize="sm">
                                      {value}
                                    </Text>
                                    {isCorrect && (
                                      <Badge colorScheme="green" fontSize="xs">
                                        ✓ Correct Answer
                                      </Badge>
                                    )}
                                  </HStack>
                                );
                              })}
                            </VStack>
                            {correctAnswer && (
                              <Box mt={3} p={2} bg="green.50" borderRadius="md" border="1px solid" borderColor="green.300">
                                <Text fontSize="sm" fontWeight="bold" color="green.700" mb={1}>
                                  Correct Answer:
                                </Text>
                                <Text fontSize="sm" fontWeight="medium" color="green.800">
                                  {Array.isArray(correctAnswer)
                                    ? correctAnswer.map((ans) => {
                                        const ansStr = String(ans).toUpperCase();
                                        const optionText = options[ansStr] || options[ans] || options[String(ans)] || ans;
                                        return `${ansStr}: ${optionText}`;
                                      }).join(' | ')
                                    : (() => {
                                        const ansStr = String(correctAnswer).toUpperCase();
                                        const optionText = options[ansStr] || options[correctAnswer as string] || String(correctAnswer);
                                        return `${ansStr}: ${optionText}`;
                                      })()}
                                </Text>
                              </Box>
                            )}
                          </Box>
                        ) : (
                          correctAnswer && (
                            <Box mb={3} p={3} bg="green.50" borderRadius="md" border="2px solid" borderColor="green.400">
                              <Text fontWeight="bold" mb={2} fontSize="sm" color="green.700">
                                Correct Answer:
                              </Text>
                              <Text fontSize="md" fontWeight="bold" color="green.800">
                                {Array.isArray(correctAnswer)
                                  ? correctAnswer.join(', ')
                                  : String(correctAnswer)}
                              </Text>
                            </Box>
                          )
                        )}

                        {question.explanation && (
                          <Box mt={3} p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
                            <Text fontSize="sm" fontWeight="bold" mb={2} color="blue.700">
                              Explanation:
                            </Text>
                            <Text fontSize="sm" color="blue.800">
                              {question.explanation}
                            </Text>
                          </Box>
                        )}

                        {question.hint && (
                          <Box mt={2} p={2} bg="yellow.50" borderRadius="md" border="1px solid" borderColor="yellow.200">
                            <Text fontSize="sm" fontWeight="bold" mb={1} color="yellow.700">
                              Hint:
                            </Text>
                            <Text fontSize="sm" color="yellow.800">
                              {question.hint}
                            </Text>
                          </Box>
                        )}
                      </CardBody>
                    </Card>
                  );
                })}
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

