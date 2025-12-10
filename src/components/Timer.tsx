/**
 * Timer component displays countdown timer for the quiz
 */

import { Box, Text, Progress, VStack } from '@/shared/design-system';

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
}

/**
 * Displays a countdown timer with visual progress
 * @param timeRemaining - Remaining time in seconds
 * @param totalTime - Total time in seconds
 */
export const Timer: React.FC<TimerProps> = ({ timeRemaining, totalTime }) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progress = (timeRemaining / totalTime) * 100;
  const isWarning = timeRemaining <= 30;
  const isCritical = timeRemaining <= 10;

  const formatTime = (): string => {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      padding={4}
      borderRadius="md"
      bg={isCritical ? 'red.50' : isWarning ? 'orange.50' : 'blue.50'}
      borderWidth={2}
      borderColor={isCritical ? 'red.300' : isWarning ? 'orange.300' : 'blue.300'}
      width="100%"
      maxWidth="400px"
      marginX="auto"
    >
      <VStack spacing={2}>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color={isCritical ? 'red.600' : isWarning ? 'orange.600' : 'blue.600'}
          textAlign="center"
        >
          ⏱️ {formatTime()}
        </Text>
        <Progress
          value={progress}
          colorScheme={isCritical ? 'red' : isWarning ? 'orange' : 'blue'}
          size="sm"
          width="100%"
          borderRadius="md"
        />
      </VStack>
    </Box>
  );
};

