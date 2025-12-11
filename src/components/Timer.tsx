/**
 * Timer component displays countdown timer for the quiz
 */

import { motion } from 'framer-motion';
import { Box, Text, Progress, VStack } from '@/shared/design-system';
import { useEffect, useState } from 'react';

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
  const [pulse, setPulse] = useState(false);

  const formatTime = (): string => {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Pulse animation when time is critical
  useEffect(() => {
    if (isCritical) {
      const interval = setInterval(() => {
        setPulse((prev) => !prev);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setPulse(false);
    }
  }, [isCritical]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
      style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}
    >
      <motion.div
        animate={
          isCritical
            ? {
                scale: pulse ? [1, 1.05, 1] : 1,
                boxShadow: pulse
                  ? ['0 0 0px rgba(239, 68, 68, 0.4)', '0 0 20px rgba(239, 68, 68, 0.6)', '0 0 0px rgba(239, 68, 68, 0.4)']
                  : '0 0 0px rgba(239, 68, 68, 0.4)',
              }
            : isWarning
              ? { scale: 1 }
              : { scale: 1 }
        }
        transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0 }}
      >
        <Box
          padding={4}
          borderRadius="xl"
          bg={isCritical ? 'red.50' : isWarning ? 'orange.50' : 'blue.50'}
          borderWidth={3}
          borderColor={isCritical ? 'red.400' : isWarning ? 'orange.400' : 'blue.400'}
          width="100%"
          boxShadow="lg"
        >
          <VStack spacing={3}>
            <motion.div
              key={`${minutes}-${seconds}`}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Text
                fontSize="3xl"
                fontWeight="bold"
                color={isCritical ? 'red.600' : isWarning ? 'orange.600' : 'blue.600'}
                textAlign="center"
              >
                ⏱️ {formatTime()}
              </Text>
            </motion.div>
            <Box width="100%">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ transformOrigin: 'left' }}
              >
                <Progress
                  value={progress}
                  colorScheme={isCritical ? 'red' : isWarning ? 'orange' : 'blue'}
                  size="md"
                  width="100%"
                  borderRadius="full"
                  bg={isCritical ? 'red.100' : isWarning ? 'orange.100' : 'blue.100'}
                />
              </motion.div>
            </Box>
            {isCritical && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Text fontSize="sm" color="red.600" fontWeight="semibold">
                  ⚠️ Time running out!
                </Text>
              </motion.div>
            )}
          </VStack>
        </Box>
      </motion.div>
    </motion.div>
  );
};

