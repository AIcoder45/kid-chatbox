/**
 * User Analytics Component
 * Displays user-related analytics with various chart types
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
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { adminApi } from '@/services/admin';

interface UserAnalyticsProps {
  filterParams: Record<string, string>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

/**
 * User Analytics component
 */
export const UserAnalytics: React.FC<UserAnalyticsProps> = ({ filterParams }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<unknown[]>([]);
  const [ageGroupData, setAgeGroupData] = useState<Array<{ age_group: string; user_count: number }>>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const usersResponse = await adminApi.getUserAnalytics(filterParams);

        setUserData(usersResponse.users as unknown[]);
        
        // Get age group distribution - simplified version
        setAgeGroupData([]);
      } catch (error) {
        console.error('Failed to load user analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterParams]);

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner />
      </Box>
    );
  }

  // Prepare chart data
  interface UserDataItem {
    name?: string;
    quiz_attempts?: string | number;
    avg_score?: string | number;
    total_study_time?: string | number;
  }

  const userGrowthData = (userData as UserDataItem[]).slice(0, 10).map((user: UserDataItem) => ({
    name: user.name || 'Unknown',
    quizAttempts: parseInt(String(user.quiz_attempts || 0), 10),
    avgScore: parseFloat(String(user.avg_score || 0)),
    studyTime: parseInt(String(user.total_study_time || 0), 10),
  }));

  return (
    <VStack spacing={6} align="stretch" mt={4}>
      <Heading size="md">User Analytics</Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {/* User Activity Bar Chart */}
        <Card>
          <CardHeader>
            <Text fontWeight="bold">Top Users by Quiz Attempts</Text>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quizAttempts" fill="#0088FE" name="Quiz Attempts" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Average Score Line Chart */}
        <Card>
          <CardHeader>
            <Text fontWeight="bold">Average Scores by User</Text>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgScore" stroke="#00C49F" name="Avg Score %" />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Study Time Area Chart */}
        <Card>
          <CardHeader>
            <Text fontWeight="bold">Study Time Distribution</Text>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="studyTime" stroke="#8884d8" fill="#8884d8" name="Study Time (min)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Age Group Distribution Pie Chart */}
        {ageGroupData.length > 0 && (
          <Card>
            <CardHeader>
              <Text fontWeight="bold">Users by Age Group</Text>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ageGroupData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props) => {
                      const entry = props as unknown as { age_group?: string; user_count?: number };
                      return `${entry.age_group || 'Unknown'}: ${entry.user_count || 0}`;
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="user_count"
                  >
                    {ageGroupData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        )}
      </SimpleGrid>
    </VStack>
  );
};

