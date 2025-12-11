/**
 * Quiz Analytics Component
 * Displays quiz-related analytics
 */

import { useState, useEffect, useCallback } from 'react';
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@/shared/design-system';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { adminApi } from '@/services/admin';

interface QuizAnalyticsProps {
  filterParams: Record<string, string>;
}

/**
 * Quiz Analytics component
 */
export const QuizAnalytics: React.FC<QuizAnalyticsProps> = ({ filterParams }) => {
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState<any>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminApi.getQuizAnalytics(filterParams);
      setQuizData(response.quizzes);
    } catch (error) {
      console.error('Failed to load quiz analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [filterParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner />
      </Box>
    );
  }

  interface QuizItem {
    name?: string;
    total_attempts?: string | number;
    unique_students?: string | number;
    avg_score?: string | number;
    difficulty?: string;
    passed?: string | number;
  }

  const mostAttemptedData = (quizData?.mostAttempted || []).slice(0, 10).map((item: QuizItem) => ({
    name: item.name || 'Unknown',
    attempts: parseInt(String(item.total_attempts || 0), 10),
    students: parseInt(String(item.unique_students || 0), 10),
    avgScore: parseFloat(String(item.avg_score || 0)),
  }));

  const successByDifficultyData = (quizData?.successByDifficulty || []).map((item: QuizItem) => ({
    difficulty: item.difficulty || 'Unknown',
    successRate: parseFloat(String(item.passed || 0)) / (parseFloat(String(item.total_attempts || 1))) * 100 || 0,
    avgScore: parseFloat(String(item.avg_score || 0)),
  }));

  return (
    <VStack spacing={6} align="stretch" mt={4}>
      <Heading size="md">Quiz Analytics</Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {/* Most Attempted Quizzes */}
        <Card>
          <CardHeader>
            <Text fontWeight="bold">Most Attempted Quizzes</Text>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mostAttemptedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attempts" fill="#0088FE" name="Attempts" />
                <Bar dataKey="students" fill="#00C49F" name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Success Rate by Difficulty */}
        <Card>
          <CardHeader>
            <Text fontWeight="bold">Success Rate by Difficulty</Text>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={successByDifficultyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="difficulty" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="successRate" fill="#00C49F" name="Success Rate %" />
                <Bar dataKey="avgScore" fill="#FFBB28" name="Avg Score %" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Radar Chart for Quiz Performance */}
        {mostAttemptedData.length > 0 && (
          <Card>
            <CardHeader>
              <Text fontWeight="bold">Top Quiz Performance Metrics</Text>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={mostAttemptedData.slice(0, 5)}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis />
                  <Radar name="Attempts" dataKey="attempts" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
                  <Radar name="Students" dataKey="students" stroke="#00C49F" fill="#00C49F" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        )}

        {/* High Error Rate Questions */}
        <Card>
          <CardHeader>
            <Text fontWeight="bold">Questions with High Error Rate</Text>
          </CardHeader>
          <CardBody>
            <Box maxH="300px" overflowY="auto">
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Question</Th>
                    <Th>Error Rate</Th>
                    <Th>Attempts</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {(quizData?.highErrorRateQuestions || []).slice(0, 5).map((item: { question_text?: string; error_rate?: string | number; total_attempts?: string | number }, index: number) => (
                    <Tr key={index}>
                      <Td>
                        <Text noOfLines={2} maxW="300px">
                          {item.question_text || 'N/A'}
                        </Text>
                      </Td>
                      <Td>{parseFloat(String(item.error_rate || 0)).toFixed(1)}%</Td>
                      <Td>{item.total_attempts || 0}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>
    </VStack>
  );
};

