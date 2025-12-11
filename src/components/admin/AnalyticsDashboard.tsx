/**
 * Comprehensive Analytics Dashboard Component
 * Main analytics dashboard with all chart types and insights
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  Input,
  Card,
  CardBody,
} from '@/shared/design-system';
import { UserAnalytics } from './analytics/UserAnalytics';
import { StudyAnalytics } from './analytics/StudyAnalytics';
import { QuizAnalytics } from './analytics/QuizAnalytics';
import { EngagementAnalytics } from './analytics/EngagementAnalytics';
import { SystemAnalytics } from './analytics/SystemAnalytics';
import { AnalyticsInsights } from './analytics/AnalyticsInsights';

/**
 * Analytics Dashboard component
 */
export const AnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [ageGroup, setAgeGroup] = useState<string>('');

  useEffect(() => {
    const today = new Date();
    const end = today.toISOString().split('T')[0];
    let start: Date;

    switch (dateRange) {
      case '7d':
        start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        start = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        start = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        return;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end);
  }, [dateRange]);

  const getFilterParams = useCallback(() => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (ageGroup) params.ageGroup = ageGroup;
    return params;
  }, [startDate, endDate, ageGroup]);

  return (
    <Box p={{ base: 4, md: 6 }}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" flexWrap="wrap" gap={4}>
          <Heading size={{ base: 'md', md: 'lg' }} color="gray.700">
            Analytics Dashboard
          </Heading>

          {/* Filters */}
          <HStack flexWrap="wrap" gap={2}>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
              width={{ base: 'full', md: '150px' }}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="custom">Custom</option>
            </Select>

            {dateRange === 'custom' && (
              <>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  width={{ base: 'full', md: '150px' }}
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  width={{ base: 'full', md: '150px' }}
                />
              </>
            )}

            <Select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              placeholder="All Age Groups"
              width={{ base: 'full', md: '150px' }}
            >
              <option value="">All Age Groups</option>
              <option value="6-8">6-8 years</option>
              <option value="9-11">9-11 years</option>
              <option value="12-14">12-14 years</option>
            </Select>
          </HStack>
        </HStack>

        {/* Insights Section */}
        <AnalyticsInsights />

        {/* Main Analytics Tabs */}
        <Card>
          <CardBody>
            <Tabs colorScheme="blue" variant="enclosed">
              <TabList flexWrap="wrap">
                <Tab>User Analytics</Tab>
                <Tab>Study Analytics</Tab>
                <Tab>Quiz Analytics</Tab>
                <Tab>Engagement</Tab>
                <Tab>System Performance</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <UserAnalytics filterParams={getFilterParams()} />
                </TabPanel>
                <TabPanel>
                  <StudyAnalytics filterParams={getFilterParams()} />
                </TabPanel>
                <TabPanel>
                  <QuizAnalytics filterParams={getFilterParams()} />
                </TabPanel>
                <TabPanel>
                  <EngagementAnalytics filterParams={getFilterParams()} />
                </TabPanel>
                <TabPanel>
                  <SystemAnalytics filterParams={getFilterParams()} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

