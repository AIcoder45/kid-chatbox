/**
 * Login page header with font size controls and navigation
 */

import { useNavigate } from 'react-router-dom';
import {
  Box,
  HStack,
  Text,
  Button,
  IconButton,
  Tooltip,
} from '@/shared/design-system';
import { useFontSize } from '@/contexts/FontSizeContext';
import { LOGIN_CONSTANTS } from '@/constants/auth';
import { Logo } from '@/components/shared/Logo';

/**
 * Header component for login page with font size controls
 */
export const LoginHeader: React.FC = () => {
  const navigate = useNavigate();
  const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize } = useFontSize();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box
      as="header"
      bg="white"
      boxShadow="md"
      borderBottomWidth={1}
      borderBottomColor="gray.200"
      paddingY={4}
      paddingX={{ base: 4, md: 6 }}
      position="sticky"
      top={0}
      zIndex={1000}
      backdropFilter="blur(10px)"
      bgGradient="linear(to-r, white, blue.50)"
    >
      <HStack justifyContent="space-between" alignItems="center" maxW="7xl" mx="auto">
        {/* Left: Logo/Title */}
        <Logo
          showText={true}
          size="md"
          onClick={handleGoHome}
        />

        {/* Right: Font Size Controls */}
        <HStack spacing={2}>
          <HStack spacing={1} bg="gray.100" borderRadius="md" padding={1}>
            <Tooltip label={LOGIN_CONSTANTS.FONT_DECREASE_TOOLTIP}>
              <IconButton
                aria-label={LOGIN_CONSTANTS.FONT_DECREASE_TOOLTIP}
                icon={<Text fontSize="sm">A-</Text>}
                size="sm"
                variant="ghost"
                onClick={decreaseFontSize}
                isDisabled={fontSize <= 12}
                _hover={{ bg: 'gray.200' }}
              />
            </Tooltip>
            <Text fontSize="xs" px={2} minW="40px" textAlign="center" fontWeight="bold">
              {fontSize}px
            </Text>
            <Tooltip label={LOGIN_CONSTANTS.FONT_INCREASE_TOOLTIP}>
              <IconButton
                aria-label={LOGIN_CONSTANTS.FONT_INCREASE_TOOLTIP}
                icon={<Text fontSize="sm">A+</Text>}
                size="sm"
                variant="ghost"
                onClick={increaseFontSize}
                isDisabled={fontSize >= 24}
                _hover={{ bg: 'gray.200' }}
              />
            </Tooltip>
            <Tooltip label={LOGIN_CONSTANTS.FONT_RESET_TOOLTIP}>
              <IconButton
                aria-label={LOGIN_CONSTANTS.FONT_RESET_TOOLTIP}
                icon={<Text fontSize="xs">↺</Text>}
                size="sm"
                variant="ghost"
                onClick={resetFontSize}
                _hover={{ bg: 'gray.200' }}
              />
            </Tooltip>
          </HStack>

          <Button size="sm" variant="ghost" onClick={handleGoHome}>
            {LOGIN_CONSTANTS.BACK_HOME}
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
};

