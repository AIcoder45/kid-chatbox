/**
 * View Scheduled Test Modal Component
 */

import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  Badge,
  Box,
  Card,
  CardBody,
} from '@/shared/design-system';
import { ScheduledTest } from '@/services/admin';

interface ViewScheduledTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  test: ScheduledTest | null;
  onEdit: (testId: string) => void;
}

export const ViewScheduledTestModal: React.FC<ViewScheduledTestModalProps> = ({
  isOpen,
  onClose,
  test,
  onEdit,
}) => {
  if (!test) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="90vh" maxW="90vw">
        <ModalHeader>
          <VStack align="start" spacing={1}>
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold">
              {test.quizName || 'Scheduled Test Details'}
            </Text>
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
              {test.status || 'N/A'}
            </Badge>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Card>
              <CardBody>
                <VStack spacing={3} align="stretch">
                  <Box>
                    <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={1}>
                      Quiz Information
                    </Text>
                    <Text>
                      <Text as="span" fontWeight="medium">Name:</Text> {test.quizName || 'N/A'}
                    </Text>
                    {test.quizDescription && (
                      <Text mt={1}>
                        <Text as="span" fontWeight="medium">Description:</Text> {test.quizDescription}
                      </Text>
                    )}
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={1}>
                      Schedule Details
                    </Text>
                    <Text>
                      <Text as="span" fontWeight="medium">Scheduled For:</Text>{' '}
                      {new Date(test.scheduledFor).toLocaleString()}
                    </Text>
                    <Text mt={1}>
                      <Text as="span" fontWeight="medium">Visible From:</Text>{' '}
                      {new Date(test.visibleFrom).toLocaleString()}
                    </Text>
                    {test.visibleUntil && (
                      <Text mt={1}>
                        <Text as="span" fontWeight="medium">Visible Until:</Text>{' '}
                        {new Date(test.visibleUntil).toLocaleString()}
                      </Text>
                    )}
                    {test.durationMinutes && (
                      <Text mt={1}>
                        <Text as="span" fontWeight="medium">Duration:</Text> {test.durationMinutes} minutes
                      </Text>
                    )}
                  </Box>

                  {((test.plans && test.plans.length > 0) ||
                    (test.users && test.users.length > 0) ||
                    (test.planIds && test.planIds.length > 0) ||
                    (test.userIds && test.userIds.length > 0)) && (
                    <Box>
                      <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={2}>
                        Assigned To
                      </Text>
                      {test.plans && test.plans.length > 0 && (
                        <VStack align="start" spacing={2} mb={3}>
                          <Text fontWeight="medium">Plans ({test.plans.length}):</Text>
                          {test.plans.map((plan) => (
                            <Badge key={plan.id} colorScheme="purple" p={2}>
                              {plan.name}
                              {plan.description && (
                                <Text fontSize="xs" mt={1} color="gray.600">
                                  {plan.description}
                                </Text>
                              )}
                            </Badge>
                          ))}
                        </VStack>
                      )}
                      {test.users && test.users.length > 0 && (
                        <VStack align="start" spacing={2}>
                          <Text fontWeight="medium">Users ({test.users.length}):</Text>
                          {test.users.map((user) => (
                            <Badge key={user.id} colorScheme="blue" p={2}>
                              {user.name} ({user.email})
                            </Badge>
                          ))}
                        </VStack>
                      )}
                    </Box>
                  )}

                  {test.instructions && (
                    <Box>
                      <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={1}>
                        Instructions
                      </Text>
                      <Text>{test.instructions}</Text>
                    </Box>
                  )}

                  <Box>
                    <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={1}>
                      Metadata
                    </Text>
                    <Text fontSize="sm">
                      <Text as="span" fontWeight="medium">Scheduled By:</Text> {test.scheduledByName || 'N/A'}
                    </Text>
                    <Text fontSize="sm" mt={1}>
                      <Text as="span" fontWeight="medium">Created:</Text>{' '}
                      {new Date(test.createdAt).toLocaleString()}
                    </Text>
                    <Text fontSize="sm" mt={1}>
                      <Text as="span" fontWeight="medium">Last Updated:</Text>{' '}
                      {new Date(test.updatedAt).toLocaleString()}
                    </Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="orange" onClick={() => onEdit(test.id)}>
            Edit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

