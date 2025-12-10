/**
 * Layout component that wraps pages with Header and Footer
 */

import { ReactNode } from 'react';
import { Box, VStack } from '@/shared/design-system';
import { Header } from './Header';
import { Footer } from './Footer';
import { User } from '@/types';

interface LayoutProps {
  children: ReactNode;
  user?: User | null;
  showHeader?: boolean;
  showFooter?: boolean;
}

/**
 * Layout wrapper component
 */
export const Layout: React.FC<LayoutProps> = ({
  children,
  user,
  showHeader = true,
  showFooter = true,
}) => {
  return (
    <VStack minHeight="100vh" spacing={0} align="stretch">
      {showHeader && <Header user={user} />}
      <Box flex={1} width="100%">
        {children}
      </Box>
      {showFooter && <Footer />}
    </VStack>
  );
};

