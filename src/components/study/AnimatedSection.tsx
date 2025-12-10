/**
 * Animated section component for study mode content
 */

import { motion } from 'framer-motion';
import { VStack, Heading, Box } from '@/shared/design-system';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  title: string;
  children: ReactNode;
  delay?: number;
  titleColor?: string;
  borderColor?: string;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  title,
  children,
  delay = 0,
  titleColor = 'blue.600',
  borderColor = 'blue.200',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <VStack spacing={4} align="stretch">
        <Heading
          size="md"
          color={titleColor}
          borderBottomWidth={2}
          borderBottomColor={borderColor}
          paddingBottom={2}
          position="relative"
        >
          {title}
          <motion.div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '2px',
            }}
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            <Box width="60px" height="2px" bg={titleColor} />
          </motion.div>
        </Heading>
        <Box>{children}</Box>
      </VStack>
    </motion.div>
  );
};

