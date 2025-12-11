/**
 * Engagement Analytics Component
 * Displays engagement-related analytics
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
} from '@/shared/design-system';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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

interface EngagementAnalyticsProps {
  filterParams: Record<string, string>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

/**
 * Engagement Analytics component
 */
export const EngagementAnalytics: React.FC<EngagementAnalyticsProps> = ({ filterParams }) => {
  const [loading, setLoading] = useState(true);
  const [engagementData, setEngagementData] = useState<any>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminApi.getEngagementAnalytics(filterParams);
      setEngagementData(response.engagement);
    } catch (error) {
      console.error('Failed to load engagement analytics:', error);
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

  interface EngagementItem {
    date?: string;
    week?: string;
    count?: string | number;
    hour?: string | number;
  }

  const dauData = (engagementData?.dailyActiveUsers || []).map((item: EngagementItem) => ({
    date: item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
    users: parseInt(String(item.count || 0), 10),
  }));

  const wauData = (engagementData?.weeklyActiveUsers || []).map((item: EngagementItem) => ({
    week: item.week ? new Date(item.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
    users: parseInt(String(item.count || 0), 10),
  }));

  const sessionDurationData = engagementData?.sessionDuration || [];
  const activeHoursData = (engagementData?.activeHours || []).map((item: EngagementItem) => ({
    hour: `${item.hour || 0}:00`,
    count: parseInt(String(item.count || 0), 10),
  }));

  return (
    <VStack spacing={6} align="stretch" mt={4}>
      <Heading size="md">Engagement Analytics</Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {/* Daily Active Users */}
        <Card>
          <CardHeader>
            <Text fontWeight="bold">Daily Active Users (DAU)</Text>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dauData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="users" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Weekly Active Users */}
        <Card>
          <CardHeader>
            <Text fontWeight="bold">Weekly Active Users (WAU)</Text>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={wauData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#00C49F" name="Active Users" />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Session Duration Distribution */}
        <Card>
          <CardHeader>
            <Text fontWeight="bold">Session Duration Distribution</Text>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sessionDurationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props) => {
                    const entry = props as unknown as { duration_range?: string; count?: number };
                    return `${entry.duration_range || 'Unknown'}: ${entry.count || 0}`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {sessionDurationData.map((_entry: { duration_range?: string; count?: number }, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Most Active Hours */}
        <Card>
          <CardHeader>
            <Text fontWeight="bold">Most Active Hours of the Day</Text>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activeHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#FFBB28" name="Activity Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </SimpleGrid>
    </VStack>
  );
};

