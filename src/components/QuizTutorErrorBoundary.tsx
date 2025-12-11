/**
 * Error Boundary wrapper for QuizTutor component
 * Catches initialization errors and displays a user-friendly error message
 */

import { Component, ReactNode } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@/shared/design-system';
import { useNavigate } from 'react-router-dom';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface QuizTutorErrorBoundaryProps {
  children: ReactNode;
}

/**
 * Error boundary component that catches errors in QuizTutor
 */
class QuizTutorErrorBoundaryClass extends Component<
  QuizTutorErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: QuizTutorErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: unknown): void {
    console.error('QuizTutor Error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

/**
 * Error fallback component
 */
const ErrorFallback: React.FC<{ error: Error | null }> = ({ error }) => {
  const navigate = useNavigate();

  return (
    <Box padding={{ base: 4, md: 6 }} maxWidth="800px" marginX="auto">
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <VStack align="start" spacing={3} flex={1}>
          <AlertTitle>Unable to Load Quiz Mode</AlertTitle>
          <AlertDescription>
            <VStack align="start" spacing={2}>
              <Text>
                We encountered an error while loading the AI Quiz Mode page. This might be due to a
                browser compatibility issue or a temporary problem.
              </Text>
              {error && (
                <Text fontSize="sm" color="gray.600" fontFamily="mono">
                  Error: {error.message}
                </Text>
              )}
              <Text fontSize="sm" color="gray.600">
                Please try refreshing the page or contact support if the problem persists.
              </Text>
            </VStack>
          </AlertDescription>
          <Button
            colorScheme="blue"
            onClick={() => {
              window.location.reload();
            }}
            mt={2}
          >
            Refresh Page
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              navigate('/dashboard');
            }}
            mt={2}
          >
            Go to Dashboard
          </Button>
        </VStack>
      </Alert>
    </Box>
  );
};

/**
 * Error boundary wrapper component
 */
export const QuizTutorErrorBoundary: React.FC<QuizTutorErrorBoundaryProps> = ({ children }) => {
  return <QuizTutorErrorBoundaryClass>{children}</QuizTutorErrorBoundaryClass>;
};

