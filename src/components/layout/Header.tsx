/**
 * Header component with navigation and user info
 */

import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  HStack,
  Text,
  Button,
  Heading,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
  useColorMode,
  useColorModeValue,
} from '@/shared/design-system';
import { authApi } from '@/services/api';
import { User } from '@/types';
import { useFontSize } from '@/contexts/FontSizeContext';
import { APP_CONSTANTS } from '@/constants/app';

interface HeaderProps {
  user?: User | null;
}

/**
 * Header component with navigation and user menu
 */
export const Header: React.FC<HeaderProps> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize } = useFontSize();
  const { colorMode, toggleColorMode } = useColorMode();
  const headerBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const fontControlBg = useColorModeValue('gray.100', 'gray.700');
  const headingColor = useColorModeValue('blue.600', 'blue.400');

  const handleLogout = () => {
    authApi.logout();
    // Use setTimeout to ensure state update is processed before navigation
    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 0);
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const canGoBack = location.key !== 'default' && window.history.length > 1;
  const isHomePage = location.pathname === '/dashboard';

  return (
    <Box
      as="header"
      bg={headerBg}
      boxShadow="sm"
      borderBottomWidth={1}
      borderBottomColor={borderColor}
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Box maxWidth="1400px" margin="0 auto">
        <Box paddingY={{ base: 2, md: 3 }} paddingX={{ base: 4, md: 6 }}>
          <HStack justifyContent="space-between" alignItems="center" flexWrap="wrap" spacing={{ base: 2, md: 4 }}>
          {/* Left: Logo/Title - Aligned with Dashboard content */}
          <Heading
            size={{ base: 'sm', md: 'md' }}
            color={headingColor}
            cursor="pointer"
            onClick={handleGoHome}
            flex={{ base: 1, md: 'none' }}
            textAlign={{ base: 'center', md: 'left' }}
          >
            🎓 {APP_CONSTANTS.BRAND_NAME}
          </Heading>

          {/* Right: Navigation and Controls */}
          <HStack spacing={{ base: 2, md: 4 }} flexWrap="wrap" ml="auto">
          {/* Navigation Buttons */}
          {canGoBack && !isHomePage && (
            <Button
              variant="ghost"
              size={{ base: 'xs', md: 'sm' }}
              onClick={handleGoBack}
              leftIcon={<Text>←</Text>}
            >
              <Text display={{ base: 'none', sm: 'block' }}>Back</Text>
            </Button>
          )}
          {!isHomePage && (
            <Button
              variant="ghost"
              size={{ base: 'xs', md: 'sm' }}
              onClick={handleGoHome}
              leftIcon={<Text>🏠</Text>}
            >
              <Text display={{ base: 'none', sm: 'block' }}>Home</Text>
            </Button>
          )}

          {/* Font Controls, Dark Mode Toggle, User Menu, and Logout */}
          {/* Dark Mode Toggle */}
          <Tooltip label={colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton
              aria-label="Toggle dark mode"
              icon={<Text fontSize="md">{colorMode === 'dark' ? '☀️' : '🌙'}</Text>}
              size="sm"
              variant="ghost"
              onClick={toggleColorMode}
            />
          </Tooltip>

          {/* Font Size Controls */}
          <HStack spacing={1} bg={fontControlBg} borderRadius="md" padding={1} display={{ base: 'none', sm: 'flex' }}>
            <Tooltip label="Decrease font size">
              <IconButton
                aria-label="Decrease font size"
                icon={<Text fontSize="sm">A-</Text>}
                size="sm"
                variant="ghost"
                onClick={decreaseFontSize}
                isDisabled={fontSize <= 12}
              />
            </Tooltip>
            <Text fontSize="xs" px={2} minW="40px" textAlign="center" fontWeight="bold">
              {fontSize}px
            </Text>
            <Tooltip label="Increase font size">
              <IconButton
                aria-label="Increase font size"
                icon={<Text fontSize="sm">A+</Text>}
                size="sm"
                variant="ghost"
                onClick={increaseFontSize}
                isDisabled={fontSize >= 24}
              />
            </Tooltip>
            <Tooltip label="Reset font size">
              <IconButton
                aria-label="Reset font size"
                icon={<Text fontSize="xs">↺</Text>}
                size="sm"
                variant="ghost"
                onClick={resetFontSize}
              />
            </Tooltip>
          </HStack>

          {user ? (
            <>
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  size={{ base: 'xs', md: 'sm' }}
                  leftIcon={<Avatar size="xs" name={user.name} />}
                >
                  <Text display={{ base: 'none', md: 'block' }}>{user.name}</Text>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={handleGoHome}>Dashboard</MenuItem>
                  <MenuItem onClick={() => navigate('/study')}>AI Study Mode</MenuItem>
                  <MenuItem onClick={() => navigate('/quiz')}>AI Quiz Mode</MenuItem>
                  <MenuItem onClick={() => navigate('/study-history')}>Study History</MenuItem>
                  <MenuItem onClick={() => navigate('/quiz-history')}>Quiz History</MenuItem>
                  <MenuItem onClick={() => navigate('/profile')}>My Profile</MenuItem>
                </MenuList>
              </Menu>
              <Button
                colorScheme="red"
                variant="outline"
                size={{ base: 'xs', md: 'sm' }}
                onClick={handleLogout}
              >
                <Text display={{ base: 'none', sm: 'block' }}>Logout</Text>
                <Text display={{ base: 'block', sm: 'none' }}>🚪</Text>
              </Button>
            </>
          ) : (
            <Button size={{ base: 'xs', md: 'sm' }} colorScheme="blue" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </HStack>
        </HStack>
        </Box>
      </Box>
    </Box>
  );
};

