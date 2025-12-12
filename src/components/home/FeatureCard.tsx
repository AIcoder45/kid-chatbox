/**
 * Feature card component with hover animations
 */

import { motion } from 'framer-motion';
import { Card, CardBody, VStack, Text, Heading } from '@/shared/design-system';

interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
  delay: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  emoji,
  title,
  description,
  delay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.05, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card
        bg="rgba(255, 255, 255, 0.95)"
        backdropFilter="blur(10px)"
        borderRadius="2xl"
        boxShadow="xl"
        height="100%"
        cursor="pointer"
        _hover={{
          boxShadow: '2xl',
        }}
      >
        <CardBody p={{ base: 4, md: 8 }}>
          <VStack spacing={{ base: 3, md: 4 }} align="center">
            <Text fontSize={{ base: '3xl', md: '5xl' }}>{emoji}</Text>
            <Heading size={{ base: 'sm', md: 'md' }} color="purple.600" textAlign="center">
              {title}
            </Heading>
            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600" textAlign="center">
              {description}
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </motion.div>
  );
};

