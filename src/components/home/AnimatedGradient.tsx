/**
 * Animated gradient background component
 */

import { Box } from '@/shared/design-system';
import { motion } from 'framer-motion';

export const AnimatedGradient: React.FC = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      zIndex={-1}
      overflow="hidden"
    >
      <motion.div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
          backgroundSize: '400% 400%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <Box
        position="absolute"
        width="100%"
        height="100%"
        bg="rgba(0, 0, 0, 0.1)"
        backdropFilter="blur(10px)"
      />
    </Box>
  );
};

