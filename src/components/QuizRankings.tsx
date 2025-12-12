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
  const [availableQuizzes, setAvailableQuizzes] = useState<any[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [sortBy, setSortBy] = useState<'score' | 'time' | 'questions' | 'composite'>('composite');
  const [selectedQuizId, setSelectedQuizId] = useState<string | undefined>(undefined);
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    const { user } = authApi.getCurrentUser();
    setCurrentUser(user);
    loadAvailableQuizzes();
  }, []);

  useEffect(() => {
    loadRankings();
  }, [sortBy, selectedQuizId, selectedSubject]);

  useEffect(() => {
    if (analytics && currentUser) {
      // Filter to show only current user's records
      const userRecords = analytics.leaderboard.filter(
        (p: any) => p.userId === (currentUser as { id: string }).id
      );
      if (userRecords.length > 0) {
        // Find the rank in the full leaderboard
        const rank = analytics.leaderboard.findIndex(
          (p: any) => p.userId === (currentUser as { id: string }).id
        );
        setUserRank(rank >= 0 ? rank + 1 : null);
      } else {
        setUserRank(null);
      }
    }
  }, [analytics, currentUser]);

  const loadAvailableQuizzes = useCallback(async () => {
    try {
      setLoadingQuizzes(true);
      const response = await apiClient.get('/analytics/quiz-rankings/quizzes');
      if (response.data.success && response.data.quizzes) {
        setAvailableQuizzes(response.data.quizzes);
        // Auto-select first quiz if available
        if (response.data.quizzes.length > 0 && !selectedQuizId) {
          setSelectedQuizId(response.data.quizzes[0].id);
        }
      }
    } catch (err: any) {
      console.error('Failed to load available quizzes:', err);
    } finally {
      setLoadingQuizzes(false);
    }
  }, [selectedQuizId]);

  const loadRankings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/analytics/quiz-rankings', {
        params: {
          quizId: selectedQuizId,
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
  }, [sortBy, selectedQuizId, selectedSubject]);

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

  // Filter to show only current user's records
  const userRecords = analytics.leaderboard.filter(
    (p: any) => p.userId === (currentUser as { id: string })?.id
  );

  const userRanking = userRecords.length > 0 ? userRecords[0] : null;

  // Calculate user-specific summary
  const userSummary = {
    totalAttempts: userRecords.length,
    totalParticipants: analytics.summary.totalParticipants, // Keep total for context
    averageScore: userRecords.length > 0
      ? Math.round(userRecords.reduce((sum: number, p: any) => sum + p.scorePercentage, 0) / userRecords.length)
      : 0,
    averageTime: userRecords.length > 0
      ? Math.round(userRecords.reduce((sum: number, p: any) => sum + p.timeTaken, 0) / userRecords.length)
      : 0,
  };

  if (!analytics || userRecords.length === 0) {
    return (
      <PullToRefresh onRefresh={handleRefresh}>
        <Box p={6} maxWidth="1400px" marginX="auto">
          <VStack spacing={6} align="stretch">
            <HStack justify="space-between" align="center">
              <Heading size="lg">🏆 My Quiz Rankings</Heading>
              <Button onClick={loadRankings} size="sm">
                Refresh
              </Button>
            </HStack>
            <Alert status="info">
              <AlertIcon />
              No quiz attempts found. Complete quizzes to see your rankings!
            </Alert>
          </VStack>
        </Box>
      </PullToRefresh>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <Box p={6} maxWidth="1400px" marginX="auto">
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center">
            <Heading size="lg">🏆 My Quiz Rankings</Heading>
            <Button onClick={loadRankings} size="sm">
              Refresh
            </Button>
          </HStack>

          {/* Summary Stats */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
            <Stat>
              <StatLabel>My Total Attempts</StatLabel>
              <StatNumber>{userSummary.totalAttempts}</StatNumber>
              <StatHelpText>Quizzes completed</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>My Average Score</StatLabel>
              <StatNumber>{userSummary.averageScore}%</StatNumber>
              <StatHelpText>Across all my quizzes</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Average Time</StatLabel>
              <StatNumber>{Math.floor(userSummary.averageTime / 60)}m</StatNumber>
              <StatHelpText>{userSummary.averageTime % 60}s per quiz</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Best Rank</StatLabel>
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
                          #{userRanking.rank} out of {analytics.summary.totalParticipants} participants
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        Quiz: <strong>{userRanking.subject} - {userRanking.subtopic}</strong>
                      </Text>
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
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Box>
                    <Text mb={2} fontSize="sm" fontWeight="semibold">
                      Select Quiz:
                    </Text>
                    {loadingQuizzes ? (
                      <Spinner size="sm" />
                    ) : (
                      <Select
                        value={selectedQuizId || ''}
                        onChange={(e) => {
                          setSelectedQuizId(e.target.value || undefined);
                          setSelectedSubject(undefined); // Reset subject filter when quiz changes
                        }}
                      >
                        <option value="">All Quizzes</option>
                        {availableQuizzes.map((quiz) => (
                          <option key={quiz.id} value={quiz.id}>
                            {quiz.displayName} ({quiz.participantCount} participants, {quiz.attemptCount} attempts)
                          </option>
                        ))}
                      </Select>
                    )}
                  </Box>
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
                      Subject (if no quiz selected):
                    </Text>
                    <Select
                      value={selectedSubject || ''}
                      onChange={(e) => {
                        setSelectedSubject(e.target.value || undefined);
                        setSelectedQuizId(undefined); // Reset quiz filter when subject changes
                      }}
                      disabled={!!selectedQuizId}
                    >
                      <option value="">All Subjects</option>
                      {analytics && Object.keys(analytics.summary.subjects).map((subject) => (
                        <option key={subject} value={subject}>
                          {subject} ({analytics.summary.subjects[subject].attempts} attempts)
                        </option>
                      ))}
                    </Select>
                  </Box>
                </SimpleGrid>
                {selectedQuizId && (
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Text fontSize="sm">
                      Showing your attempts for:{' '}
                      <strong>
                        {availableQuizzes.find((q) => q.id === selectedQuizId)?.displayName}
                      </strong>
                    </Text>
                  </Alert>
                )}
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">
                    <strong>Note:</strong> You are viewing only your own quiz attempts. Your rank is shown relative to all participants.
                  </Text>
                </Alert>
              </VStack>
            </CardBody>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between" align="center">
                  <Heading size="md">
                    {selectedQuizId
                      ? `📊 My Quiz Attempts: ${availableQuizzes.find((q) => q.id === selectedQuizId)?.displayName || 'Selected Quiz'}`
                      : '📊 My Quiz Attempts'}
                  </Heading>
                  <Badge colorScheme="blue" fontSize="sm" p={2}>
                    {userRecords.length} Attempt{userRecords.length !== 1 ? 's' : ''}
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
                        <Th>Quiz Name</Th>
                        <Th isNumeric>Score</Th>
                        <Th isNumeric>Correct</Th>
                        <Th isNumeric>Time</Th>
                        <Th isNumeric>Composite</Th>
                        <Th>Date</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {userRecords.map((participant: any) => {
                        return (
                          <Tr
                            key={participant.attemptId}
                            bg="blue.50"
                            fontWeight="bold"
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
                              <Text fontSize="sm" fontWeight="semibold">
                                {participant.subject || 'N/A'} - {participant.subtopic || 'N/A'}
                              </Text>
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
                              <Text fontSize="xs" color="gray.600">
                                {participant.timestamp
                                  ? new Date(participant.timestamp).toLocaleDateString()
                                  : 'N/A'}
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

