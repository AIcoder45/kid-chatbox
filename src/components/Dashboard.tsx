/**
 * Dashboard component - Main landing page after login
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Heading,
  SimpleGrid,
  Progress,
} from '@/shared/design-system';
import { authApi, analyticsApi } from '@/services/api';
import { AnalyticsData, User } from '@/types';
import { MESSAGES } from '@/constants/app';

interface DashboardProps {
  user: User;
}

/**
 * Main dashboard showing Study and Quiz options, recent scores, and recommendations
 */
export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await analyticsApi.getAnalytics(user.id);
      setAnalytics(data);
    } catch (error) {
      // If API fails, use mock data for development
      setAnalytics({
        total_quizzes: 0,
        per_subject_accuracy: {},
        per_subtopic_accuracy: {},
        time_spent_studying: 0,
        improvement_trend: [],
        last_three_scores: [],
        strengths: [],
        weaknesses: [],
        recommended_topics: [],
      });
    }
  };

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  const userName = user.name || 'Friend';

  return (
    <Box padding={6} maxWidth="1200px" margin="0 auto">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justifyContent="space-between" alignItems="center">
          <VStack align="start" spacing={1}>
            <Heading size="lg" color="blue.600">
              {MESSAGES.WELCOME}, {userName}! 👋
            </Heading>
            <Text fontSize="md" color="gray.600">
              {MESSAGES.DASHBOARD_GREETING}
            </Text>
          </VStack>
          <Button colorScheme="red" variant="outline" size="md" onClick={handleLogout}>
            Logout
          </Button>
        </HStack>

        {/* Main Action Tiles */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Card
            cursor="pointer"
            _hover={{ transform: 'scale(1.02)', shadow: 'lg' }}
            onClick={() => navigate('/study')}
            height="200px"
          >
            <CardBody display="flex" alignItems="center" justifyContent="center">
              <VStack spacing={4}>
                <Text fontSize="4xl">📚</Text>
                <Heading size="md">{MESSAGES.STUDY_MODE_TITLE}</Heading>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Learn new topics with fun lessons!
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card
            cursor="pointer"
            _hover={{ transform: 'scale(1.02)', shadow: 'lg' }}
            onClick={() => navigate('/quiz')}
            height="200px"
          >
            <CardBody display="flex" alignItems="center" justifyContent="center">
              <VStack spacing={4}>
                <Text fontSize="4xl">🎯</Text>
                <Heading size="md">{MESSAGES.QUIZ_MODE_TITLE}</Heading>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Test your knowledge with quizzes!
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Recent Scores */}
        {analytics && analytics.last_three_scores.length > 0 && (
          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justifyContent="space-between" alignItems="center">
                  <Heading size="md" color="blue.600">
                    {MESSAGES.LAST_SCORES}
                  </Heading>
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="blue"
                    onClick={() => navigate('/quiz-history')}
                  >
                    View All History →
                  </Button>
                </HStack>
                <VStack spacing={2} align="stretch">
                  {analytics.last_three_scores.map((score, index) => (
                    <HStack key={index} justifyContent="space-between">
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold">{score.subject}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {new Date(score.date).toLocaleDateString()}
                        </Text>
                      </VStack>
                      <Box width="200px">
                        <Progress
                          value={score.score}
                          colorScheme={score.score >= 70 ? 'green' : score.score >= 50 ? 'yellow' : 'orange'}
                          size="lg"
                          borderRadius="md"
                        />
                        <Text fontSize="sm" fontWeight="bold" marginTop={1}>
                          {score.score}%
                        </Text>
                      </Box>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Study History Card */}
        <Card>
          <CardBody>
            <HStack justifyContent="space-between" alignItems="center">
              <VStack align="start" spacing={1}>
                <Heading size="md" color="blue.600">
                  Study History
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  View all your past study topics and lessons
                </Text>
              </VStack>
              <Button
                colorScheme="blue"
                onClick={() => navigate('/study-history')}
              >
                View History
              </Button>
            </HStack>
          </CardBody>
        </Card>

        {/* Quiz History Card - Show even if no recent scores */}
        {analytics && analytics.total_quizzes > 0 && (
          <Card>
            <CardBody>
              <HStack justifyContent="space-between" alignItems="center">
                <VStack align="start" spacing={1}>
                  <Heading size="md" color="blue.600">
                    Quiz History
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    View all your past quiz results with questions and answers
                  </Text>
                </VStack>
                <Button
                  colorScheme="blue"
                  onClick={() => navigate('/quiz-history')}
                >
                  View History
                </Button>
              </HStack>
            </CardBody>
          </Card>
        )}

        {/* Recommended Topics */}
        {analytics && analytics.recommended_topics.length > 0 && (
          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md" color="blue.600">
                  {MESSAGES.SUGGESTED_TOPICS}
                </Heading>
                <VStack spacing={2} align="stretch">
                  {analytics.recommended_topics.map((topic, index) => (
                    <Box
                      key={index}
                      padding={3}
                      borderRadius="md"
                      bg="blue.50"
                      borderWidth={1}
                      borderColor="blue.200"
                    >
                      <Text fontSize="sm">{topic}</Text>
                    </Box>
                  ))}
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Motivational Message */}
        <Card bg="green.50" borderColor="green.200">
          <CardBody>
            <Text fontSize="md" color="green.700" textAlign="center" fontWeight="semibold">
              {MESSAGES.MOTIVATIONAL}
            </Text>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

