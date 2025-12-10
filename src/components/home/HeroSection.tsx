/**
 * Hero section component for home page
 */

import { motion } from 'framer-motion';
import { VStack, HStack, Text, Button, Heading } from '@/shared/design-system';
import { APP_CONSTANTS } from '@/constants/app';

interface HeroSectionProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted,
  onLogin,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <VStack spacing={6} textAlign="center">
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
          <Heading
            size="4xl"
            bgGradient="linear(to-r, purple.400, pink.400, blue.400)"
            bgClip="text"
            fontWeight="extrabold"
            letterSpacing="tight"
          >
            {APP_CONSTANTS.BRAND_NAME}
          </Heading>
        </motion.div>

        <Text
          fontSize="2xl"
          color="white"
          fontWeight="bold"
          textShadow="2px 2px 4px rgba(0,0,0,0.3)"
        >
          Your AI-Powered Learning Companion 🤖✨
        </Text>

        <Text
          fontSize="lg"
          color="whiteAlpha.900"
          maxW="600px"
          textShadow="1px 1px 2px rgba(0,0,0,0.3)"
        >
          Level up your study game with personalized quizzes, smart tutoring, and epic learning
          adventures! No cap, this is the future of education 🎓
        </Text>

        <HStack spacing={4} pt={4}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              colorScheme="purple"
              bg="purple.500"
              color="white"
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="bold"
              borderRadius="full"
              boxShadow="xl"
              onClick={onGetStarted}
              _hover={{
                bg: 'purple.600',
                transform: 'translateY(-2px)',
                boxShadow: '2xl',
              }}
            >
              Get Started 🚀
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              variant="outline"
              borderColor="white"
              color="white"
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="bold"
              borderRadius="full"
              bg="rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(10px)"
              onClick={onLogin}
              _hover={{
                bg: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateY(-2px)',
              }}
            >
              Login 👋
            </Button>
          </motion.div>
        </HStack>
      </VStack>
    </motion.div>
  );
};

