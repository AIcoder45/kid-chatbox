/**
 * Animated list item component for study explanations
 */

import { motion } from 'framer-motion';
import { HStack, Text } from '@/shared/design-system';

interface AnimatedListItemProps {
  text: string;
  index: number;
  fontSize?: string;
}

export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
  text,
  index,
  fontSize = 'md',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <HStack align="flex-start" spacing={4} py={2}>
        <motion.div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#3182ce',
            marginTop: '8px',
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
        />
        <Text fontSize={fontSize} lineHeight="tall" color="gray.700" flex={1}>
          {text}
        </Text>
      </HStack>
    </motion.div>
  );
};

