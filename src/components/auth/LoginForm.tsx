/**
 * Login form component for modal usage
 */

import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  HStack,
  Divider,
} from '@/shared/design-system';
import { authApi, getErrorMessage } from '@/services/api';
import { LoginCredentials } from '@/types';
import { LOGIN_CONSTANTS } from '@/constants/auth';

interface LoginFormProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
  onError?: (error: string) => void;
}

/**
 * Login form component with email/password and Google login options
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onSwitchToRegister,
  onError,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const [googleReady, setGoogleReady] = useState(false);

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

  const initializeGoogleSignIn = (clientId: string): void => {
    try {
      if (!clientId || !clientId.includes('.apps.googleusercontent.com')) {
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
      setGoogleClientId(null);
    }
  };

  const handleGoogleCallback = async (response: { credential: string }): Promise<void> => {
    if (!response.credential) return;

    setGoogleLoading(true);
    if (onError) onError('');

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
      if (onError) onError(errorMessage);
      setGoogleLoading(false);
      console.error('Google login error:', err);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (onError) onError('');
    setLoading(true);

    try {
      const credentials: LoginCredentials = { email, password };
      await authApi.login(credentials);
      onLoginSuccess();
    } catch (err) {
      const errorMessage = getErrorMessage(err) || LOGIN_CONSTANTS.LOGIN_ERROR;
      if (onError) onError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleButtonClick = async (): Promise<void> => {
    if (!googleClientId) {
      if (onError) onError(LOGIN_CONSTANTS.GOOGLE_NOT_CONFIGURED);
      return;
    }

    if (!googleReady) {
      if (onError) onError(LOGIN_CONSTANTS.GOOGLE_LOADING_ERROR);
      return;
    }

    if (!(window as unknown as { google?: unknown }).google) {
      if (onError) onError('Google Sign-In script not loaded. Please refresh the page and try again.');
      setGoogleLoading(false);
      return;
    }

    if (onError) onError('');
    setGoogleLoading(true);

    try {
      (window as unknown as {
        google: {
          accounts: {
            id: {
              prompt: (callback: (notification: {
                credential?: string;
                g?: string;
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
          const status = notification.g;
          const isNotDisplayed = notification.isNotDisplayed;
          const isSkippedMoment = notification.isSkippedMoment;
          const isDismissedMoment = notification.isDismissedMoment;
          
          let errorMsg: string = LOGIN_CONSTANTS.GOOGLE_CANCELLED;
          
          if (isNotDisplayed || isSkippedMoment || status === 'skipped_moment') {
            errorMsg = 'Google Sign-In popup was blocked or not available. Please check your browser settings.';
          } else if (isDismissedMoment || status === 'dismissed_moment') {
            errorMsg = LOGIN_CONSTANTS.GOOGLE_CANCELLED;
          } else if (status === 'display_moment') {
            errorMsg = LOGIN_CONSTANTS.GOOGLE_BLOCKED;
          }
          
          if (onError) onError(errorMsg);
          setGoogleLoading(false);
        }
      });
    } catch (err) {
      const errorMessage = getErrorMessage(err) || LOGIN_CONSTANTS.GOOGLE_ERROR;
      if (onError) onError(errorMessage);
      setGoogleLoading(false);
      console.error('Google button click error:', err);
    }
  };

  return (
    <VStack spacing={5} align="stretch">
      <Box as="form" width="100%" onSubmit={handleEmailLogin}>
        <VStack spacing={4}>
          <Box width="100%">
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
          </Box>

          <Box width="100%">
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
          </Box>

          <Button
            type="submit"
            colorScheme="purple"
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
        </VStack>
      </Box>

      {googleClientId && (
        <>
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
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
            transition="all 0.2s"
          >
            {googleReady ? LOGIN_CONSTANTS.GOOGLE_BUTTON : LOGIN_CONSTANTS.GOOGLE_LOADING}
          </Button>
        </>
      )}

      <HStack spacing={2} justifyContent="center" pt={2}>
        <Text fontSize="sm" color="gray.600">
          {LOGIN_CONSTANTS.NO_ACCOUNT_TEXT}
        </Text>
        <Button
          variant="link"
          colorScheme="purple"
          size="sm"
          onClick={onSwitchToRegister}
          fontWeight="semibold"
        >
          {LOGIN_CONSTANTS.SIGN_UP_LINK}
        </Button>
      </HStack>
    </VStack>
  );
};

