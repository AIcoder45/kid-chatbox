/**
 * Unified Home page component - Combines landing page with integrated auth modal
 */

import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  VStack,
  Container,
  SimpleGrid,
  Heading,
  Text,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  Alert,
  AlertIcon,
} from '@/shared/design-system';
import { AnimatedGradient } from '@/components/home/AnimatedGradient';
import { FloatingElement } from '@/components/home/FloatingElement';
import { HeroSection } from '@/components/home/HeroSection';
import { HeroImage } from '@/components/home/HeroImage';
import { FeatureCard } from '@/components/home/FeatureCard';
import { CTASection } from '@/components/home/CTASection';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { APP_CONSTANTS } from '@/constants/app';
import { publicApi } from '@/services/api';
import { authApi } from '@/services/api';

interface HomeProps {
  onAuthSuccess?: () => void;
}

/**
 * Initialize Google Analytics
 */
const initializeGoogleAnalytics = (): void => {
  const gaId = APP_CONSTANTS.GOOGLE_ANALYTICS_ID;
  if (!gaId) {
    return;
  }

  // Check if script already exists
  if (document.querySelector(`script[src*="gtag"]`)) {
    return;
  }

  // Create and append Google Analytics script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}');
  `;
  document.head.appendChild(script2);
};

/**
 * Track page view in Google Analytics
 */
const trackPageView = (): void => {
  const gaId = APP_CONSTANTS.GOOGLE_ANALYTICS_ID;
  if (!gaId || typeof window === 'undefined' || !(window as unknown as { gtag?: unknown }).gtag) {
    return;
  }

  try {
    (window as unknown as { gtag: (command: string, targetId: string, config: Record<string, unknown>) => void }).gtag(
      'config',
      gaId,
      {
        page_path: window.location.pathname,
        page_title: document.title,
      }
    );
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
};

/**
 * Unified Home page component with integrated auth modal
 */
export const Home: React.FC<HomeProps> = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [totalViews, setTotalViews] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check URL params for auth mode
  useEffect(() => {
    const authParam = searchParams.get('auth');
    if (authParam === 'login' || authParam === 'register') {
      setActiveTab(authParam === 'login' ? 0 : 1);
      onOpen();
      // Clean up URL
      setSearchParams({});
    }
  }, [searchParams, onOpen, setSearchParams]);

  useEffect(() => {
    // Initialize Google Analytics
    initializeGoogleAnalytics();

    // Track page view in Google Analytics
    setTimeout(() => {
      trackPageView();
    }, 100);

    // Track home page view in backend
    publicApi.trackHomeView().catch((error) => {
      console.error('Failed to track home view:', error);
    });

    // Fetch total views count
    publicApi
      .getTotalHomeViews()
      .then((response) => {
        if (response.success) {
          setTotalViews(response.totalViews);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch total views:', error);
      });
  }, []);

  const handleGetStarted = useCallback(() => {
    setActiveTab(1); // Register tab
    setAuthError(null);
    onOpen();
  }, [onOpen]);

  const handleLogin = useCallback(() => {
    setActiveTab(0); // Login tab
    setAuthError(null);
    onOpen();
  }, [onOpen]);

  const handleLoginSuccess = useCallback(() => {
    const { user: currentUser } = authApi.getCurrentUser();
    if (currentUser) {
      onClose();
      setAuthError(null);
      if (onAuthSuccess) {
        onAuthSuccess();
      } else {
        navigate('/dashboard');
      }
    }
  }, [onClose, navigate, onAuthSuccess]);

  const handleRegisterSuccess = useCallback(() => {
    const { user: currentUser } = authApi.getCurrentUser();
    if (currentUser) {
      onClose();
      setAuthError(null);
      if (onAuthSuccess) {
        onAuthSuccess();
      } else {
        navigate('/dashboard');
      }
    }
  }, [onClose, navigate, onAuthSuccess]);

  const handleSwitchToRegister = useCallback(() => {
    setActiveTab(1);
    setAuthError(null);
  }, []);

  const handleSwitchToLogin = useCallback(() => {
    setActiveTab(0);
    setAuthError(null);
  }, []);

  const handleClose = useCallback(() => {
    setAuthError(null);
    onClose();
  }, [onClose]);

  return (
    <Box position="relative" minHeight="100vh" overflow="hidden">
      <AnimatedGradient />

      {/* Floating decorative elements */}
      <FloatingElement delay={0} emoji="✨" top="10%" left="5%" />
      <FloatingElement delay={0.5} emoji="🚀" top="20%" left="90%" />
      <FloatingElement delay={1} emoji="💡" top="60%" left="8%" />
      <FloatingElement delay={1.5} emoji="🎯" top="70%" left="92%" />
      <FloatingElement delay={2} emoji="⭐" top="40%" left="3%" />
      <FloatingElement delay={2.5} emoji="🔥" top="50%" left="95%" />

      <Container maxW="7xl" py={20} position="relative" zIndex={1}>
        {/* Total Views Badge */}
        {totalViews !== null && (
          <Box
            position="absolute"
            top={4}
            right={4}
            bg="rgba(255, 255, 255, 0.2)"
            backdropFilter="blur(10px)"
            borderRadius="full"
            px={4}
            py={2}
            zIndex={2}
          >
            <HStack spacing={2}>
              <Text fontSize="sm" color="white" fontWeight="bold">
                👁️
              </Text>
              <Text fontSize="sm" color="white" fontWeight="bold">
                {totalViews.toLocaleString()} views
              </Text>
            </HStack>
          </Box>
        )}

        <VStack spacing={12} align="stretch">
          <HeroSection onGetStarted={handleGetStarted} onLogin={handleLogin} />

          <HeroImage />

          {/* Features Section */}
          <VStack spacing={8}>
            <Heading
              size="2xl"
              color="white"
              textAlign="center"
              textShadow="2px 2px 4px rgba(0,0,0,0.3)"
            >
              Why Choose {APP_CONSTANTS.BRAND_NAME}? 🎯
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} width="100%">
              <FeatureCard
                emoji="📚"
                title="AI Study Mode"
                description="Learn at your own pace with AI-powered lessons that adapt to your style"
                delay={0.6}
              />
              <FeatureCard
                emoji="🎯"
                title="AI Quiz Mode"
                description="Test your knowledge with fun quizzes and get instant feedback"
                delay={0.8}
              />
              <FeatureCard
                emoji="📊"
                title="Track Progress"
                description="See your improvement over time with detailed analytics and insights"
                delay={1.0}
              />
            </SimpleGrid>
          </VStack>

          <CTASection onGetStarted={handleGetStarted} />
        </VStack>
      </Container>

      {/* Auth Modal */}
      <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl" overflow="hidden">
          <ModalCloseButton />
          <ModalBody p={0}>
            <Tabs index={activeTab} onChange={setActiveTab} colorScheme="purple">
              <Box
                bgGradient="linear(to-r, purple.500, pink.500)"
                px={6}
                py={4}
              >
                <TabList borderBottom="none">
                  <Tab
                    color="white"
                    _selected={{ color: 'white', borderBottom: '2px solid white', fontWeight: 'bold' }}
                    _hover={{ opacity: 0.8 }}
                    fontSize="lg"
                    px={6}
                  >
                    Login 👋
                  </Tab>
                  <Tab
                    color="white"
                    _selected={{ color: 'white', borderBottom: '2px solid white', fontWeight: 'bold' }}
                    _hover={{ opacity: 0.8 }}
                    fontSize="lg"
                    px={6}
                  >
                    Sign Up 🎉
                  </Tab>
                </TabList>
              </Box>

              <TabPanels>
                <TabPanel px={6} py={8}>
                  <AnimatePresence mode="wait">
                    {authError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <Alert status="error" borderRadius="md" mb={4}>
                          <AlertIcon />
                          {authError}
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <LoginForm
                    onLoginSuccess={handleLoginSuccess}
                    onSwitchToRegister={handleSwitchToRegister}
                    onError={setAuthError}
                  />
                </TabPanel>
                <TabPanel px={6} py={8}>
                  <AnimatePresence mode="wait">
                    {authError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <Alert status="error" borderRadius="md" mb={4}>
                          <AlertIcon />
                          {authError}
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <RegisterForm
                    onRegisterSuccess={handleRegisterSuccess}
                    onSwitchToLogin={handleSwitchToLogin}
                    onError={setAuthError}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
