/**
 * QuizLibrary component - Displays available quizzes from the library
 * Shows on the right side of the AI Quiz Mode page
 */

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  VStack,
  Text,
  Heading,
  Card,
  CardBody,
  Badge,
  HStack,
  Button,
  Spinner,
} from '@/shared/design-system';
import { quizLibraryApi } from '@/services/api';
import { Question } from '@/types/quiz';

interface QuizLibraryItem {
  id: string;
  title: string;
  description?: string;
  subject: string;
  subtopics: string[];
  difficulty: string;
  age_group?: number;
  language?: string;
  question_count: number;
  time_limit?: number;
  grade_level?: string;
  exam_style?: string;
  tags: string[];
  usage_count: number;
}

interface QuizLibraryProps {
  selectedSubject?: string;
  onQuizSelect: (quiz: { questions: Question[]; config: unknown }) => void;
}

/**
 * Quiz Library component that displays available quizzes
 * @param selectedSubject - Currently selected subject for filtering
 * @param onQuizSelect - Callback when a quiz is selected
 */
export const QuizLibrary: React.FC<QuizLibraryProps> = ({
  selectedSubject,
  onQuizSelect,
}) => {
  const [quizzes, setQuizzes] = useState<QuizLibraryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<QuizLibraryItem[]>([]);

  /**
   * Load all quizzes from library
   */
  const loadQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await quizLibraryApi.getQuizzes({
        limit: 20,
        offset: 0,
      });
      setQuizzes(response.quizzes as QuizLibraryItem[]);
    } catch (err) {
      console.error('Failed to load quiz library:', err);
      setError('Failed to load quiz library');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load suggestions based on selected subject
   */
  const loadSuggestions = useCallback(async () => {
    if (!selectedSubject) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await quizLibraryApi.getSuggestions({
        subject: selectedSubject,
      });
      setSuggestions(response.suggestions as QuizLibraryItem[]);
    } catch (err) {
      console.error('Failed to load suggestions:', err);
    }
  }, [selectedSubject]);

  /**
   * Handle quiz selection
   */
  const handleQuizSelect = useCallback(async (quizId: string) => {
    try {
      const response = await quizLibraryApi.getQuizById(quizId);
      const quiz = response.quiz as QuizLibraryItem & { questions: Question[] };
      
      // Convert library quiz to QuizConfig format
      const config = {
        subject: quiz.subject,
        subtopics: quiz.subtopics,
        questionCount: quiz.question_count,
        difficulty: quiz.difficulty,
        age: quiz.age_group || 8,
        language: quiz.language || 'English',
        timeLimit: quiz.time_limit,
        gradeLevel: quiz.grade_level,
        examStyle: quiz.exam_style,
      };

      onQuizSelect({
        questions: quiz.questions,
        config,
      });
    } catch (err) {
      console.error('Failed to load quiz:', err);
      setError('Failed to load quiz');
    }
  }, [onQuizSelect]);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  useEffect(() => {
    loadSuggestions();
  }, [loadSuggestions]);

  const displayQuizzes = selectedSubject && suggestions.length > 0 ? suggestions : quizzes;

  return (
    <Box
      position="sticky"
      top="80px"
      maxHeight="calc(100vh - 100px)"
      overflowY="auto"
      padding={4}
      bg="white"
      borderRadius="xl"
      boxShadow="lg"
      borderWidth={1}
      borderColor="gray.200"
    >
      <VStack spacing={4} align="stretch">
        <Heading size="md" color="blue.600">
          📚 Quiz Library
        </Heading>

        {selectedSubject && suggestions.length > 0 && (
          <Box padding={3} bg="blue.50" borderRadius="md" borderWidth={1} borderColor="blue.200">
            <Text fontSize="sm" fontWeight="semibold" color="blue.800" marginBottom={2}>
              💡 Suggested for {selectedSubject}:
            </Text>
          </Box>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" padding={8}>
            <Spinner size="lg" color="blue.500" />
          </Box>
        ) : error ? (
          <Box padding={4} bg="red.50" borderRadius="md">
            <Text fontSize="sm" color="red.600">{error}</Text>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              marginTop={2}
              onClick={loadQuizzes}
            >
              Retry
            </Button>
          </Box>
        ) : displayQuizzes.length === 0 ? (
          <Box padding={4} textAlign="center">
            <Text fontSize="sm" color="gray.600">
              No quizzes available yet. Generate a quiz to add it to the library!
            </Text>
          </Box>
        ) : (
          <VStack spacing={3} align="stretch">
            {displayQuizzes.map((quiz) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  cursor="pointer"
                  onClick={() => handleQuizSelect(quiz.id)}
                  _hover={{ boxShadow: 'md', borderColor: 'blue.300' }}
                  borderWidth={2}
                  borderColor="transparent"
                  transition="all 0.2s"
                >
                  <CardBody padding={3}>
                    <VStack spacing={2} align="stretch">
                      <Heading size="sm" color="blue.700">
                        {quiz.title}
                      </Heading>
                      
                      {quiz.description && (
                        <Text fontSize="xs" color="gray.600" noOfLines={2}>
                          {quiz.description}
                        </Text>
                      )}

                      <HStack spacing={2} flexWrap="wrap">
                        <Badge colorScheme="blue" fontSize="xs">
                          {quiz.subject}
                        </Badge>
                        <Badge colorScheme="purple" fontSize="xs">
                          {quiz.difficulty}
                        </Badge>
                        {quiz.question_count && (
                          <Badge colorScheme="green" fontSize="xs">
                            {quiz.question_count} Q
                          </Badge>
                        )}
                        {quiz.time_limit && (
                          <Badge colorScheme="orange" fontSize="xs">
                            {quiz.time_limit}m
                          </Badge>
                        )}
                      </HStack>

                      {quiz.subtopics && quiz.subtopics.length > 0 && (
                        <Text fontSize="xs" color="gray.500">
                          Topics: {quiz.subtopics.slice(0, 2).join(', ')}
                          {quiz.subtopics.length > 2 && '...'}
                        </Text>
                      )}

                      {quiz.usage_count > 0 && (
                        <Text fontSize="xs" color="gray.500">
                          👥 Used {quiz.usage_count} times
                        </Text>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

