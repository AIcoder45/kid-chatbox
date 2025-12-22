/**
 * Topic List Component
 * Displays a list of topics with selection and deletion
 */

import { VStack, Box, Text, Card, CardBody, HStack, Badge, IconButton } from '@/shared/design-system';
import { motion } from 'framer-motion';
import { Topic } from '@/services/admin';
import { AGE_GROUP_LABELS, DIFFICULTY_LABELS } from '@/constants/topics';

interface TopicListProps {
  topics: Topic[];
  selectedTopic: Topic | null;
  onTopicSelect: (topic: Topic) => void;
  onTopicDelete: (id: string) => void;
}

/**
 * Topic List Component
 * @param topics - Array of topics to display
 * @param selectedTopic - Currently selected topic
 * @param onTopicSelect - Callback when a topic is selected
 * @param onTopicDelete - Callback when a topic is deleted
 */
export const TopicList: React.FC<TopicListProps> = ({
  topics,
  selectedTopic,
  onTopicSelect,
  onTopicDelete,
}) => {
  return (
    <Box flex={1} minW={{ base: '100%', lg: '300px' }}>
      <Text fontWeight="bold" mb={4} fontSize={{ base: 'md', md: 'lg' }}>
        Topics
      </Text>
      <VStack spacing={2} align="stretch">
        {topics.length === 0 ? (
          <Card>
            <CardBody>
              <Text color="gray.500" textAlign="center">
                No topics found. Create your first topic!
              </Text>
            </CardBody>
          </Card>
        ) : (
          topics.map((topic) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card
                cursor="pointer"
                onClick={() => onTopicSelect(topic)}
                bg={selectedTopic?.id === topic.id ? 'blue.50' : 'white'}
                _hover={{ shadow: 'md' }}
              >
                <CardBody>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1} flex={1}>
                      <Text fontWeight="bold">{topic.title}</Text>
                      {topic.description && (
                        <Text fontSize="sm" color="gray.600" noOfLines={2}>
                          {topic.description}
                        </Text>
                      )}
                      <HStack spacing={2} flexWrap="wrap">
                        <Badge colorScheme="blue">
                          {AGE_GROUP_LABELS[topic.ageGroup] || topic.ageGroup}
                        </Badge>
                        <Badge colorScheme="purple">
                          {DIFFICULTY_LABELS[topic.difficultyLevel] || topic.difficultyLevel}
                        </Badge>
                        {topic.category && <Badge colorScheme="green">{topic.category}</Badge>}
                      </HStack>
                    </VStack>
                    <IconButton
                      aria-label="Delete topic"
                      icon={<Text>🗑️</Text>}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTopicDelete(topic.id);
                      }}
                    />
                  </HStack>
                </CardBody>
              </Card>
            </motion.div>
          ))
        )}
      </VStack>
    </Box>
  );
};


