/**
 * System Performance Analytics Component
 * Displays system and admin activity analytics
 */

import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Heading,
  Spinner,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
} from '@/shared/design-system';
import { Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { adminApi } from '@/services/admin';

interface SystemAnalyticsProps {
  filterParams: Record<string, string>;
}

/**
 * System Analytics component
 */
export const SystemAnalytics: React.FC<SystemAnalyticsProps> = ({ filterParams }) => {
  const [loading, setLoading] = useState(true);
  interface SummaryData {
    totalTopics?: number;
    totalQuizzes?: number;
    totalAttempts?: number;
    avgScore?: number;
  }

  interface TopicDataItem {
    title?: string;
    quiz_count?: string | number;
    attempt_count?: string | number;
  }

  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [topicData, setTopicData] = useState<TopicDataItem[]>([]);

  useEffect(() => {
    loadData();
  }, [filterParams]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [summaryResponse, topicsResponse] = await Promise.all([
        adminApi.getAnalyticsSummary(),
        adminApi.getTopicAnalytics(),
      ]);

      setSummary(summaryResponse.summary);
      setTopicData((topicsResponse.topics as any[]) || []);
    } catch (error) {
      console.error('Failed to load system analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner />
      </Box>
    );
  }

  const topicsCreatedData = topicData.map((topic: TopicDataItem) => ({
    name: topic.title || 'Unknown',
    quizzes: parseInt(String(topic.quiz_count || 0), 10),
    attempts: parseInt(String(topic.attempt_count || 0), 10),
  }));

  return (
    <VStack spacing={6} align="stretch" mt={4}>
      <Heading size="md">System Performance Analytics</Heading>

      {/* Summary Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Topics</StatLabel>
              <StatNumber>{summary?.totalTopics || 0}</StatNumber>
              <StatHelpText>Active topics</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Quizzes</StatLabel>
              <StatNumber>{summary?.totalQuizzes || 0}</StatNumber>
              <StatHelpText>Active quizzes</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Quiz Attempts</StatLabel>
              <StatNumber>{summary?.totalAttempts || 0}</StatNumber>
              <StatHelpText>Total attempts</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Avg Score</StatLabel>
              <StatNumber>{(summary?.avgScore || 0).toFixed(1)}%</StatNumber>
              <StatHelpText>Platform average</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Topics Performance */}
      <Card>
        <CardHeader>
          <Text fontWeight="bold">Topics Performance</Text>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topicsCreatedData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quizzes" fill="#0088FE" name="Quizzes" />
              <Bar dataKey="attempts" fill="#00C49F" name="Attempts" />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </VStack>
  );
};

