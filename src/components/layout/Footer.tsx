/**
 * Footer component
 */

import { Box, Text, HStack } from '@/shared/design-system';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Footer component with app information
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      as="footer"
      bg="gray.800"
      color="white"
      paddingY={6}
      paddingX={6}
      marginTop="auto"
    >
      <HStack justifyContent="space-between" alignItems="center" flexWrap="wrap" spacing={4}>
        <Text fontSize="sm">
          © {currentYear} Guru AI. All rights reserved.
        </Text>
        <HStack spacing={4}>
          <RouterLink to="/dashboard" style={{ fontSize: '0.875rem', color: '#90cdf4' }}>
            Home
          </RouterLink>
          <Text fontSize="sm" color="gray.400">
            Made with ❤️ for kids
          </Text>
        </HStack>
      </HStack>
    </Box>
  );
};

