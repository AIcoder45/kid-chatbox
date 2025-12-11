/**
 * Quiz Report Component
 * Displays participants list and results for scheduled tests (competition quizzes)
 * Only includes submissions within the given time limit
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Card,
  CardBody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
} from '@/shared/design-system';
import { scheduledTestsApi } from '@/services/admin';
import { REPORT_MESSAGES } from '@/constants/reports';

interface Participant {
  attemptId: string;
  userId: string;
  userName: string;
  userEmail: string;
  startedAt: string;
  completedAt: string;
  timeTaken: number;
  score: number;
  scorePercentage: number;
  correctAnswers: number;
  wrongAnswers: number;
  isOnTime: boolean;
}

interface ScheduledTestInfo {
  id: string;
  quizName: string;
  scheduledFor: string;
  durationMinutes?: number;
  deadline?: string | null;
  numberOfQuestions: number;
  passingPercentage: number;
}

interface Statistics {
  totalParticipants: number;
  totalMarks: number;
  averageScore: number;
  averagePercentage: number;
  passedCount: number;
  failedCount: number;
  passRate: number;
}

interface QuizReportProps {
  scheduledTestId: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Quiz Report Component
 */
export const QuizReport: React.FC<QuizReportProps> = ({
  scheduledTestId,
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scheduledTest, setScheduledTest] = useState<ScheduledTestInfo | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const toast = useToast();

  /**
   * Load participants and results
   */
  const loadReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await scheduledTestsApi.getScheduledTestParticipants(scheduledTestId);
      setScheduledTest(data.scheduledTest);
      setParticipants(data.participants);
      setStatistics(data.statistics);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load report';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [scheduledTestId, toast]);

  useEffect(() => {
    if (isOpen && scheduledTestId) {
      loadReport();
    }
  }, [isOpen, scheduledTestId, loadReport]);

  /**
   * Export report to CSV
   */
  const exportToCSV = useCallback(() => {
    if (!scheduledTest || !participants.length) {
      toast({
        title: 'Error',
        description: REPORT_MESSAGES.NO_PARTICIPANTS,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // CSV headers
      const headers = [
        'Rank',
        'Name',
        'Email',
        'Score',
        'Total Marks',
        'Percentage',
        'Correct Answers',
        'Wrong Answers',
        'Time Taken (seconds)',
        'Started At',
        'Completed At',
        'Status',
      ];

      // Sort participants by score (descending)
      const sortedParticipants = [...participants].sort(
        (a, b) => b.scorePercentage - a.scorePercentage
      );

      // CSV rows
      const rows = sortedParticipants.map((participant, index) => [
        index + 1,
        participant.userName,
        participant.userEmail,
        participant.score,
        scheduledTest.numberOfQuestions,
        `${participant.scorePercentage.toFixed(2)}%`,
        participant.correctAnswers,
        participant.wrongAnswers,
        participant.timeTaken,
        new Date(participant.startedAt).toLocaleString(),
        new Date(participant.completedAt).toLocaleString(),
        participant.scorePercentage >= scheduledTest.passingPercentage ? 'Passed' : 'Failed',
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `quiz-report-${scheduledTest.quizName.replace(/[^a-z0-9]/gi, '_')}-${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Success',
        description: REPORT_MESSAGES.EXPORT_SUCCESS,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : REPORT_MESSAGES.EXPORT_ERROR;
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [scheduledTest, participants, toast]);

  /**
   * Format time taken
   */
  const formatTimeTaken = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }, []);

  /**
   * Format date
   */
  const formatDate = useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleString();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxW="95vw" maxH="95vh">
        <ModalHeader>
          <VStack align="start" spacing={1}>
            <Heading size="lg">Quiz Report</Heading>
            {scheduledTest && (
              <Text fontSize="sm" color="gray.600">
                {scheduledTest.quizName}
              </Text>
            )}
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Box textAlign="center" py={10}>
              <Spinner size="xl" />
              <Text mt={4}>{REPORT_MESSAGES.LOADING_PARTICIPANTS}</Text>
            </Box>
          ) : error ? (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          ) : !scheduledTest || !statistics ? (
            <Alert status="info">
              <AlertIcon />
              {REPORT_MESSAGES.NO_PARTICIPANTS}
            </Alert>
          ) : (
            <VStack spacing={6} align="stretch">
              {/* Statistics Cards */}
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                <Stat>
                  <StatLabel>Total Participants</StatLabel>
                  <StatNumber>{statistics.totalParticipants}</StatNumber>
                  <StatHelpText>On-time submissions only</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Total Marks</StatLabel>
                  <StatNumber>{statistics.totalMarks}</StatNumber>
                  <StatHelpText>Sum of all scores</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Average Score</StatLabel>
                  <StatNumber>{statistics.averageScore.toFixed(2)}</StatNumber>
                  <StatHelpText>
                    {statistics.averagePercentage.toFixed(2)}% average
                  </StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Pass Rate</StatLabel>
                  <StatNumber>{statistics.passRate.toFixed(1)}%</StatNumber>
                  <StatHelpText>
                    {statistics.passedCount} passed, {statistics.failedCount} failed
                  </StatHelpText>
                </Stat>
              </SimpleGrid>

              {/* Quiz Info */}
              <Card>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.600">
                        Scheduled For
                      </Text>
                      <Text fontWeight="medium">{formatDate(scheduledTest.scheduledFor)}</Text>
                    </Box>
                    {scheduledTest.deadline && (
                      <Box>
                        <Text fontSize="sm" color="gray.600">
                          Deadline
                        </Text>
                        <Text fontWeight="medium">{formatDate(scheduledTest.deadline)}</Text>
                      </Box>
                    )}
                    <Box>
                      <Text fontSize="sm" color="gray.600">
                        Passing Percentage
                      </Text>
                      <Text fontWeight="medium">{scheduledTest.passingPercentage}%</Text>
                    </Box>
                  </SimpleGrid>
                </CardBody>
              </Card>

              {/* Participants Table */}
              {participants.length === 0 ? (
                <Alert status="info">
                  <AlertIcon />
                  {REPORT_MESSAGES.NO_PARTICIPANTS}
                </Alert>
              ) : (
                <Box overflowX="auto">
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Rank</Th>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th isNumeric>Score</Th>
                        <Th isNumeric>Percentage</Th>
                        <Th isNumeric>Correct</Th>
                        <Th isNumeric>Wrong</Th>
                        <Th>Time Taken</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {[...participants]
                        .sort((a, b) => b.scorePercentage - a.scorePercentage)
                        .map((participant, index) => (
                          <Tr key={participant.attemptId}>
                            <Td fontWeight="bold">{index + 1}</Td>
                            <Td fontWeight="medium">{participant.userName}</Td>
                            <Td fontSize="sm">{participant.userEmail}</Td>
                            <Td isNumeric>{participant.score}</Td>
                            <Td isNumeric>
                              <Text
                                fontWeight="bold"
                                color={
                                  participant.scorePercentage >= scheduledTest.passingPercentage
                                    ? 'green.600'
                                    : 'red.600'
                                }
                              >
                                {participant.scorePercentage.toFixed(2)}%
                              </Text>
                            </Td>
                            <Td isNumeric color="green.600" fontWeight="medium">
                              {participant.correctAnswers}
                            </Td>
                            <Td isNumeric color="red.600">{participant.wrongAnswers}</Td>
                            <Td>{formatTimeTaken(participant.timeTaken)}</Td>
                            <Td>
                              <Badge
                                colorScheme={
                                  participant.scorePercentage >= scheduledTest.passingPercentage
                                    ? 'green'
                                    : 'red'
                                }
                              >
                                {participant.scorePercentage >= scheduledTest.passingPercentage
                                  ? 'Passed'
                                  : 'Failed'}
                              </Badge>
                            </Td>
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            {participants.length > 0 && (
              <Button colorScheme="blue" onClick={exportToCSV}>
                Export CSV
              </Button>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

