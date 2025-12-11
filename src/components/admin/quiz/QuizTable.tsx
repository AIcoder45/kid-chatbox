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
  Button,
  IconButton,
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
    <Card>
      <CardBody>
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
      </CardBody>
    </Card>
  );
};

