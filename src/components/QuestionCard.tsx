/**
 * QuestionCard component displays a single quiz question with options
 */

import { Box, VStack, Text, Button, Card, CardBody } from '@/shared/design-system';
import { Question } from '@/types/quiz';

interface QuestionCardProps {
  question: Question;
  onAnswerSelect: (answer: 'A' | 'B' | 'C' | 'D') => void;
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
  showFeedback: boolean;
  isCorrect: boolean | null;
}

/**
 * Displays a quiz question with multiple choice options
 * @param question - The question object to display
 * @param onAnswerSelect - Callback when an answer is selected
 * @param selectedAnswer - Currently selected answer
 * @param showFeedback - Whether to show feedback after answering
 * @param isCorrect - Whether the selected answer is correct
 */
export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswerSelect,
  selectedAnswer,
  showFeedback,
  isCorrect,
}) => {
  const options = [
    { key: 'A' as const, value: question.options.A },
    { key: 'B' as const, value: question.options.B },
    { key: 'C' as const, value: question.options.C },
    { key: 'D' as const, value: question.options.D },
  ];

  return (
    <Card width="100%" maxWidth="800px" margin="0 auto">
      <CardBody p={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color="blue.600">
            Q{question.number}. {question.question}
          </Text>

          <VStack spacing={3} align="stretch">
            {options.map((option) => {
              const isSelected = selectedAnswer === option.key;
              const isCorrectOption = option.key === question.correctAnswer;
              let buttonColorScheme = 'gray';
              let variant: 'solid' | 'outline' = 'outline';

              if (showFeedback) {
                if (isCorrectOption) {
                  buttonColorScheme = 'green';
                  variant = 'solid';
                } else if (isSelected && !isCorrect) {
                  buttonColorScheme = 'red';
                  variant = 'solid';
                }
              } else if (isSelected) {
                buttonColorScheme = 'blue';
                variant = 'solid';
              }

              return (
                <Button
                  key={option.key}
                  onClick={() => onAnswerSelect(option.key)}
                  colorScheme={buttonColorScheme}
                  variant={variant}
                  size={{ base: 'md', md: 'lg' }}
                  justifyContent="flex-start"
                  textAlign="left"
                  height="auto"
                  paddingY={{ base: 3, md: 4 }}
                  whiteSpace="normal"
                  isDisabled={showFeedback}
                  w="100%"
                >
                  <Text fontWeight="bold" marginRight={2} fontSize={{ base: 'sm', md: 'md' }}>
                    {option.key})
                  </Text>
                  <Text flex={1} fontSize={{ base: 'sm', md: 'md' }}>{option.value}</Text>
                </Button>
              );
            })}
          </VStack>

          {showFeedback && (
            <Box
              padding={5}
              borderRadius="lg"
              bg={isCorrect ? 'green.50' : 'orange.50'}
              borderWidth={2}
              borderColor={isCorrect ? 'green.300' : 'orange.300'}
              boxShadow="sm"
            >
              <VStack spacing={3} align="stretch">
                <Text fontSize="lg" fontWeight="bold" color={isCorrect ? 'green.800' : 'orange.800'}>
                  {isCorrect ? '✅ Correct!' : `❌ Incorrect - Correct Answer: ${question.correctAnswer}`}
                </Text>
                <Box
                  padding={4}
                  bg="white"
                  borderRadius="md"
                  borderLeftWidth={4}
                  borderLeftColor={isCorrect ? 'green.500' : 'orange.500'}
                >
                  <Text fontSize="md" fontWeight="semibold" color="gray.700" marginBottom={2}>
                    📚 Detailed Explanation:
                  </Text>
                  <Text fontSize="md" color="gray.700" lineHeight="tall">
                    {question.explanation}
                  </Text>
                </Box>
                {!isCorrect && selectedAnswer && (
                  <Box padding={3} bg="red.50" borderRadius="md">
                    <Text fontSize="sm" color="red.700">
                      <Text as="span" fontWeight="bold">Your answer ({selectedAnswer})</Text> was incorrect. 
                      Review the explanation above to understand why {question.correctAnswer} is the correct choice.
                    </Text>
                  </Box>
                )}
              </VStack>
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

