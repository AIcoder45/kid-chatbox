/**
 * Subtopic List Component
 * Displays subtopics for a selected topic
 */

import { VStack, Box, Text, Card, CardBody, HStack, Badge, IconButton, Button } from '@/shared/design-system';
import { Subtopic } from '@/services/admin';
import { DIFFICULTY_LABELS } from '@/constants/topics';

interface SubtopicListProps {
  subtopics: Subtopic[];
  topicTitle: string;
  onCreateClick: () => void;
  onDelete: (id: string) => void;
}

/**
 * Subtopic List Component
 * @param subtopics - Array of subtopics to display
 * @param topicTitle - Title of the parent topic
 * @param onCreateClick - Callback when create button is clicked
 * @param onDelete - Callback when a subtopic is deleted
 */
export const SubtopicList: React.FC<SubtopicListProps> = ({
  subtopics,
  topicTitle,
  onCreateClick,
  onDelete,
}) => {
  return (
    <Box flex={1} minW={{ base: '100%', lg: '300px' }}>
      <HStack justify="space-between" mb={4} flexWrap="wrap" spacing={2}>
        <Text fontWeight="bold" fontSize={{ base: 'md', md: 'lg' }}>
          Subtopics for {topicTitle}
        </Text>
        <Button size={{ base: 'sm', md: 'md' }} colorScheme="blue" onClick={onCreateClick}>
          + Add Subtopic
        </Button>
      </HStack>
      <VStack spacing={2} align="stretch">
        {subtopics.length === 0 ? (
          <Card>
            <CardBody>
              <VStack spacing={4}>
                <Text color="gray.500" textAlign="center">
                  No subtopics yet. Create your first subtopic!
                </Text>
                <Button colorScheme="blue" onClick={onCreateClick} w="100%">
                  Create Subtopic
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          subtopics.map((subtopic) => (
            <Card key={subtopic.id}>
              <CardBody>
                <HStack justify="space-between">
                  <VStack align="start" spacing={1} flex={1}>
                    <Text fontWeight="bold">{subtopic.title}</Text>
                    {subtopic.description && (
                      <Text fontSize="sm" color="gray.600" noOfLines={2}>
                        {subtopic.description}
                      </Text>
                    )}
                    <Badge mt={2} colorScheme="green">
                      {DIFFICULTY_LABELS[subtopic.difficultyLevel] || subtopic.difficultyLevel}
                    </Badge>
                  </VStack>
                  <IconButton
                    aria-label="Delete subtopic"
                    icon={<Text>🗑️</Text>}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => onDelete(subtopic.id)}
                  />
                </HStack>
              </CardBody>
            </Card>
          ))
        )}
      </VStack>
    </Box>
  );
};

