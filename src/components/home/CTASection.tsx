/**
 * Call-to-action section component
 */

import { motion } from 'framer-motion';
import { Box, VStack, Text, Button, Heading } from '@/shared/design-system';
import { APP_CONSTANTS } from '@/constants/app';

interface CTASectionProps {
  onGetStarted: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
    >
      <Box
        bg="rgba(255, 255, 255, 0.95)"
        backdropFilter="blur(10px)"
        borderRadius="2xl"
        p={12}
        textAlign="center"
        boxShadow="2xl"
      >
        <VStack spacing={6}>
          <Heading size="xl" color="purple.600">
            Ready to Level Up? 🚀
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="500px">
            Join thousands of students already crushing their goals with {APP_CONSTANTS.BRAND_NAME}
          </Text>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              colorScheme="purple"
              bg="purple.500"
              color="white"
              px={10}
              py={6}
              fontSize="lg"
              fontWeight="bold"
              borderRadius="full"
              onClick={onGetStarted}
              _hover={{
                bg: 'purple.600',
                transform: 'translateY(-2px)',
              }}
            >
              Start Learning Now! ✨
            </Button>
          </motion.div>
        </VStack>
      </Box>
    </motion.div>
  );
};

