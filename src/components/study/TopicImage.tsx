/**
 * Topic image component with fallback
 */

import { Box, Image, Text } from '@/shared/design-system';
import { motion } from 'framer-motion';

interface TopicImageProps {
  subject: string;
  topic: string;
}

/**
 * Get image URL based on subject and topic
 */
const getImageUrl = (subject: string): string => {
  const subjectLower = subject.toLowerCase();

  // Map subjects to image categories
  const imageMap: Record<string, string> = {
    mathematics: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop',
    maths: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop',
    science: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
    'evs / science': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
    english: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop',
    hindi: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
    'general knowledge': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
    'current affairs': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop',
    chess: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&h=600&fit=crop',
    social: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
    history: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
    geography: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=600&fit=crop',
  };

  // Try to match subject
  if (imageMap[subjectLower]) {
    return imageMap[subjectLower];
  }

  // Default educational image
  return 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop';
};

export const TopicImage: React.FC<TopicImageProps> = ({ subject, topic }) => {
  const imageUrl = getImageUrl(subject);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Box
        position="relative"
        width="100%"
        height="300px"
        borderRadius="xl"
        overflow="hidden"
        boxShadow="lg"
        mb={6}
      >
        <Image
          src={imageUrl}
          alt={`${subject} - ${topic}`}
          width="100%"
          height="100%"
          objectFit="cover"
          fallback={
            <Box
              width="100%"
              height="100%"
              bg="gradient-to-r"
              bgGradient="linear(to-r, blue.400, purple.500)"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="6xl">{subject.charAt(0)}</Text>
            </Box>
          }
        />
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          bg="linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
          padding={4}
        >
          <Text color="white" fontSize="lg" fontWeight="bold">
            {subject} • {topic}
          </Text>
        </Box>
      </Box>
    </motion.div>
  );
};

