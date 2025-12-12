/**
 * Quiz Results Analytics Component
 * Displays analytics and leaderboard for all quizzes
 */

import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Select,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
} from '@/shared/design-system';
import { adminApi } from '@/services/admin';

interface QuizResultsAnalyticsProps {
  subject?: string;
  subtopic?: string;
}

/**
 * Quiz Results Analytics component
 * Shows rankings and analytics for quiz attempts based on quiz history
 */
export const QuizResultsAnalytics: React.FC<QuizResultsAnalyticsProps> = ({ subject, subtopic }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'score' | 'time' | 'questions' | 'composite'>('composite');
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(subject);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | undefined>(subtopic);

  useEffect(() => {
    loadAnalytics();
  }, [sortBy, selectedSubject, selectedSubtopic]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getQuizResultsAnalytics({
        subject: selectedSubject,
        subtopic: selectedSubtopic,
        sortBy,
        limit: 100,
      });
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load quiz results analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadgeColor = (rank: number): string => {
    if (rank === 1) return 'yellow';
    if (rank === 2) return 'gray';
    if (rank === 3) return 'orange';
    return 'blue';
  };

  const getRankIcon = (rank: number): string => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading quiz results analytics...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  if (!analytics || analytics.leaderboard.length === 0) {
    return (
      <Alert status="info">
        <AlertIcon />
        No quiz attempts found. Students need to complete quizzes to see analytics.
      </Alert>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <Heading size="lg">Quiz Results Analytics & Rankings</Heading>
          <Button onClick={loadAnalytics} size="sm">
            Refresh
          </Button>
        </HStack>

        {/* Summary Stats */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          <Stat>
            <StatLabel>Total Attempts</StatLabel>
            <StatNumber>{analytics.summary.totalAttempts}</StatNumber>
            <StatHelpText>Quiz completions</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Total Participants</StatLabel>
            <StatNumber>{analytics.summary.totalParticipants}</StatNumber>
            <StatHelpText>Unique students</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Average Score</StatLabel>
            <StatNumber>{analytics.summary.averageScore}%</StatNumber>
            <StatHelpText>Across all attempts</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Average Time</StatLabel>
            <StatNumber>
              {Math.floor(analytics.summary.averageTime / 60)}m {analytics.summary.averageTime % 60}s
            </StatNumber>
            <StatHelpText>Per quiz</StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Filters */}
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Heading size="sm">Filters & Sorting</Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Box>
                  <Text mb={2} fontSize="sm" fontWeight="semibold">
                    Sort By:
                  </Text>
                  <Select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                    <option value="composite">Composite Score</option>
                    <option value="score">Score %</option>
                    <option value="questions">Questions Correct</option>
                    <option value="time">Time Taken</option>
                  </Select>
                </Box>
                <Box>
                  <Text mb={2} fontSize="sm" fontWeight="semibold">
                    Subject:
                  </Text>
                  <Select
                    value={selectedSubject || ''}
                    onChange={(e) => setSelectedSubject(e.target.value || undefined)}
                  >
                    <option value="">All Subjects</option>
                    {Object.keys(analytics.summary.subjects).map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </Select>
                </Box>
                <Box>
                  <Text mb={2} fontSize="sm" fontWeight="semibold">
                    Subtopic:
                  </Text>
                  <Select
                    value={selectedSubtopic || ''}
                    onChange={(e) => setSelectedSubtopic(e.target.value || undefined)}
                  >
                    <option value="">All Subtopics</option>
                  </Select>
                </Box>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Heading size="md">Leaderboard</Heading>
                <Badge colorScheme="blue">
                  {analytics.summary.totalParticipants} Participants
                </Badge>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                Rankings calculated using: Score (60%) + Questions Correct (20%) + Time Efficiency
                (20%)
              </Text>
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Rank</Th>
                      <Th>Student</Th>
                      <Th>Subject</Th>
                      <Th>Subtopic</Th>
                      <Th isNumeric>Score</Th>
                      <Th isNumeric>Correct</Th>
                      <Th isNumeric>Time</Th>
                      <Th isNumeric>Composite</Th>
                      <Th>Breakdown</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {analytics.leaderboard.slice(0, 50).map((participant: any) => (
                      <Tr key={participant.attemptId}>
                        <Td>
                          <Badge
                            colorScheme={getRankBadgeColor(participant.rank)}
                            fontSize="md"
                            p={2}
                          >
                            {getRankIcon(participant.rank)}
                          </Badge>
                        </Td>
                        <Td>
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="semibold">{participant.userName}</Text>
                            <Text fontSize="xs" color="gray.500">
                              {participant.userEmail}
                            </Text>
                          </VStack>
                        </Td>
                        <Td>
                          <Badge colorScheme="blue">{participant.subject || 'N/A'}</Badge>
                        </Td>
                        <Td>
                          <Text fontSize="sm">{participant.subtopic || 'N/A'}</Text>
                        </Td>
                        <Td isNumeric>
                          <Text fontWeight="bold" color="blue.600">
                            {participant.scorePercentage}%
                          </Text>
                        </Td>
                        <Td isNumeric>
                          {participant.correctAnswers}/{participant.totalQuestions}
                        </Td>
                        <Td isNumeric>{participant.timeTakenFormatted}</Td>
                        <Td isNumeric>
                          <Text fontWeight="bold" color="green.600">
                            {participant.compositeScore?.toFixed(1) || 'N/A'}
                          </Text>
                        </Td>
                        <Td>
                          <VStack align="start" spacing={0} fontSize="xs">
                            <Text>Score: {participant.scoreBreakdown.scoreComponent.toFixed(1)}</Text>
                            <Text>Q: {participant.scoreBreakdown.questionsComponent.toFixed(1)}</Text>
                            <Text>Time: {participant.scoreBreakdown.timeComponent.toFixed(1)}</Text>
                          </VStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

