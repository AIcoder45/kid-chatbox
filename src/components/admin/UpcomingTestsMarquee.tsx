/**
 * Upcoming Tests Marquee Component
 * Displays upcoming scheduled tests in a scrolling marquee in the admin header
 */

import { useState, useEffect, useCallback } from 'react';
import { Box, Text, HStack } from '@/shared/design-system';
import { scheduledTestsApi, ScheduledTest } from '@/services/admin';

/**
 * Formats date for display in marquee
 * @param dateString - ISO date string to format
 * @returns Formatted date string
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Upcoming Tests Marquee component
 */
export const UpcomingTestsMarquee: React.FC = () => {
  const [upcomingTests, setUpcomingTests] = useState<ScheduledTest[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches upcoming scheduled tests
   */
  const loadUpcomingTests = useCallback(async () => {
    try {
      setLoading(true);
      const now = new Date();
      const data = await scheduledTestsApi.getScheduledTests({
        status: 'scheduled',
      });

      // Map snake_case fields from database to camelCase
      const mappedTests = data.scheduledTests.map((test: unknown) => {
        const t = test as Record<string, unknown>;
        return {
          ...t,
          quizName: t.quiz_name || t.quizName,
          scheduledFor: t.scheduled_for || t.scheduledFor,
          visibleFrom: t.visible_from || t.visibleFrom,
        } as ScheduledTest;
      });

      // Filter for upcoming tests (scheduledFor > now)
      const upcoming = mappedTests.filter((test) => {
        if (!test.scheduledFor) {
          return false;
        }
        const scheduledFor = new Date(test.scheduledFor);
        return !isNaN(scheduledFor.getTime()) && scheduledFor > now;
      });

      // Sort by scheduledFor date (earliest first)
      upcoming.sort((a, b) => {
        const dateA = new Date(a.scheduledFor).getTime();
        const dateB = new Date(b.scheduledFor).getTime();
        return dateA - dateB;
      });

      // Limit to 10 most upcoming tests
      setUpcomingTests(upcoming.slice(0, 10));
    } catch (err) {
      // Silently fail - don't show error in header marquee
      setUpcomingTests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUpcomingTests();
    // Refresh every 5 minutes
    const interval = setInterval(loadUpcomingTests, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadUpcomingTests]);

  if (loading || upcomingTests.length === 0) {
    return null;
  }

  const marqueeContent = (
    <HStack spacing={6} display="inline-flex">
      <Text fontSize="sm" fontWeight="medium" color="blue.700" _dark={{ color: 'blue.300' }}>
        📅 Upcoming Tests:
      </Text>
      {upcomingTests.map((test, index) => (
        <HStack key={test.id} spacing={2} display="inline-flex">
          <Text fontSize="sm" color="gray.700" _dark={{ color: 'gray.300' }}>
            {test.quizName || 'Untitled Quiz'}
          </Text>
          <Text fontSize="xs" color="gray.500" _dark={{ color: 'gray.400' }}>
            ({formatDate(test.scheduledFor)})
          </Text>
          {index < upcomingTests.length - 1 && (
            <Text fontSize="sm" color="gray.400" mx={2}>
              •
            </Text>
          )}
        </HStack>
      ))}
    </HStack>
  );

  return (
    <Box
      overflow="hidden"
      whiteSpace="nowrap"
      bg="blue.50"
      py={2}
      px={4}
      borderBottom="1px"
      borderColor="gray.200"
      _dark={{ bg: 'blue.900', borderColor: 'gray.700' }}
      position="relative"
    >
      <Box
        display="inline-block"
        sx={{
          '@keyframes scroll': {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-50%)' },
          },
          animation: 'scroll 30s linear infinite',
        }}
      >
        <HStack spacing={6} display="inline-flex">
          {marqueeContent}
          {marqueeContent}
        </HStack>
      </Box>
    </Box>
  );
};

