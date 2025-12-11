/**
 * Study Analytics Component
 * Displays study-related analytics
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
} from 'recharts';
import { adminApi } from '@/services/admin';

interface StudyAnalyticsProps {
  filterParams: Record<string, string>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

/**
 * Study Analytics component
 */
export const StudyAnalytics: React.FC<StudyAnalyticsProps> = ({ filterParams }) => {
  const [loading, setLoading] = useState(true);
  const [studyData, setStudyData] = useState<any>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminApi.getStudyAnalytics(filterParams);
      setStudyData(response.study);
    } catch (error) {
      console.error('Failed to load study analytics:', error);
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

  interface StudyItem {
    title?: string;
    total_views?: string | number;
    unique_students?: string | number;
  }

  const mostStudiedData = (studyData?.mostStudied || []).slice(0, 10).map((item: StudyItem) => ({
    name: item.title || 'Unknown',
    views: parseInt(String(item.total_views || 0), 10),
    students: parseInt(String(item.unique_students || 0), 10),
  }));

  const leastStudiedData = (studyData?.leastStudied || []).slice(0, 10).map((item: StudyItem) => ({
    name: item.title || 'Unknown',
    views: parseInt(String(item.total_views || 0), 10),
  }));

  const completionData = [
    { name: 'Completed', value: studyData?.completionRate || 0 },
    { name: 'Not Completed', value: 100 - (studyData?.completionRate || 0) },
  ];

  return (
    <VStack spacing={6} align="stretch" mt={4}>
      <Heading size="md">Study Analytics</Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {/* Most Studied Topics */}
        <Card>
          <CardHeader>
            <Text fontWeight="bold">Most Studied Topics</Text>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mostStudiedData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#0088FE" name="Total Views" />
                <Bar dataKey="students" fill="#00C49F" name="Unique Students" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Least Studied Topics */}
        <Card>
          <CardHeader>
            <Text fontWeight="bold">Least Studied Topics</Text>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leastStudiedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#FF8042" name="Views" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Completion Rate */}
        <Card>
          <CardHeader>
            <Text fontWeight="bold">Study Completion Rate</Text>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {completionData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Average Study Time */}
        <Card>
          <CardHeader>
            <Text fontWeight="bold">Average Study Time</Text>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="center" h="300px" justify="center">
              <Text fontSize="4xl" fontWeight="bold" color="blue.500">
                {Math.round((studyData?.avgStudyTime || 0) / 60)} min
              </Text>
              <Text color="gray.600">Per session</Text>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </VStack>
  );
};

