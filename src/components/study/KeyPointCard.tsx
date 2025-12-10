/**
 * Animated key point card component
 */

import { motion } from 'framer-motion';
import { Box, HStack, Text, Badge } from '@/shared/design-system';

interface KeyPointCardProps {
  point: string;
  index: number;
  fontSize?: string;
}

export const KeyPointCard: React.FC<KeyPointCardProps> = ({
  point,
  index,
  fontSize = 'sm',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <Box
        padding={4}
        borderRadius="lg"
        bg="white"
        borderLeftWidth={4}
        borderLeftColor="yellow.500"
        boxShadow="sm"
        height="100%"
        transition="all 0.2s"
        _hover={{
          boxShadow: 'md',
          borderLeftColor: 'yellow.600',
        }}
      >
        <HStack spacing={3} align="flex-start">
          <Badge
            colorScheme="yellow"
            minWidth="35px"
            textAlign="center"
            fontSize="xs"
            padding={1}
            borderRadius="md"
          >
            {index + 1}
          </Badge>
          <Text fontSize={fontSize} lineHeight="tall" color="gray.700" flex={1}>
            {point}
          </Text>
        </HStack>
      </Box>
    </motion.div>
  );
};

