/**
 * Analytics Insights Component
 * Displays automated insights and recommendations
 */

import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  List,
  ListItem,
  ListIcon,
} from '@/shared/design-system';
import { adminApi } from '@/services/admin';

/**
 * Analytics Insights component
 */
export const AnalyticsInsights: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<Array<{
    type: string;
    title: string;
    message: string;
    data: unknown[];
    recommendation: string;
  }>>([]);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getInsights();
      setInsights(response.insights || []);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <Spinner size="sm" />
      </Box>
    );
  }

  if (insights.length === 0) {
    return (
      <Card>
        <CardBody>
          <Alert status="success">
            <AlertIcon />
            <AlertTitle>All Good!</AlertTitle>
            <AlertDescription>No critical issues detected. Platform is performing well.</AlertDescription>
          </Alert>
        </CardBody>
      </Card>
    );
  }

  const getAlertStatus = (type: string) => {
    switch (type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Heading size="md">Insights & Recommendations</Heading>

      {insights.map((insight, index) => (
        <Card key={index}>
          <CardHeader>
            <HStack justify="space-between">
              <Heading size="sm">{insight.title}</Heading>
              <Badge colorScheme={insight.type === 'error' ? 'red' : insight.type === 'warning' ? 'orange' : 'blue'}>
                {insight.type}
              </Badge>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" spacing={3}>
              <Alert status={getAlertStatus(insight.type)}>
                <AlertIcon />
                <Box>
                  <AlertTitle>{insight.message}</AlertTitle>
                  <AlertDescription mt={2}>
                    <Text fontWeight="bold">Recommendation:</Text>
                    <Text>{insight.recommendation}</Text>
                  </AlertDescription>
                </Box>
              </Alert>

              {insight.data && Array.isArray(insight.data) && insight.data.length > 0 && (
                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Details:
                  </Text>
                  <List spacing={1}>
                  {(insight.data as Array<{ title?: string; name?: string; email?: string }>).slice(0, 5).map((item, idx: number) => (
                    <ListItem key={idx}>
                      <ListIcon />
                      {item.title || item.name || item.email || JSON.stringify(item)}
                    </ListItem>
                  ))}
                  </List>
                </Box>
              )}
            </VStack>
          </CardBody>
        </Card>
      ))}
    </VStack>
  );
};

