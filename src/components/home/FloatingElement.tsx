/**
 * Floating animated element component
 */

import { motion } from 'framer-motion';

interface FloatingElementProps {
  delay: number;
  emoji: string;
  top: string;
  left: string;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  delay,
  emoji,
  top,
  left,
}) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top,
        left,
        fontSize: '3rem',
        pointerEvents: 'none',
      }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {emoji}
    </motion.div>
  );
};

