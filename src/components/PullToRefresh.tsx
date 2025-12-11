/**
 * Pull-to-Refresh wrapper component
 * Provides visual feedback and handles refresh logic
 */

import { ReactNode } from 'react';
import { Box, Spinner, Text, useColorModeValue } from '@/shared/design-system';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  enabled?: boolean;
  threshold?: number;
}

/**
 * Pull-to-Refresh wrapper component
 * Wraps page content and provides pull-to-refresh functionality
 */
export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  enabled = true,
  threshold = 80,
}) => {
  const { isRefreshing, pullDistance } = usePullToRefresh({
    onRefresh,
    threshold,
    enabled,
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const spinnerColor = useColorModeValue('blue.500', 'blue.400');

  // Calculate opacity and transform based on pull distance
  const pullProgress = Math.min(pullDistance / threshold, 1);
  const shouldShowIndicator = pullDistance > 10 || isRefreshing;

  return (
    <Box position="relative" minH="100vh">
      {/* Pull indicator */}
      {shouldShowIndicator && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          zIndex={9999}
          bg={bgColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
          py={4}
          transform={`translateY(${Math.max(0, pullDistance - 60)}px)`}
          transition={isRefreshing ? 'transform 0.2s' : 'none'}
          boxShadow={pullProgress > 0.5 ? 'md' : 'none'}
          opacity={pullProgress}
        >
          {isRefreshing ? (
            <Box display="flex" alignItems="center" gap={3}>
              <Spinner size="md" color={spinnerColor} />
              <Text color={textColor} fontWeight="medium">
                Refreshing...
              </Text>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <Box
                transform={`rotate(${pullProgress * 180}deg)`}
                transition="transform 0.2s"
                fontSize="2xl"
              >
                ↓
              </Box>
              {pullProgress >= 1 && (
                <Text color={textColor} fontSize="sm">
                  Release to refresh
                </Text>
              )}
            </Box>
          )}
        </Box>
      )}

      {/* Content */}
      <Box
        style={{
          transform: shouldShowIndicator ? `translateY(${Math.max(0, pullDistance)}px)` : 'none',
          transition: isRefreshing ? 'transform 0.3s ease-out' : 'none',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

