/**
 * AllQuestionsView component displays all quiz questions at once for quick answering
 */

import { Box, VStack, Text, Button, Card, CardBody, HStack } from '@/shared/design-system';
import { Question } from '@/types/quiz';

interface AllQuestionsViewProps {
  questions: Question[];
  answers: Map<number, 'A' | 'B' | 'C' | 'D'>;
  onAnswerSelect: (questionNumber: number, answer: 'A' | 'B' | 'C' | 'D') => void;
}

/**
 * Displays all quiz questions at once for quick answering
 * @param questions - Array of all questions
 * @param answers - Map of question numbers to selected answers
 * @param onAnswerSelect - Callback when an answer is selected
 */
export const AllQuestionsView: React.FC<AllQuestionsViewProps> = ({
  questions,
  answers,
  onAnswerSelect,
}) => {
  return (
    <VStack spacing={6} width="100%" maxWidth="1000px" marginX="auto">
      {questions.map((question) => {
        const selectedAnswer = answers.get(question.number);
        const options = [
          { key: 'A' as const, value: question.options.A },
          { key: 'B' as const, value: question.options.B },
          { key: 'C' as const, value: question.options.C },
          { key: 'D' as const, value: question.options.D },
        ];

        return (
          <Card key={question.number} width="100%">
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Text fontSize="lg" fontWeight="bold" color="blue.600">
                  Q{question.number}. {question.question}
                </Text>

                <HStack spacing={2} flexWrap="wrap" w="100%">
                  {options.map((option) => {
                    const isSelected = selectedAnswer === option.key;
                    return (
                      <Button
                        key={option.key}
                        onClick={() => onAnswerSelect(question.number, option.key)}
                        colorScheme={isSelected ? 'blue' : 'gray'}
                        variant={isSelected ? 'solid' : 'outline'}
                        size={{ base: 'sm', md: 'md' }}
                        minWidth={{ base: '100%', sm: '120px' }}
                        flex={{ base: '1 1 100%', sm: '0 1 auto' }}
                        whiteSpace="normal"
                        height="auto"
                        py={2}
                      >
                        {option.key}) {option.value}
                      </Button>
                    );
                  })}
                </HStack>

                {selectedAnswer && (
                  <Box padding={2} borderRadius="md" bg="blue.50">
                    <Text fontSize="sm" color="blue.700">
                      Selected: {selectedAnswer}
                    </Text>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>
        );
      })}
    </VStack>
  );
};

