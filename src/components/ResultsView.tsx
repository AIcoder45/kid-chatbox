/**
 * ResultsView component displays quiz results with all answers and explanations
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  VStack,
  Text,
  Heading,
  Card,
  CardBody,
  Button,
  Progress,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@/shared/design-system';
import { AnswerResult, QuizConfig } from '@/types/quiz';
import { MESSAGES } from '@/constants/quiz';
import { MESSAGES as APP_MESSAGES } from '@/constants/app';

interface ResultsViewProps {
  score: number;
  totalQuestions: number;
  allAnswerResults: AnswerResult[];
  config: QuizConfig;
  improvementTips: string[];
  resultSaved: boolean;
  timeTaken: number; // Time taken in seconds
  onStartNewQuiz: () => void;
  onRetrySameTopic: () => void;
  onBackToDashboard: () => void;
}

/**
 * Displays quiz results with score, all answers with explanations, and improvement tips
 * @param score - Number of correct answers
 * @param totalQuestions - Total number of questions
 * @param allAnswerResults - Array of all answers with results
 * @param config - Quiz configuration
 * @param improvementTips - Tips for improvement
 * @param onStartNewQuiz - Callback to start a new quiz
 * @param onRetrySameTopic - Callback to retry the same topic
 */
export const ResultsView: React.FC<ResultsViewProps> = ({
  score,
  totalQuestions,
  allAnswerResults,
  config: _config,
  improvementTips,
  resultSaved,
  timeTaken,
  onStartNewQuiz,
  onRetrySameTopic,
  onBackToDashboard,
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  // Format time taken
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <VStack spacing={6} width="100%" maxWidth="900px" margin="0 auto">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ width: '100%' }}
      >
        <Card width="100%" boxShadow="xl" borderRadius="xl">
          <CardBody>
            <VStack spacing={4}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Heading size="lg" color="blue.600" textAlign="center">
                  {MESSAGES.QUIZ_COMPLETED}
                </Heading>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Text fontSize="xl" fontWeight="bold" textAlign="center">
                  {MESSAGES.SCORE_MESSAGE} {score} out of {totalQuestions} questions correctly.
                </Text>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Text fontSize="md" color="gray.600" textAlign="center">
                  ⏱️ Time Taken: {formatTime(timeTaken)}
                </Text>
              </motion.div>

              <Box width="100%">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                  style={{ transformOrigin: 'left' }}
                >
                  <Progress
                    value={percentage}
                    colorScheme={percentage >= 70 ? 'green' : percentage >= 50 ? 'yellow' : 'orange'}
                    size="lg"
                    width="100%"
                    borderRadius="full"
                  />
                </motion.div>
              </Box>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Text fontSize="md" color="gray.600" textAlign="center">
                  {MESSAGES.MOTIVATIONAL}
                </Text>
              </motion.div>
            </VStack>
          </CardBody>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Card width="100%" boxShadow="lg" borderRadius="xl">
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Heading size="md" color="blue.600">
                Review All Answers:
              </Heading>

              <AnimatePresence>
                {allAnswerResults.map((result, index) => {
              const bgColor = result.isCorrect ? 'green.50' : 'orange.50';
              const borderColor = result.isCorrect ? 'green.200' : 'orange.200';
              const statusIcon = result.isCorrect ? '✅' : '❌';

                  return (
                    <motion.div
                      key={result.questionNumber}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <Box
                        padding={4}
                        borderRadius="xl"
                        bg={bgColor}
                        borderWidth={2}
                        borderColor={borderColor}
                        boxShadow="md"
                        _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
                        transition="all 0.2s"
                      >
                  <VStack align="stretch" spacing={2}>
                    <Text fontWeight="bold" fontSize="md">
                      {statusIcon} Q{result.questionNumber}: {result.question}
                    </Text>
                    <Text fontSize="sm" color="gray.700">
                      Your answer:{' '}
                      {result.childAnswer ? (
                        <Text as="span" fontWeight="semibold">
                          {result.childAnswer}
                          {result.options && `: ${result.options[result.childAnswer]}`}
                        </Text>
                      ) : (
                        <Text as="span" fontStyle="italic" color="red.600">
                          Not answered
                        </Text>
                      )}
                    </Text>
                    <Text fontSize="sm" color="green.700" fontWeight="semibold">
                      Correct answer: {result.correctAnswer}
                      {result.options && `: ${result.options[result.correctAnswer]}`}
                    </Text>
                    {result.options && (
                      <Box marginTop={2} padding={4} bg="gray.50" borderRadius="md">
                        <Text fontSize="sm" fontWeight="semibold" marginBottom={2} color="gray.700">
                          All Options:
                        </Text>
                        <VStack align="stretch" spacing={2}>
                          {Object.entries(result.options).map(([key, value]) => {
                            const isCorrect = key === result.correctAnswer;
                            const isSelected = key === result.childAnswer;
                            return (
                              <Box
                                key={key}
                                padding={2}
                                borderRadius="sm"
                                bg={isCorrect ? 'green.100' : isSelected && !result.isCorrect ? 'red.100' : 'white'}
                                borderWidth={isCorrect ? 2 : 0}
                                borderColor={isCorrect ? 'green.400' : 'transparent'}
                              >
                                <Text fontSize="sm" color="gray.700">
                                  <Text as="span" fontWeight="bold" color={isCorrect ? 'green.700' : 'gray.700'}>
                                    {key}:
                                  </Text>{' '}
                                  {value}
                                  {isCorrect && <Text as="span" color="green.600" ml={2}>✓ Correct</Text>}
                                  {isSelected && !result.isCorrect && (
                                    <Text as="span" color="red.600" ml={2}>✗ Your Answer</Text>
                                  )}
                                </Text>
                              </Box>
                            );
                          })}
                        </VStack>
                      </Box>
                    )}
                    <Box
                      marginTop={3}
                      padding={4}
                      bg="blue.50"
                      borderRadius="md"
                      borderLeftWidth={4}
                      borderLeftColor="blue.500"
                    >
                      <Text fontSize="sm" fontWeight="bold" color="blue.800" marginBottom={2}>
                        📚 Detailed Explanation:
                      </Text>
                      <Text fontSize="sm" color="gray.700" lineHeight="tall">
                        {result.explanation}
                      </Text>
                      </Box>
                    </VStack>
                  </Box>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </VStack>
          </CardBody>
        </Card>
      </motion.div>

      <AnimatePresence>
        {improvementTips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            style={{ width: '100%' }}
          >
            <Card width="100%" boxShadow="lg" borderRadius="xl">
              <CardBody>
                <VStack spacing={3} align="stretch">
                  <Heading size="md" color="blue.600">
                    Tips to Improve:
                  </Heading>
                  {improvementTips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                    >
                      <Alert status="info" borderRadius="xl" boxShadow="sm">
                        <AlertIcon />
                        <AlertDescription>{tip}</AlertDescription>
                      </Alert>
                    </motion.div>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {resultSaved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
            style={{ width: '100%' }}
          >
            <Alert status="success" borderRadius="xl" boxShadow="md">
              <AlertIcon />
              <Text fontSize="md" fontWeight="semibold">{APP_MESSAGES.QUIZ_SAVED}</Text>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <VStack spacing={3} width="100%">
          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="semibold" textAlign="center">
            {MESSAGES.ANOTHER_QUIZ}
          </Text>
          <Box display="flex" gap={4} flexWrap="wrap" justifyContent="center" w="100%">
            {[
              { label: 'Try Same Topic Again', onClick: onRetrySameTopic, colorScheme: 'blue' as const, delay: 1.7 },
              { label: 'Try Different Topic', onClick: onStartNewQuiz, colorScheme: 'green' as const, delay: 1.8 },
              { label: 'Back to Dashboard', onClick: onBackToDashboard, colorScheme: 'gray' as const, delay: 1.9 },
            ].map((button) => (
              <motion.div
                key={button.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: button.delay }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  colorScheme={button.colorScheme}
                  size={{ base: 'md', md: 'lg' }}
                  onClick={button.onClick}
                  w={{ base: '100%', sm: 'auto' }}
                  boxShadow="md"
                  _hover={{ boxShadow: 'lg' }}
                >
                  {button.label}
                </Button>
              </motion.div>
            ))}
          </Box>
          {resultSaved && (
            <Text fontSize="sm" color="gray.600" textAlign="center" marginTop={2}>
              💡 Tip: You can view all your quiz history anytime from the menu or dashboard!
            </Text>
          )}
        </VStack>
      </motion.div>
    </VStack>
  );
};
