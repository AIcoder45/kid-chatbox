/**
 * Student Layout Component
 * Layout with sidebar navigation for student users
 */

import { ReactNode } from 'react';
import {
  Box,
  HStack,
  IconButton,
  Text,
  useBreakpointValue,
  useDisclosure,
  useColorModeValue,
} from '@/shared/design-system';
import { Header } from './Header';
import { Footer } from './Footer';
import { StudentSidebar } from './StudentSidebar';
import { User } from '@/types';

interface StudentLayoutProps {
  children: ReactNode;
  user?: User | null;
  showHeader?: boolean;
  showFooter?: boolean;
}

/**
 * Student Layout with sidebar navigation
 */
export const StudentLayout: React.FC<StudentLayoutProps> = ({
  children,
  user,
  showHeader = true,
  showFooter = true,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const mobileMenuBg = useColorModeValue('white', 'gray.800');
  const mobileMenuBorder = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box minHeight="100vh" bg={bgColor}>
      {showHeader && (
        <Box position="sticky" top={0} zIndex={1000}>
          <Header user={user} />
          {isMobile && (
            <Box px={4} py={2} bg={mobileMenuBg} borderBottom="1px" borderColor={mobileMenuBorder}>
              <IconButton
                aria-label="Open menu"
                icon={<Text>☰</Text>}
                onClick={onOpen}
                variant="ghost"
              />
            </Box>
          )}
        </Box>
      )}

      <HStack align="start" spacing={0}>
        {/* Sidebar - Desktop */}
        {!isMobile && <StudentSidebar user={user || null} />}

        {/* Sidebar - Mobile Drawer */}
        {isMobile && <StudentSidebar user={user || null} isOpen={isOpen} onClose={onClose} />}

        {/* Main Content */}
        <Box flex={1} minH="calc(100vh - 73px)" py={6} px={0}>
          {children}
        </Box>
      </HStack>

      {showFooter && <Footer />}
    </Box>
  );
};

