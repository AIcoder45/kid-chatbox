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
  Badge,
} from '@/shared/design-system';
import { analyticsApi, planApi } from '@/services/api';
import { AnalyticsData, User } from '@/types';
import { MESSAGES } from '@/constants/app';
import { UpcomingTestsSidebar } from './UpcomingTestsSidebar';
import { StudentUpcomingTestsMarquee } from '@/components/layout/StudentUpcomingTestsMarquee';

interface DashboardProps {
  user: User;
}

/**
 * Main dashboard showing Study and Quiz options, recent scores, and recommendations
 */
interface PlanInfo {
  plan: {
    id: string;
    name: string;
    description: string | null;
    daily_quiz_limit: number;
    daily_topic_limit: number;
    monthly_cost: number;
    status: string;
  };
  usage: {
    quizCount: number;
    topicCount: number;
    date: string;
  };
  limits: {
    dailyQuizLimit: number;
    dailyTopicLimit: number;
    remainingQuizzes: number;
    remainingTopics: number;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [planLoading, setPlanLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
    loadPlanInfo();
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

  const loadPlanInfo = async () => {
    try {
      setPlanLoading(true);
      const data = await planApi.getUserPlan(user.id);
      setPlanInfo(data);
    } catch (error) {
      console.error('Failed to load plan info:', error);
      // Set default freemium plan if API fails
      setPlanInfo({
        plan: {
          id: 'freemium',
          name: 'Freemium Plan',
          description: 'Free plan with basic limits',
          daily_quiz_limit: 1,
          daily_topic_limit: 1,
          monthly_cost: 0,
          status: 'active',
        },
        usage: {
          quizCount: 0,
          topicCount: 0,
          date: new Date().toISOString().split('T')[0],
        },
        limits: {
          dailyQuizLimit: 1,
          dailyTopicLimit: 1,
          remainingQuizzes: 1,
          remainingTopics: 1,
        },
      });
    } finally {
      setPlanLoading(false);
    }
  };


  const userName = user.name || 'Friend';

  return (
    <Box padding={{ base: 4, md: 6 }} maxWidth="1400px" margin="0 auto">
      <VStack spacing={{ base: 3, md: 4 }} align="stretch">
        {/* Header */}
        <VStack align="start" spacing={1}>
          <Heading size={{ base: 'md', md: 'lg' }} color="blue.600">
            {MESSAGES.WELCOME}, {userName}! 👋
          </Heading>
          <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600">
            {MESSAGES.DASHBOARD_GREETING}
          </Text>
        </VStack>

        {/* Upcoming Tests Marquee */}
        <StudentUpcomingTestsMarquee />

        {/* Action Cards, Recent Scores, Plan Box, and Upcoming Tests Row */}
        <HStack align="start" spacing={{ base: 3, md: 4 }} flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
          {/* Left Content Area - Action Cards and Recent Scores */}
          <Box flex={1} minW={{ base: '100%', lg: '0' }}>
            <VStack spacing={3} align="stretch">
              {/* Main Action Tiles */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 3, md: 4 }}>
                <Card
                  cursor={planInfo && planInfo.limits.remainingTopics === 0 ? 'not-allowed' : 'pointer'}
                  _hover={
                    planInfo && planInfo.limits.remainingTopics === 0
                      ? {}
                      : { transform: 'scale(1.02)', shadow: 'lg' }
                  }
                  onClick={() => {
                    if (planInfo && planInfo.limits.remainingTopics === 0) {
                      return;
                    }
                    navigate('/study');
                  }}
                  height={{ base: 'auto', md: '200px' }}
                  minH={{ base: '150px', md: '200px' }}
                  opacity={planInfo && planInfo.limits.remainingTopics === 0 ? 0.6 : 1}
                  position="relative"
                >
                  {planInfo && planInfo.limits.remainingTopics === 0 && (
                    <Badge
                      position="absolute"
                      top={2}
                      right={2}
                      colorScheme="red"
                      fontSize="xs"
                      zIndex={1}
                    >
                      Limit Reached
                    </Badge>
                  )}
                  <CardBody display="flex" alignItems="center" justifyContent="center">
                    <VStack spacing={4}>
                      <Text fontSize="4xl">📚</Text>
                      <Heading size="md">{MESSAGES.STUDY_MODE_TITLE}</Heading>
                      <Text fontSize="sm" color="gray.600" textAlign="center">
                        {planInfo && planInfo.limits.remainingTopics === 0
                          ? 'Daily topic limit reached. Try again tomorrow!'
                          : 'Learn new topics with fun lessons!'}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>

                <Card
                  cursor={planInfo && planInfo.limits.remainingQuizzes === 0 ? 'not-allowed' : 'pointer'}
                  _hover={
                    planInfo && planInfo.limits.remainingQuizzes === 0
                      ? {}
                      : { transform: 'scale(1.02)', shadow: 'lg' }
                  }
                  onClick={() => {
                    if (planInfo && planInfo.limits.remainingQuizzes === 0) {
                      return;
                    }
                    navigate('/quiz');
                  }}
                  height={{ base: 'auto', md: '200px' }}
                  minH={{ base: '150px', md: '200px' }}
                  opacity={planInfo && planInfo.limits.remainingQuizzes === 0 ? 0.6 : 1}
                  position="relative"
                >
                  {planInfo && planInfo.limits.remainingQuizzes === 0 && (
                    <Badge
                      position="absolute"
                      top={2}
                      right={2}
                      colorScheme="red"
                      fontSize="xs"
                      zIndex={1}
                    >
                      Limit Reached
                    </Badge>
                  )}
                  <CardBody display="flex" alignItems="center" justifyContent="center">
                    <VStack spacing={4}>
                      <Text fontSize="4xl">🎯</Text>
                      <Heading size="md">{MESSAGES.QUIZ_MODE_TITLE}</Heading>
                      <Text fontSize="sm" color="gray.600" textAlign="center">
                        {planInfo && planInfo.limits.remainingQuizzes === 0
                          ? 'Daily quiz limit reached. Try again tomorrow!'
                          : 'Test your knowledge with quizzes!'}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>

              {/* Recent Scores */}
              {analytics && analytics.last_three_scores.length > 0 && (
                <Card>
                  <CardBody p={4}>
                    <VStack spacing={3} align="stretch">
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
                          <HStack
                            key={index}
                            justifyContent="space-between"
                            flexWrap="wrap"
                            spacing={{ base: 2, md: 4 }}
                          >
                            <VStack align="start" spacing={0} flex={1} minW={{ base: '100%', sm: 'auto' }}>
                              <Text fontWeight="semibold" fontSize={{ base: 'sm', md: 'md' }}>
                                {score.subject}
                              </Text>
                              <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600">
                                {new Date(score.date).toLocaleDateString()}
                              </Text>
                            </VStack>
                            <Box width={{ base: '100%', sm: '200px' }} mt={{ base: 2, sm: 0 }}>
                              <Progress
                                value={score.score}
                                colorScheme={score.score >= 70 ? 'green' : score.score >= 50 ? 'yellow' : 'orange'}
                                size="lg"
                                borderRadius="md"
                              />
                              <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="bold" marginTop={1}>
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
                <CardBody p={4}>
                  <HStack
                    justifyContent="space-between"
                    alignItems={{ base: 'start', md: 'center' }}
                    flexWrap="wrap"
                    spacing={{ base: 4, md: 0 }}
                  >
                    <VStack align="start" spacing={1} flex={1} minW={{ base: '100%', md: 'auto' }}>
                      <Heading size={{ base: 'sm', md: 'md' }} color="blue.600">
                        Study History
                      </Heading>
                      <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600">
                        View all your past study topics and lessons
                      </Text>
                    </VStack>
                    <Button
                      colorScheme="blue"
                      onClick={() => navigate('/study-history')}
                      size={{ base: 'sm', md: 'md' }}
                      w={{ base: '100%', md: 'auto' }}
                      mt={{ base: 2, md: 0 }}
                    >
                      View History
                    </Button>
                  </HStack>
                </CardBody>
              </Card>

              {/* Quiz History Card */}
              {analytics && analytics.total_quizzes > 0 && (
                <Card>
                  <CardBody p={4}>
                    <HStack
                      justifyContent="space-between"
                      alignItems={{ base: 'start', md: 'center' }}
                      flexWrap="wrap"
                      spacing={{ base: 4, md: 0 }}
                    >
                      <VStack align="start" spacing={1} flex={1} minW={{ base: '100%', md: 'auto' }}>
                        <Heading size={{ base: 'sm', md: 'md' }} color="blue.600">
                          Quiz History
                        </Heading>
                        <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600">
                          View all your past quiz results with questions and answers
                        </Text>
                      </VStack>
                      <Button
                        colorScheme="blue"
                        onClick={() => navigate('/quiz-history')}
                        size={{ base: 'sm', md: 'md' }}
                        w={{ base: '100%', md: 'auto' }}
                        mt={{ base: 2, md: 0 }}
                      >
                        View History
                      </Button>
                    </HStack>
                  </CardBody>
                </Card>
              )}
            </VStack>
          </Box>

          {/* Right Sidebar - Plan Info and Upcoming Tests */}
          <VStack spacing={3} align="stretch" w={{ base: '100%', lg: 'auto' }}>
            {/* Plan Information Card */}
            {planInfo && !planLoading && (
              <Box w={{ base: '100%', lg: '350px' }} alignSelf="start">
                <Card
                  bg="gradient"
                  bgGradient="linear(to-br, blue.50, purple.50)"
                  borderWidth={2}
                  borderColor="blue.200"
                  boxShadow="lg"
                  height={{ base: 'auto', md: '200px' }}
                  minH={{ base: '150px', md: '200px' }}
                >
                  <CardBody>
                    <VStack spacing={3} align="stretch" h="100%" justify="space-between">
                      <VStack align="start" spacing={1}>
                        <HStack spacing={2} flexWrap="wrap">
                          <Heading size={{ base: 'sm', md: 'md' }} color="blue.700">
                            Your Plan
                          </Heading>
                          {typeof planInfo.plan.monthly_cost === 'number' && planInfo.plan.monthly_cost > 0 ? (
                            <Badge colorScheme="green" fontSize={{ base: 'xs', md: 'sm' }}>
                              ${typeof planInfo.plan.monthly_cost === 'number' ? planInfo.plan.monthly_cost.toFixed(2) : '0.00'}/mo
                            </Badge>
                          ) : (
                            <Badge colorScheme="blue" fontSize={{ base: 'xs', md: 'sm' }}>
                              Free
                            </Badge>
                          )}
                        </HStack>
                        <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="blue.800">
                          {planInfo.plan.name}
                        </Text>
                      </VStack>

                      <VStack spacing={2} align="stretch" flex={1}>
                        {/* Daily Quiz Limit - Compact */}
                        <Box>
                          <HStack justifyContent="space-between" mb={1}>
                            <Text fontSize="xs" fontWeight="semibold" color="gray.700">
                              📝 Quiz: {planInfo.usage.quizCount}/{planInfo.limits.dailyQuizLimit}
                            </Text>
                            <Text
                              fontSize="xs"
                              fontWeight="bold"
                              color={planInfo.limits.remainingQuizzes === 0 ? 'red.600' : 'green.600'}
                            >
                              {planInfo.limits.remainingQuizzes} left
                            </Text>
                          </HStack>
                          <Progress
                            value={(planInfo.usage.quizCount / planInfo.limits.dailyQuizLimit) * 100}
                            colorScheme={
                              planInfo.limits.remainingQuizzes === 0
                                ? 'red'
                                : planInfo.limits.remainingQuizzes <= planInfo.limits.dailyQuizLimit * 0.3
                                  ? 'orange'
                                  : 'green'
                            }
                            size="sm"
                            borderRadius="md"
                          />
                        </Box>

                        {/* Daily Topic Limit - Compact */}
                        <Box>
                          <HStack justifyContent="space-between" mb={1}>
                            <Text fontSize="xs" fontWeight="semibold" color="gray.700">
                              📚 Topic: {planInfo.usage.topicCount}/{planInfo.limits.dailyTopicLimit}
                            </Text>
                            <Text
                              fontSize="xs"
                              fontWeight="bold"
                              color={planInfo.limits.remainingTopics === 0 ? 'red.600' : 'green.600'}
                            >
                              {planInfo.limits.remainingTopics} left
                            </Text>
                          </HStack>
                          <Progress
                            value={(planInfo.usage.topicCount / planInfo.limits.dailyTopicLimit) * 100}
                            colorScheme={
                              planInfo.limits.remainingTopics === 0
                                ? 'red'
                                : planInfo.limits.remainingTopics <= planInfo.limits.dailyTopicLimit * 0.3
                                  ? 'orange'
                                  : 'green'
                            }
                            size="sm"
                            borderRadius="md"
                          />
                        </Box>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              </Box>
            )}

            {/* Upcoming Tests Sidebar */}
            <UpcomingTestsSidebar />
          </VStack>
        </HStack>

        {/* Recommended Topics */}
        {analytics && analytics.recommended_topics.length > 0 && (
          <HStack align="start" spacing={{ base: 3, md: 4 }} flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
            <Box flex={1} minW={{ base: '100%', lg: '0' }}>
              <Card>
                <CardBody p={4}>
                  <VStack spacing={3} align="stretch">
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
            </Box>
            {/* Right Sidebar Spacer */}
            <Box w={{ base: '0', lg: '350px' }} display={{ base: 'none', lg: 'block' }} />
          </HStack>
        )}

        {/* Motivational Message */}
        <HStack align="start" spacing={{ base: 3, md: 4 }} flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
          <Box flex={1} minW={{ base: '100%', lg: '0' }}>
            <Card bg="green.50" borderColor="green.200">
              <CardBody p={4}>
                <Text
                  fontSize={{ base: 'sm', md: 'md' }}
                  color="green.700"
                  textAlign="center"
                  fontWeight="semibold"
                >
                  {MESSAGES.MOTIVATIONAL}
                </Text>
              </CardBody>
            </Card>
          </Box>
          {/* Right Sidebar Spacer */}
          <Box w={{ base: '0', lg: '350px' }} display={{ base: 'none', lg: 'block' }} />
        </HStack>
      </VStack>
    </Box>
  );
};

