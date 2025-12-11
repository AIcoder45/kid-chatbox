/**
 * Upcoming Tests Sidebar Component
 * Displays upcoming scheduled tests in a vertical sidebar on the right side
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  CardBody,
  Badge,
  Button,
  Spinner,
} from '@/shared/design-system';
import { scheduledTestsApi } from '@/services/api';

interface ScheduledTest {
  id: string;
  quizId: string;
  quizName: string;
  scheduledFor: string;
  visibleFrom: string;
  visibleUntil?: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  numberOfQuestions: number;
  timeLimit?: number;
}

/**
 * Formats date for display
 * @param dateString - ISO date string to format
 * @returns Formatted date string
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Upcoming Tests Sidebar component
 */
export const UpcomingTestsSidebar: React.FC = () => {
  const navigate = useNavigate();
  const [upcomingTests, setUpcomingTests] = useState<ScheduledTest[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches upcoming scheduled tests for the current student
   */
  const loadUpcomingTests = useCallback(async () => {
    try {
      setLoading(true);
      const now = new Date();
      const data = await scheduledTestsApi.getMyScheduledTests();

      // Map snake_case fields from database to camelCase
      const mappedTests = data.scheduledTests.map((test: unknown) => {
        const t = test as Record<string, unknown>;
        return {
          id: t.id as string,
          quizId: (t.quiz_id || t.quizId) as string,
          quizName: (t.quiz_name || t.quizName) as string,
          scheduledFor: (t.scheduled_for || t.scheduledFor) as string,
          visibleFrom: (t.visible_from || t.visibleFrom) as string,
          visibleUntil: (t.visible_until || t.visibleUntil) as string | undefined,
          status: t.status as 'scheduled' | 'active' | 'completed' | 'cancelled',
          numberOfQuestions: (t.number_of_questions || t.numberOfQuestions) as number,
          timeLimit: (t.time_limit || t.timeLimit) as number | undefined,
        } as ScheduledTest;
      });

      // Filter for upcoming tests (scheduledFor > now) and status is scheduled
      const upcoming = mappedTests.filter((test) => {
        if (!test.scheduledFor || test.status !== 'scheduled') {
          return false;
        }
        const scheduledFor = new Date(test.scheduledFor);
        return !isNaN(scheduledFor.getTime()) && scheduledFor > now;
      });

      // Sort by scheduledFor date (earliest first)
      upcoming.sort((a, b) => {
        const dateA = new Date(a.scheduledFor).getTime();
        const dateB = new Date(b.scheduledFor).getTime();
        return dateA - dateB;
      });

      // Limit to 5 most upcoming tests
      setUpcomingTests(upcoming.slice(0, 5));
    } catch (err) {
      // Silently fail - don't show error
      setUpcomingTests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUpcomingTests();
    // Refresh every 5 minutes
    const interval = setInterval(loadUpcomingTests, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadUpcomingTests]);

  const handleStartQuiz = (test: ScheduledTest) => {
    navigate(`/quiz?scheduledTestId=${test.id}`);
  };

  if (loading) {
    return (
      <Box w={{ base: '100%', lg: '300px' }} position={{ base: 'relative', lg: 'sticky' }} top={{ lg: '100px' }}>
        <Card>
          <CardBody>
            <VStack spacing={4}>
              <Heading size="sm" color="blue.600">
                📅 Upcoming Tests
              </Heading>
              <Spinner size="sm" />
            </VStack>
          </CardBody>
        </Card>
      </Box>
    );
  }

  if (upcomingTests.length === 0) {
    return null;
  }

  return (
    <Box
      w={{ base: '100%', lg: '300px' }}
      position={{ base: 'relative', lg: 'sticky' }}
      top={{ lg: '100px' }}
      alignSelf="start"
    >
      <Card borderWidth={2} borderColor="blue.200" bg="blue.50" _dark={{ bg: 'blue.900' }}>
        <CardBody p={4}>
          <VStack spacing={3} align="stretch">
            <Heading size="sm" color="blue.700" _dark={{ color: 'blue.300' }}>
              📅 Upcoming Tests
            </Heading>

            <VStack spacing={2} align="stretch">
              {upcomingTests.map((test) => {
                const now = new Date();
                const visibleFrom = new Date(test.visibleFrom);
                const isAvailable = visibleFrom <= now;
                
                return (
                  <Box
                    key={test.id}
                    p={3}
                    bg="white"
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="blue.200"
                    _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
                  >
                    <VStack spacing={2} align="stretch">
                      <HStack justify="space-between">
                        <Text fontSize="sm" fontWeight="bold" color="blue.700" _dark={{ color: 'blue.300' }} noOfLines={2}>
                          {test.quizName || 'Untitled Quiz'}
                        </Text>
                        <Badge colorScheme={isAvailable ? 'green' : 'blue'} fontSize="xs">
                          {isAvailable ? 'Available' : 'Upcoming'}
                        </Badge>
                      </HStack>

                      <VStack spacing={1} align="start" fontSize="xs" color="gray.600" _dark={{ color: 'gray.400' }}>
                        <Text>
                          <Text as="span" fontWeight="semibold">Date:</Text> {formatDate(test.scheduledFor)}
                        </Text>
                        <Text>
                          <Text as="span" fontWeight="semibold">Questions:</Text> {test.numberOfQuestions}
                        </Text>
                        {test.timeLimit && (
                          <Text>
                            <Text as="span" fontWeight="semibold">Time:</Text> {test.timeLimit} min
                          </Text>
                        )}
                      </VStack>

                      {isAvailable ? (
                        <Button
                          size="xs"
                          colorScheme="blue"
                          variant="solid"
                          w="100%"
                          onClick={() => handleStartQuiz(test)}
                        >
                          Start Quiz
                        </Button>
                      ) : (
                        <Button
                          size="xs"
                          colorScheme="blue"
                          variant="outline"
                          w="100%"
                          isDisabled
                        >
                          Upcoming
                        </Button>
                      )}
                    </VStack>
                  </Box>
                );
              })}
            </VStack>

            <Button
              size="sm"
              variant="ghost"
              colorScheme="blue"
              onClick={() => navigate('/scheduled-tests')}
              w="100%"
            >
              View All Tests →
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

