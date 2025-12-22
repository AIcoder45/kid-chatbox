/**
 * Admin Dashboard Component
 * Main dashboard for admin with KPIs and overview
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
} from '@/shared/design-system';
import { motion } from 'framer-motion';
import { adminApi, AnalyticsSummary } from '@/services/admin';
import { PullToRefresh } from '../PullToRefresh';

// Use motion.div wrapper instead of motion(Card) to avoid TypeScript complexity issues
const MotionCardWrapper = motion.div;

/**
 * Admin Dashboard component
 */
export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAnalyticsSummary();
      setSummary(data.summary);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadSummary();
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
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

  const stats = [
    {
      label: 'Total Users',
      value: summary?.totalUsers || 0,
      color: 'blue',
      icon: '👥',
      route: '/admin/users',
    },
    {
      label: 'Active Users',
      value: summary?.activeUsers || 0,
      color: 'green',
      icon: '✅',
      route: '/admin/users?status=approved',
    },
    {
      label: 'Pending Approval',
      value: summary?.pendingUsers || 0,
      color: 'orange',
      icon: '⏳',
      route: '/admin/users?status=pending',
    },
    {
      label: 'Total Topics',
      value: summary?.totalTopics || 0,
      color: 'purple',
      icon: '📚',
      route: '/admin/topics',
    },
    {
      label: 'Total Quizzes',
      value: summary?.totalQuizzes || 0,
      color: 'teal',
      icon: '📝',
      route: '/admin/quizzes',
    },
    {
      label: 'Quiz Attempts',
      value: summary?.totalAttempts || 0,
      color: 'cyan',
      icon: '🎯',
      route: '/admin/quiz-history',
    },
    {
      label: 'Avg Score',
      value: `${summary?.avgScore.toFixed(1) || 0}%`,
      color: 'pink',
      icon: '⭐',
      route: '/admin/analytics',
    },
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <Box p={{ base: 4, md: 6 }}>
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        <Heading size={{ base: 'md', md: 'lg' }} color="gray.700">
          Admin Dashboard
        </Heading>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: 3, md: 4 }}>
          {stats.map((stat, index) => (
            <MotionCardWrapper
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card
                cursor="pointer"
                onClick={() => handleCardClick(stat.route)}
                _hover={{ shadow: 'lg' }}
              >
                <CardBody p={{ base: 4, md: 6 }}>
                  <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                      <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600">
                        {stat.label}
                      </Text>
                      <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color={`${stat.color}.600`}>
                        {stat.value}
                      </Text>
                    </VStack>
                    <Text fontSize={{ base: '2xl', md: '3xl' }}>{stat.icon}</Text>
                  </HStack>
                </CardBody>
              </Card>
            </MotionCardWrapper>
          ))}
        </SimpleGrid>

        {summary && summary.pendingUsers > 0 && (
          <MotionCardWrapper
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Card
              cursor="pointer"
              onClick={() => handleCardClick('/admin/users?status=pending')}
              _hover={{ shadow: 'lg' }}
            >
              <CardHeader>
                <HStack>
                  <Text fontWeight="bold">Action Required</Text>
                  <Badge colorScheme="orange">{summary.pendingUsers}</Badge>
                </HStack>
              </CardHeader>
              <CardBody>
                <Text>
                  You have {summary.pendingUsers} user{summary.pendingUsers > 1 ? 's' : ''} waiting
                  for approval. Review them in the User Management section.
                </Text>
              </CardBody>
            </Card>
          </MotionCardWrapper>
        )}
      </VStack>
    </Box>
    </PullToRefresh>
  );
};

