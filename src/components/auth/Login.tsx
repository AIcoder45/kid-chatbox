/**
 * Enhanced Login component with animations, images, and responsive design
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  Card,
  CardBody,
  Heading,
  HStack,
  Divider,
  Alert,
  AlertIcon,
  Container,
  SimpleGrid,
  Image,
  useBreakpointValue,
} from '@/shared/design-system';
import { authApi, getErrorMessage } from '@/services/api';
import { LoginCredentials } from '@/types';
import { LoginHeader } from './LoginHeader';
import { LOGIN_CONSTANTS } from '@/constants/auth';

interface LoginProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

/**
 * Login form component with email/password and Google login options
 * Features animations, responsive design, and intuitive UI
 */
export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const [googleReady, setGoogleReady] = useState(false);

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!clientId || clientId.trim() === '') {
      setGoogleClientId(null);
      return;
    }

    setGoogleClientId(clientId);

    if (!document.getElementById('google-signin-script')) {
      const script = document.createElement('script');
      script.id = 'google-signin-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        setGoogleClientId(null);
      };
      script.onload = () => {
        setTimeout(() => {
          if ((window as unknown as { google?: unknown }).google) {
            initializeGoogleSignIn(clientId);
          }
        }, 500);
      };
      document.head.appendChild(script);
    } else {
      if ((window as unknown as { google?: unknown }).google) {
        initializeGoogleSignIn(clientId);
      } else {
        const checkGoogle = setInterval(() => {
          if ((window as unknown as { google?: unknown }).google) {
            clearInterval(checkGoogle);
            initializeGoogleSignIn(clientId);
          }
        }, 100);
        setTimeout(() => clearInterval(checkGoogle), 5000);
      }
    }
  }, []);

  const initializeGoogleSignIn = (clientId: string) => {
    try {
      // Validate client ID format
      if (!clientId || !clientId.includes('.apps.googleusercontent.com')) {
        console.error('Invalid Google Client ID format:', clientId);
        setError('Invalid Google Client ID configuration. Please check your .env file.');
        setGoogleClientId(null);
        return;
      }

      (window as unknown as {
        google: {
          accounts: {
            id: {
              initialize: (config: {
                client_id: string;
                callback: (response: { credential: string }) => void;
                auto_select?: boolean;
                cancel_on_tap_outside?: boolean;
                use_fedcm_for_prompt?: boolean;
              }) => void;
            };
          };
        };
      }).google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCallback,
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: true,
      });
      setGoogleReady(true);
    } catch (err) {
      console.error('Google Sign-In initialization error:', err);
      setError('Failed to initialize Google Sign-In. Please check your Google OAuth configuration.');
      setGoogleClientId(null);
    }
  };

  const handleGoogleCallback = async (response: { credential: string }) => {
    if (!response.credential) return;

    setGoogleLoading(true);
    setError(null);

    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      await authApi.socialLogin({
        provider: 'google',
        token: response.credential,
        email: payload.email,
        name: payload.name,
      });
      
      onLoginSuccess();
    } catch (err) {
      const errorMessage = getErrorMessage(err) || LOGIN_CONSTANTS.GOOGLE_ERROR;
      setError(errorMessage);
      setGoogleLoading(false);
      console.error('Google login error:', err);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const credentials: LoginCredentials = { email, password };
      await authApi.login(credentials);
      onLoginSuccess();
    } catch (err) {
      const errorMessage = getErrorMessage(err) || LOGIN_CONSTANTS.LOGIN_ERROR;
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleButtonClick = async () => {
    if (!googleClientId) {
      setError(LOGIN_CONSTANTS.GOOGLE_NOT_CONFIGURED);
      return;
    }

    if (!googleReady) {
      setError(LOGIN_CONSTANTS.GOOGLE_LOADING_ERROR);
      return;
    }

    // Check if Google object is available
    if (!(window as unknown as { google?: unknown }).google) {
      setError('Google Sign-In script not loaded. Please refresh the page and try again.');
      setGoogleLoading(false);
      return;
    }

    setError(null);
    setGoogleLoading(true);

    try {
      (window as unknown as {
        google: {
          accounts: {
            id: {
              prompt: (callback: (notification: {
                credential?: string;
                g?: string; // FedCM-compatible status code
                select_by?: string;
                isNotDisplayed?: boolean;
                isSkippedMoment?: boolean;
                isDismissedMoment?: boolean;
              }) => void) => void;
            };
          };
        };
      }).google.accounts.id.prompt((notification) => {
        if (notification.credential) {
          handleGoogleCallback({ credential: notification.credential });
        } else {
          // Handle different notification states
          const status = notification.g;
          const isNotDisplayed = notification.isNotDisplayed;
          const isSkippedMoment = notification.isSkippedMoment;
          const isDismissedMoment = notification.isDismissedMoment;
          
          let errorMsg: string = LOGIN_CONSTANTS.GOOGLE_CANCELLED;
          
          if (isNotDisplayed || isSkippedMoment || status === 'skipped_moment') {
            errorMsg = 'Google Sign-In popup was blocked or not available. Please check your browser settings or ensure your email is added as a test user in Google Cloud Console.';
          } else if (isDismissedMoment || status === 'dismissed_moment') {
            errorMsg = LOGIN_CONSTANTS.GOOGLE_CANCELLED;
          } else if (status === 'display_moment') {
            errorMsg = LOGIN_CONSTANTS.GOOGLE_BLOCKED;
          }
          
          setError(errorMsg);
          setGoogleLoading(false);
          console.error('Google Sign-In notification:', notification);
        }
      });
    } catch (err) {
      const errorMessage = getErrorMessage(err) || LOGIN_CONSTANTS.GOOGLE_ERROR;
      setError(errorMessage);
      setGoogleLoading(false);
      console.error('Google button click error:', err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <Box minHeight="100vh" bg="gray.50" position="relative" overflow="hidden">
      {/* Animated background gradient */}
      <Box
        position="fixed"
        top={0}
        left={0}
        width="100%"
        height="100%"
        zIndex={0}
        overflow="hidden"
      >
        <motion.div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
            backgroundSize: '400% 400%',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <Box
          position="absolute"
          width="100%"
          height="100%"
          bg="rgba(255, 255, 255, 0.85)"
          backdropFilter="blur(2px)"
        />
      </Box>

      <LoginHeader />

      <Container maxW="7xl" py={{ base: 8, md: 12 }} position="relative" zIndex={1}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 8, lg: 12 }} alignItems="center">
          {/* Left side - Image and welcome message */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            {!isMobile && (
              <motion.div variants={imageVariants}>
                <Box
                  borderRadius="2xl"
                  overflow="hidden"
                  boxShadow="2xl"
                  mb={6}
                  position="relative"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop&q=80"
                    alt="Kids learning"
                    width="100%"
                    maxW="500px"
                    height="auto"
                    objectFit="cover"
                  />
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    bgGradient="linear(to-t, blackAlpha.700, transparent)"
                    p={4}
                  >
                    <Text color="white" fontSize="lg" fontWeight="bold">
                      Learning Made Fun! 🎓
                    </Text>
                  </Box>
                </Box>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <VStack spacing={4} textAlign="center">
                <Heading
                  size="2xl"
                  bgGradient="linear(to-r, blue.600, purple.600)"
                  bgClip="text"
                  fontWeight="bold"
                >
                  {LOGIN_CONSTANTS.WELCOME_TITLE} 👋
                </Heading>
                <Text fontSize="xl" color="gray.600" maxW="400px">
                  {LOGIN_CONSTANTS.WELCOME_SUBTITLE}
                </Text>
              </VStack>
            </motion.div>
          </motion.div>

          {/* Right side - Login form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card
              width="100%"
              maxWidth="500px"
              margin="0 auto"
              boxShadow="2xl"
              borderRadius="2xl"
              bg="white"
              border="1px solid"
              borderColor="gray.200"
            >
              <CardBody p={{ base: 6, md: 8 }}>
                <motion.div variants={itemVariants}>
                  <VStack spacing={6}>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ width: '100%' }}
                      >
                        <Alert status="error" borderRadius="md">
                          <AlertIcon />
                          {error}
                        </Alert>
                      </motion.div>
                    )}

                    <Box as="form" width="100%" onSubmit={handleEmailLogin}>
                      <VStack spacing={5}>
                        <motion.div variants={itemVariants} style={{ width: '100%' }}>
                          <Text fontSize="sm" fontWeight="semibold" marginBottom={2} color="gray.700">
                            {LOGIN_CONSTANTS.EMAIL_LABEL}
                          </Text>
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={LOGIN_CONSTANTS.EMAIL_PLACEHOLDER}
                            size="lg"
                            required
                            autoComplete="email"
                            borderRadius="lg"
                            borderColor="gray.300"
                            _hover={{ borderColor: 'blue.400' }}
                            _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                          />
                        </motion.div>

                        <motion.div variants={itemVariants} style={{ width: '100%' }}>
                          <Text fontSize="sm" fontWeight="semibold" marginBottom={2} color="gray.700">
                            {LOGIN_CONSTANTS.PASSWORD_LABEL}
                          </Text>
                          <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={LOGIN_CONSTANTS.PASSWORD_PLACEHOLDER}
                            size="lg"
                            required
                            autoComplete="current-password"
                            borderRadius="lg"
                            borderColor="gray.300"
                            _hover={{ borderColor: 'blue.400' }}
                            _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                          />
                        </motion.div>

                        <motion.div variants={itemVariants} style={{ width: '100%' }}>
                          <Button
                            type="submit"
                            colorScheme="blue"
                            size="lg"
                            width="100%"
                            isLoading={loading}
                            isDisabled={loading || googleLoading}
                            borderRadius="lg"
                            fontWeight="bold"
                            fontSize="md"
                            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                            transition="all 0.2s"
                          >
                            {LOGIN_CONSTANTS.LOGIN_BUTTON}
                          </Button>
                        </motion.div>
                      </VStack>
                    </Box>

                    {googleClientId && (
                      <motion.div variants={itemVariants} style={{ width: '100%' }}>
                        <HStack width="100%" spacing={4}>
                          <Divider />
                          <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
                            {LOGIN_CONSTANTS.OR_DIVIDER}
                          </Text>
                          <Divider />
                        </HStack>

                        <Button
                          colorScheme="red"
                          variant="outline"
                          size="lg"
                          width="100%"
                          onClick={handleGoogleButtonClick}
                          isDisabled={loading || googleLoading || !googleReady}
                          isLoading={googleLoading}
                          borderRadius="lg"
                          fontWeight="semibold"
                          mt={4}
                          _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                          transition="all 0.2s"
                        >
                          {googleReady ? LOGIN_CONSTANTS.GOOGLE_BUTTON : LOGIN_CONSTANTS.GOOGLE_LOADING}
                        </Button>
                      </motion.div>
                    )}

                    <motion.div variants={itemVariants} style={{ width: '100%' }}>
                      <HStack spacing={2} justifyContent="center">
                        <Text fontSize="sm" color="gray.600">
                          {LOGIN_CONSTANTS.NO_ACCOUNT_TEXT}
                        </Text>
                        <Button
                          variant="link"
                          colorScheme="blue"
                          size="sm"
                          onClick={onSwitchToRegister}
                          fontWeight="semibold"
                        >
                          {LOGIN_CONSTANTS.SIGN_UP_LINK}
                        </Button>
                      </HStack>
                    </motion.div>
                  </VStack>
                </motion.div>
              </CardBody>
            </Card>
          </motion.div>
        </SimpleGrid>
      </Container>
    </Box>
  );
};
