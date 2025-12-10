/**
 * Animated card component for study mode
 */

import { motion } from 'framer-motion';
import { Card, CardBody } from '@/shared/design-system';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  bg?: string;
  boxShadow?: string;
  borderWidth?: number;
  borderColor?: string;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  delay = 0,
  bg = 'white',
  boxShadow = 'md',
  borderWidth,
  borderColor,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
    >
      <Card
        bg={bg}
        boxShadow={boxShadow}
        borderWidth={borderWidth}
        borderColor={borderColor}
        borderRadius="xl"
        overflow="hidden"
      >
        <CardBody>{children}</CardBody>
      </Card>
    </motion.div>
  );
};

