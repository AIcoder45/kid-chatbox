/**
 * Hero image section component
 */

import { motion } from 'framer-motion';
import { Box, Text } from '@/shared/design-system';

export const HeroImage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <Box display="flex" justifyContent="center" alignItems="center" py={8}>
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Box
            width="300px"
            height="300px"
            borderRadius="full"
            bg="rgba(255, 255, 255, 0.2)"
            backdropFilter="blur(10px)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="2xl"
            border="4px solid rgba(255, 255, 255, 0.3)"
          >
            <Text fontSize="8xl">🤖</Text>
          </Box>
        </motion.div>
      </Box>
    </motion.div>
  );
};

