/**
 * Scheduled Tests Table Component
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
  VStack,
} from '@/shared/design-system';
import { ScheduledTest } from '@/services/admin';

interface ScheduledTestsTableProps {
  scheduledTests: ScheduledTest[];
  onView: (testId: string) => void;
  onEdit: (testId: string) => void;
  onDelete: (testId: string) => void;
  onViewReport: (testId: string) => void;
}

export const ScheduledTestsTable: React.FC<ScheduledTestsTableProps> = ({
  scheduledTests,
  onView,
  onEdit,
  onDelete,
  onViewReport,
}) => {
  if (scheduledTests.length === 0) {
    return (
      <Card>
        <CardBody>
          <Text textAlign="center" py={8} color="gray.500">
            No scheduled tests found.
          </Text>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Quiz</Th>
              <Th>Scheduled For</Th>
              <Th>Visible From</Th>
              <Th>Visible Until</Th>
              <Th>Duration</Th>
              <Th>Plans/Users</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {scheduledTests.map((test) => (
              <Tr key={test.id}>
                <Td fontWeight="medium">{test.quizName || 'N/A'}</Td>
                <Td>{new Date(test.scheduledFor).toLocaleString()}</Td>
                <Td>{new Date(test.visibleFrom).toLocaleString()}</Td>
                <Td>{test.visibleUntil ? new Date(test.visibleUntil).toLocaleString() : 'N/A'}</Td>
                <Td>{test.durationMinutes ? `${test.durationMinutes} min` : 'N/A'}</Td>
                <Td>
                  <VStack align="start" spacing={1}>
                    {test.planIds && test.planIds.length > 0 && (
                      <Badge colorScheme="purple">
                        {test.planIds.length} Plan{test.planIds.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                    {test.userIds && test.userIds.length > 0 && (
                      <Badge colorScheme="blue">
                        {test.userIds.length} User{test.userIds.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </VStack>
                </Td>
                <Td>
                  <Badge
                    colorScheme={
                      test.status === 'scheduled'
                        ? 'blue'
                        : test.status === 'active'
                        ? 'green'
                        : test.status === 'completed'
                        ? 'gray'
                        : 'red'
                    }
                  >
                    {test.status}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <Button
                      size="xs"
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => onView(test.id)}
                    >
                      View
                    </Button>
                    <Button
                      size="xs"
                      colorScheme="orange"
                      variant="outline"
                      onClick={() => onEdit(test.id)}
                    >
                      Edit
                    </Button>
                    {(test.status === 'completed' || test.status === 'active') && (
                      <Button
                        size="xs"
                        colorScheme="green"
                        variant="outline"
                        onClick={() => onViewReport(test.id)}
                      >
                        Report
                      </Button>
                    )}
                    <IconButton
                      aria-label="Delete scheduled test"
                      icon={<Text>🗑️</Text>}
                      size="xs"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => onDelete(test.id)}
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

