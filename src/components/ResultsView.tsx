/**
 * ResultsView component displays quiz results with all answers and explanations
 */

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
      <Card width="100%">
        <CardBody>
          <VStack spacing={4}>
            <Heading size="lg" color="blue.600">
              {MESSAGES.QUIZ_COMPLETED}
            </Heading>

            <Text fontSize="xl" fontWeight="bold">
              {MESSAGES.SCORE_MESSAGE} {score} out of {totalQuestions} questions correctly.
            </Text>

            <Text fontSize="md" color="gray.600">
              ⏱️ Time Taken: {formatTime(timeTaken)}
            </Text>

            <Progress
              value={percentage}
              colorScheme={percentage >= 70 ? 'green' : percentage >= 50 ? 'yellow' : 'orange'}
              size="lg"
              width="100%"
              borderRadius="md"
            />

            <Text fontSize="md" color="gray.600">
              {MESSAGES.MOTIVATIONAL}
            </Text>
          </VStack>
        </CardBody>
      </Card>

      <Card width="100%">
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Heading size="md" color="blue.600">
              Review All Answers:
            </Heading>

            {allAnswerResults.map((result) => {
              const bgColor = result.isCorrect ? 'green.50' : 'orange.50';
              const borderColor = result.isCorrect ? 'green.200' : 'orange.200';
              const statusIcon = result.isCorrect ? '✅' : '❌';

              return (
                <Box
                  key={result.questionNumber}
                  padding={4}
                  borderRadius="md"
                  bg={bgColor}
                  borderWidth={1}
                  borderColor={borderColor}
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
              );
            })}
          </VStack>
        </CardBody>
      </Card>

      {improvementTips.length > 0 && (
        <Card width="100%">
          <CardBody>
            <VStack spacing={3} align="stretch">
              <Heading size="md" color="blue.600">
                Tips to Improve:
              </Heading>
              {improvementTips.map((tip, index) => (
                <Alert key={index} status="info" borderRadius="md">
                  <AlertIcon />
                  <AlertDescription>{tip}</AlertDescription>
                </Alert>
              ))}
            </VStack>
          </CardBody>
        </Card>
      )}

      {resultSaved && (
        <Alert status="success" borderRadius="md">
          <AlertIcon />
          <Text fontSize="md">{APP_MESSAGES.QUIZ_SAVED}</Text>
        </Alert>
      )}

      <VStack spacing={3} width="100%">
        <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="semibold">
          {MESSAGES.ANOTHER_QUIZ}
        </Text>
        <Box display="flex" gap={4} flexWrap="wrap" justifyContent="center" w="100%">
          <Button
            colorScheme="blue"
            size={{ base: 'md', md: 'lg' }}
            onClick={onRetrySameTopic}
            w={{ base: '100%', sm: 'auto' }}
          >
            Try Same Topic Again
          </Button>
          <Button
            colorScheme="green"
            size={{ base: 'md', md: 'lg' }}
            onClick={onStartNewQuiz}
            w={{ base: '100%', sm: 'auto' }}
          >
            Try Different Topic
          </Button>
          <Button
            colorScheme="gray"
            size={{ base: 'md', md: 'lg' }}
            onClick={onBackToDashboard}
            w={{ base: '100%', sm: 'auto' }}
          >
            Back to Dashboard
          </Button>
        </Box>
        {resultSaved && (
          <Text fontSize="sm" color="gray.600" textAlign="center" marginTop={2}>
            💡 Tip: You can view all your quiz history anytime from the menu or dashboard!
          </Text>
        )}
      </VStack>
    </VStack>
  );
};
