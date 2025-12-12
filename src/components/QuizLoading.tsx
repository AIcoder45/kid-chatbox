/**
 * QuizLoading component - Enhanced loading state with cycling status messages
 * Displays engaging animations and status updates during question generation
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  VStack,
  Text,
  Spinner,
  HStack,
} from '@/shared/design-system';

interface QuizLoadingProps {
  loadingType?: 'generating' | 'loading-test' | 'loading-results';
}

interface LoadingStatus {
  icon: string;
  message: string;
  subMessage?: string;
}

/**
 * Enhanced loading component with cycling status messages
 * @param loadingType - Type of loading operation
 */
export const QuizLoading: React.FC<QuizLoadingProps> = ({
  loadingType = 'generating',
}) => {
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

  // Different status messages based on loading type
  const statusMessages: Record<string, LoadingStatus[]> = {
    generating: [
      { icon: '🧠', message: 'Getting questions...', subMessage: 'Analyzing your preferences' },
      { icon: '📚', message: 'Preparing content...', subMessage: 'Selecting the best topics' },
      { icon: '✨', message: 'Selecting the best questions...', subMessage: 'Curating for your level' },
      { icon: '🎯', message: 'Arranging options...', subMessage: 'Organizing answer choices' },
      { icon: '🔍', message: 'Reviewing questions...', subMessage: 'Ensuring quality' },
      { icon: '🚀', message: 'Almost ready...', subMessage: 'Finalizing your quiz' },
    ],
    'loading-test': [
      { icon: '📋', message: 'Loading your scheduled test...', subMessage: 'Fetching test details' },
      { icon: '⏳', message: 'Preparing questions...', subMessage: 'Getting everything ready' },
    ],
    'loading-results': [
      { icon: '🔍', message: 'Checking your answers...', subMessage: 'Be patient... Thanks for putting efforts' },
      { icon: '📊', message: 'Calculating results...', subMessage: 'Processing your answers' },
      { icon: '💡', message: 'Generating improvement tips...', subMessage: 'Creating personalized feedback' },
      { icon: '✅', message: 'Finalizing...', subMessage: 'Almost done!' },
    ],
  };

  const messages = statusMessages[loadingType] || statusMessages.generating;

  // Cycle through status messages every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatusIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [messages.length]);

  const currentStatus = messages[currentStatusIndex];

  return (
    <Box
      padding={{ base: 4, md: 6 }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="400px"
      width="100%"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '500px' }}
      >
        <VStack spacing={8} align="center">
          {/* Animated Icon and Spinner */}
          <VStack spacing={4}>
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Text fontSize="6xl" role="img" aria-label="Loading icon">
                {currentStatus.icon}
              </Text>
            </motion.div>

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Spinner size="xl" color="blue.500" thickness="4px" />
            </motion.div>
          </VStack>

          {/* Status Messages */}
          <VStack spacing={3} align="center" width="100%">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStatusIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%' }}
              >
                <VStack spacing={2} align="center">
                  <Text
                    fontSize={{ base: 'lg', md: 'xl' }}
                    fontWeight="bold"
                    textAlign="center"
                    color="blue.600"
                  >
                    {currentStatus.message}
                  </Text>
                  {currentStatus.subMessage && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Text
                        fontSize={{ base: 'sm', md: 'md' }}
                        color="gray.600"
                        textAlign="center"
                        fontStyle="italic"
                      >
                        {currentStatus.subMessage}
                      </Text>
                    </motion.div>
                  )}
                </VStack>
              </motion.div>
            </AnimatePresence>

            {/* Progress Dots */}
            <HStack spacing={2} marginTop={4}>
              {messages.map((_, index) => (
                <motion.div
                  key={index}
                  animate={{
                    scale: currentStatusIndex === index ? [1, 1.2, 1] : 1,
                    opacity: currentStatusIndex === index ? 1 : 0.4,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: currentStatusIndex === index ? Infinity : 0,
                    repeatDelay: 0.5,
                  }}
                >
                  <Box
                    width={currentStatusIndex === index ? '12px' : '8px'}
                    height={currentStatusIndex === index ? '12px' : '8px'}
                    borderRadius="full"
                    bg={currentStatusIndex === index ? 'blue.500' : 'gray.300'}
                  />
                </motion.div>
              ))}
            </HStack>
          </VStack>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Please wait while we prepare something amazing for you... ✨
            </Text>
          </motion.div>
        </VStack>
      </motion.div>
    </Box>
  );
};

