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
} from '@/shared/design-system';
import { authApi } from '@/services/api';
import { User } from '@/types';
import { useFontSize } from '@/contexts/FontSizeContext';

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
      bg="white"
      boxShadow="sm"
      borderBottomWidth={1}
      borderBottomColor="gray.200"
      paddingY={3}
      paddingX={6}
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <HStack justifyContent="space-between" alignItems="center">
        {/* Left: Navigation */}
        <HStack spacing={4}>
          {canGoBack && !isHomePage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              leftIcon={<Text>←</Text>}
            >
              Back
            </Button>
          )}
          {!isHomePage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoHome}
              leftIcon={<Text>🏠</Text>}
            >
              Home
            </Button>
          )}
        </HStack>

        {/* Center: Logo/Title */}
        <Heading size="md" color="blue.600" cursor="pointer" onClick={handleGoHome}>
          📚 Kid Chatbox
        </Heading>

        {/* Right: Font Controls and User Menu */}
        <HStack spacing={2}>
          {/* Font Size Controls */}
          <HStack spacing={1} bg="gray.100" borderRadius="md" padding={1}>
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
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                size="sm"
                leftIcon={<Avatar size="xs" name={user.name} />}
              >
                <Text display={{ base: 'none', md: 'block' }}>{user.name}</Text>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleGoHome}>Dashboard</MenuItem>
                <MenuItem onClick={() => navigate('/study')}>Study Mode</MenuItem>
                <MenuItem onClick={() => navigate('/quiz')}>Quiz Mode</MenuItem>
                <MenuItem onClick={() => navigate('/study-history')}>Study History</MenuItem>
                <MenuItem onClick={() => navigate('/quiz-history')}>Quiz History</MenuItem>
                <MenuItem onClick={() => navigate('/profile')}>My Profile</MenuItem>
                <MenuItem onClick={handleLogout} color="red.600">
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button size="sm" colorScheme="blue" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </HStack>
      </HStack>
    </Box>
  );
};

