/**
 * Quiz Rankings Component
 * Displays quiz rankings and leaderboard for students
 */

import { useState, useEffect, useCallback } from 'react';
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
  Divider,
} from '@/shared/design-system';
import { apiClient, authApi } from '@/services/api';
import { PullToRefresh } from './PullToRefresh';

/**
 * Quiz Rankings component for students
 * Shows rankings and leaderboard based on quiz history
 */
export const QuizRankings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'score' | 'time' | 'questions' | 'composite'>('composite');
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    const { user } = authApi.getCurrentUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    loadRankings();
  }, [sortBy, selectedSubject]);

  useEffect(() => {
    if (analytics && currentUser) {
      const rank = analytics.leaderboard.findIndex(
        (p: any) => p.userId === (currentUser as { id: string }).id
      );
      setUserRank(rank >= 0 ? rank + 1 : null);
    }
  }, [analytics, currentUser]);

  const loadRankings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/analytics/quiz-rankings', {
        params: {
          subject: selectedSubject,
          subtopic: undefined,
          sortBy,
          limit: 100,
        },
      });
      const data = response.data;
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load quiz rankings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [sortBy, selectedSubject]);

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

  const handleRefresh = async () => {
    await loadRankings();
  };

  if (loading) {
    return (
      <PullToRefresh onRefresh={handleRefresh}>
        <Box textAlign="center" py={10}>
          <Spinner size="xl" />
          <Text mt={4}>Loading quiz rankings...</Text>
        </Box>
      </PullToRefresh>
    );
  }

  if (error) {
    return (
      <Box p={6}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
        <Button mt={4} onClick={loadRankings}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!analytics || analytics.leaderboard.length === 0) {
    return (
      <Box p={6}>
        <Alert status="info">
          <AlertIcon />
          No quiz attempts found. Complete quizzes to see rankings!
        </Alert>
      </Box>
    );
  }

  const userRanking = analytics.leaderboard.find(
    (p: any) => p.userId === (currentUser as { id: string })?.id
  );

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <Box p={6} maxWidth="1400px" marginX="auto">
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center">
            <Heading size="lg">🏆 Quiz Rankings</Heading>
            <Button onClick={loadRankings} size="sm">
              Refresh
            </Button>
          </HStack>

          {/* Summary Stats */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
            <Stat>
              <StatLabel>Total Participants</StatLabel>
              <StatNumber>{analytics.summary.totalParticipants}</StatNumber>
              <StatHelpText>Students competing</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Total Attempts</StatLabel>
              <StatNumber>{analytics.summary.totalAttempts}</StatNumber>
              <StatHelpText>Quiz completions</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Average Score</StatLabel>
              <StatNumber>{analytics.summary.averageScore}%</StatNumber>
              <StatHelpText>Across all quizzes</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Your Rank</StatLabel>
              <StatNumber>
                {userRank ? `#${userRank}` : 'N/A'}
              </StatNumber>
              <StatHelpText>
                {userRanking
                  ? `${userRanking.scorePercentage}% • ${userRanking.compositeScore.toFixed(1)} pts`
                  : 'Complete quizzes to rank'}
              </StatHelpText>
            </Stat>
          </SimpleGrid>

          {/* Your Ranking Card */}
          {userRanking && (
            <Card bgGradient="linear(to-r, blue.50, purple.50)" borderWidth={2} borderColor="blue.200">
              <CardBody>
                <VStack spacing={3}>
                  <HStack spacing={4} width="100%" justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                        Your Ranking
                      </Text>
                      <HStack spacing={2}>
                        <Badge colorScheme={getRankBadgeColor(userRanking.rank)} fontSize="lg" p={2}>
                          {getRankIcon(userRanking.rank)}
                        </Badge>
                        <Text fontSize="2xl" fontWeight="bold">
                          #{userRanking.rank} out of {analytics.summary.totalParticipants}
                        </Text>
                      </HStack>
                    </VStack>
                    <VStack align="end" spacing={1}>
                      <Text fontSize="sm" color="gray.600">
                        Composite Score
                      </Text>
                      <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                        {userRanking.compositeScore.toFixed(1)}
                      </Text>
                    </VStack>
                  </HStack>
                  <Divider />
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} width="100%">
                    <VStack spacing={1}>
                      <Text fontSize="xs" color="gray.600">
                        Score
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" color="blue.600">
                        {userRanking.scorePercentage}%
                      </Text>
                    </VStack>
                    <VStack spacing={1}>
                      <Text fontSize="xs" color="gray.600">
                        Correct
                      </Text>
                      <Text fontSize="lg" fontWeight="bold">
                        {userRanking.correctAnswers}/{userRanking.totalQuestions}
                      </Text>
                    </VStack>
                    <VStack spacing={1}>
                      <Text fontSize="xs" color="gray.600">
                        Time
                      </Text>
                      <Text fontSize="lg" fontWeight="bold">
                        {userRanking.timeTakenFormatted}
                      </Text>
                    </VStack>
                    <VStack spacing={1}>
                      <Text fontSize="xs" color="gray.600">
                        Subject
                      </Text>
                      <Badge colorScheme="purple">{userRanking.subject || 'N/A'}</Badge>
                    </VStack>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* Filters */}
          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="sm">Filters & Sorting</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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
                          {subject} ({analytics.summary.subjects[subject].attempts} attempts)
                        </option>
                      ))}
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
                  <Heading size="md">📊 Leaderboard</Heading>
                  <Badge colorScheme="blue">
                    {analytics.summary.totalParticipants} Participants
                  </Badge>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  Rankings calculated using: Score (60%) + Questions Correct (20%) + Time
                  Efficiency (20%)
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
                      </Tr>
                    </Thead>
                    <Tbody>
                      {analytics.leaderboard.slice(0, 50).map((participant: any) => {
                        const isCurrentUser = participant.userId === (currentUser as { id: string })?.id;
                        return (
                          <Tr
                            key={participant.attemptId}
                            bg={isCurrentUser ? 'blue.50' : 'transparent'}
                            fontWeight={isCurrentUser ? 'bold' : 'normal'}
                          >
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
                                <Text fontWeight={isCurrentUser ? 'bold' : 'semibold'}>
                                  {isCurrentUser ? '👤 ' : ''}
                                  {participant.userName}
                                </Text>
                                {isCurrentUser && (
                                  <Text fontSize="xs" color="blue.600" fontWeight="bold">
                                    (You)
                                  </Text>
                                )}
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
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    </PullToRefresh>
  );
};

