/**
 * Quiz Table Component
 */

import React from 'react';
import {
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  HStack,
  VStack,
  Button,
  IconButton,
  Box,
  Divider,
  SimpleGrid,
} from '@/shared/design-system';
import { Quiz } from '@/services/admin';

interface QuizTableProps {
  quizzes: Quiz[];
  onView: (quiz: Quiz) => void;
  onEdit: (quiz: Quiz) => void;
  onSchedule: (quiz: Quiz) => void;
  onDelete: (quizId: string) => void;
}

export const QuizTable: React.FC<QuizTableProps> = ({
  quizzes,
  onView,
  onEdit,
  onSchedule,
  onDelete,
}) => {
  if (quizzes.length === 0) {
    return (
      <Card>
        <CardBody>
          <Text textAlign="center" py={8} color="gray.500">
            No quizzes found. Create your first quiz!
          </Text>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      {/* Mobile View - Card Layout */}
      <Box display={{ base: 'block', md: 'none' }}>
        <VStack spacing={4} align="stretch">
          {quizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardBody>
                <VStack spacing={3} align="stretch">
                  <Box>
                    <Text fontWeight="bold" fontSize="lg" mb={1}>
                      {quiz.name}
                    </Text>
                    {quiz.description && (
                      <Text fontSize="sm" color="gray.600" noOfLines={2}>
                        {quiz.description}
                      </Text>
                    )}
                  </Box>

                  <Divider />

                  <SimpleGrid columns={2} spacing={3}>
                    <Box>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Age Group
                      </Text>
                      <Badge colorScheme="purple">{quiz.ageGroup}</Badge>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Difficulty
                      </Text>
                      <Badge colorScheme="blue">{quiz.difficulty}</Badge>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Questions
                      </Text>
                      <Text fontWeight="medium">{quiz.numberOfQuestions}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Passing %
                      </Text>
                      <Text fontWeight="medium">{quiz.passingPercentage}%</Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Time Limit
                      </Text>
                      <Text fontWeight="medium">
                        {quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Status
                      </Text>
                      <Badge colorScheme={quiz.isActive ? 'green' : 'gray'}>
                        {quiz.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </Box>
                  </SimpleGrid>

                  <Divider />

                  <HStack spacing={2} flexWrap="wrap">
                    <Button
                      size="sm"
                      colorScheme="green"
                      variant="outline"
                      flex="1"
                      minW="80px"
                      onClick={() => onView(quiz)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="orange"
                      variant="outline"
                      flex="1"
                      minW="80px"
                      onClick={() => onEdit(quiz)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      flex="1"
                      minW="80px"
                      onClick={() => onSchedule(quiz)}
                    >
                      Schedule
                    </Button>
                    <IconButton
                      aria-label="Delete quiz"
                      icon={<Text>🗑️</Text>}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => onDelete(quiz.id)}
                    />
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      </Box>

      {/* Desktop View - Table Layout */}
      <Box display={{ base: 'none', md: 'block' }}>
        <Card>
          <CardBody>
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Description</Th>
                    <Th>Age Group</Th>
                    <Th>Difficulty</Th>
                    <Th>Questions</Th>
                    <Th>Passing %</Th>
                    <Th>Time Limit</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {quizzes.map((quiz) => (
                    <Tr key={quiz.id}>
                      <Td fontWeight="medium">{quiz.name}</Td>
                      <Td>
                        <Text fontSize="sm" noOfLines={2} maxW="200px">
                          {quiz.description || 'No description'}
                        </Text>
                      </Td>
                      <Td>
                        <Badge colorScheme="purple">{quiz.ageGroup}</Badge>
                      </Td>
                      <Td>
                        <Badge colorScheme="blue">{quiz.difficulty}</Badge>
                      </Td>
                      <Td>{quiz.numberOfQuestions}</Td>
                      <Td>{quiz.passingPercentage}%</Td>
                      <Td>{quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}</Td>
                      <Td>
                        <Badge colorScheme={quiz.isActive ? 'green' : 'gray'}>
                          {quiz.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack spacing={1}>
                          <Button
                            size="xs"
                            colorScheme="green"
                            variant="outline"
                            onClick={() => onView(quiz)}
                          >
                            View
                          </Button>
                          <Button
                            size="xs"
                            colorScheme="orange"
                            variant="outline"
                            onClick={() => onEdit(quiz)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="xs"
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => onSchedule(quiz)}
                          >
                            Schedule
                          </Button>
                          <IconButton
                            aria-label="Delete quiz"
                            icon={<Text>🗑️</Text>}
                            size="xs"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => onDelete(quiz.id)}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </>
  );
};

