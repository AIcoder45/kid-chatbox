/**
 * Main App component with routing
 */

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { ModuleAccessGuard } from '@/components/ModuleAccessGuard';
import { Dashboard } from '@/components/Dashboard';
import { StudyMode } from '@/components/StudyMode';
import { QuizTutor } from '@/components/QuizTutor';
import { QuizTutorErrorBoundary } from '@/components/QuizTutorErrorBoundary';
import { QuizHistory } from '@/components/QuizHistory';
import { QuizRankings } from '@/components/QuizRankings';
import { StudyHistory } from '@/components/StudyHistory';
import { StudyLibrary } from '@/components/StudyLibrary';
import { StudyLibraryViewer } from '@/components/StudyLibraryViewer';
import { Profile } from '@/components/Profile';
import { ScheduledTests } from '@/components/ScheduledTests';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { Home } from '@/components/Home';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { UserManagement } from '@/components/admin/UserManagement';
import { PlanManagement } from '@/components/admin/PlanManagement';
import { TopicManagement } from '@/components/admin/TopicManagement';
import { QuizManagement } from '@/components/admin/QuizManagement';
import { QuizHistoryManagement } from '@/components/admin/QuizHistoryManagement';
import { StudyLibraryContentManagement } from '@/components/admin/StudyLibraryContentManagement';
import { QuizResultsAnalytics } from '@/components/admin/QuizResultsAnalytics';
import { authApi } from '@/services/api';
import { User } from '@/types';
import { QuizTimerProvider } from '@/contexts/QuizTimerContext';

/**
 * Theme configuration with dark mode support and responsive font sizes
 */
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
        fontSize: { base: '14px', md: '16px' }, // Smaller base font on mobile
      },
    }),
  },
  colors: {
    gray: {
      50: '#F7FAFC',
      100: '#EDF2F7',
      200: '#E2E8F0',
      300: '#CBD5E0',
      400: '#A0AEC0',
      500: '#718096',
      600: '#4A5568',
      700: '#2D3748',
      800: '#1A202C',
      900: '#171923',
    },
  },
  components: {
    Card: {
      baseStyle: (props: { colorMode: string }) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
        },
      }),
    },
    Button: {
      baseStyle: (props: { colorMode: string }) => ({
        _hover: {
          bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.100',
        },
      }),
    },
    Heading: {
      baseStyle: {
        // Responsive font sizes - smaller on mobile
        fontSize: {
          base: '1.25rem', // 20px
          sm: '1.5rem',    // 24px
          md: '1.875rem',  // 30px
          lg: '2.25rem',   // 36px
        },
      },
      sizes: {
        xs: {
          fontSize: { base: '0.75rem', md: '0.875rem' }, // 12px/14px
        },
        sm: {
          fontSize: { base: '0.875rem', md: '1rem' }, // 14px/16px
        },
        md: {
          fontSize: { base: '1rem', md: '1.125rem' }, // 16px/18px
        },
        lg: {
          fontSize: { base: '1.125rem', md: '1.25rem' }, // 18px/20px
        },
        xl: {
          fontSize: { base: '1.25rem', md: '1.5rem' }, // 20px/24px
        },
        '2xl': {
          fontSize: { base: '1.5rem', md: '1.875rem' }, // 24px/30px
        },
        '3xl': {
          fontSize: { base: '1.875rem', md: '2.25rem' }, // 30px/36px
        },
        '4xl': {
          fontSize: { base: '2.25rem', md: '3rem' }, // 36px/48px
        },
      },
    },
    Text: {
      baseStyle: {
        fontSize: { base: '0.875rem', md: '1rem' }, // 14px/16px - smaller on mobile
      },
      sizes: {
        xs: {
          fontSize: { base: '0.625rem', md: '0.75rem' }, // 10px/12px
        },
        sm: {
          fontSize: { base: '0.75rem', md: '0.875rem' }, // 12px/14px
        },
        md: {
          fontSize: { base: '0.875rem', md: '1rem' }, // 14px/16px
        },
        lg: {
          fontSize: { base: '1rem', md: '1.125rem' }, // 16px/18px
        },
        xl: {
          fontSize: { base: '1.125rem', md: '1.25rem' }, // 18px/20px
        },
        '2xl': {
          fontSize: { base: '1.25rem', md: '1.5rem' }, // 20px/24px
        },
      },
    },
  },
});

/**
 * Root application component with routing
 */
export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { user: currentUser } = authApi.getCurrentUser();
    if (currentUser) {
      setUser(currentUser as User);
    }
    setLoading(false);

    // Listen for profile updates
    const handleProfileUpdate = (event: CustomEvent<User>) => {
      setUser(event.detail);
    };

    // Listen for logout events
    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener('userProfileUpdated', handleProfileUpdate as EventListener);
    window.addEventListener('userLoggedOut', handleLogout as EventListener);

    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate as EventListener);
      window.removeEventListener('userLoggedOut', handleLogout as EventListener);
    };
  }, []);

  const handleAuthSuccess = () => {
    const { user: currentUser } = authApi.getCurrentUser();
    setUser(currentUser as User);
  };

  if (loading) {
    return null;
  }

  return (
    <ChakraProvider theme={theme}>
      <QuizTimerProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Home onAuthSuccess={handleAuthSuccess} />
              )
            }
          />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/?auth=login" replace />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/?auth=register" replace />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <StudentLayout user={user}>
                  {user && <Dashboard user={user} />}
                </StudentLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/study"
            element={
              <AuthGuard>
                <ModuleAccessGuard module="study">
                  <StudentLayout user={user}>
                    <StudyMode />
                  </StudentLayout>
                </ModuleAccessGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/quiz"
            element={
              <AuthGuard>
                <ModuleAccessGuard module="quiz">
                  <StudentLayout user={user}>
                    <QuizTutorErrorBoundary>
                      <QuizTutor />
                    </QuizTutorErrorBoundary>
                  </StudentLayout>
                </ModuleAccessGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <StudentLayout user={user}>
                  {user && <Profile user={user} />}
                </StudentLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/quiz-history"
            element={
              <AuthGuard>
                <StudentLayout user={user}>
                  <QuizHistory />
                </StudentLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/quiz-rankings"
            element={
              <AuthGuard>
                <ModuleAccessGuard module="quiz">
                  <StudentLayout user={user}>
                    <QuizRankings />
                  </StudentLayout>
                </ModuleAccessGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/study-history"
            element={
              <AuthGuard>
                <StudentLayout user={user}>
                  <StudyHistory />
                </StudentLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/study-library"
            element={
              <AuthGuard>
                <ModuleAccessGuard module="study">
                  <StudentLayout user={user}>
                    <StudyLibrary />
                  </StudentLayout>
                </ModuleAccessGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/study-library/:id"
            element={
              <AuthGuard>
                <ModuleAccessGuard module="study">
                  <StudentLayout user={user}>
                    <StudyLibraryViewer />
                  </StudentLayout>
                </ModuleAccessGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/scheduled-tests"
            element={
              <AuthGuard>
                <StudentLayout user={user}>
                  <ScheduledTests />
                </StudentLayout>
              </AuthGuard>
            }
          />
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminGuard>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminGuard>
                <AdminLayout>
                  <UserManagement />
                </AdminLayout>
              </AdminGuard>
            }
          />
          <Route
            path="/admin/plans"
            element={
              <AdminGuard>
                <AdminLayout>
                  <PlanManagement />
                </AdminLayout>
              </AdminGuard>
            }
          />
          <Route
            path="/admin/topics"
            element={
              <AdminGuard>
                <AdminLayout>
                  <TopicManagement />
                </AdminLayout>
              </AdminGuard>
            }
          />
          <Route
            path="/admin/quizzes"
            element={
              <AdminGuard>
                <AdminLayout>
                  <QuizManagement />
                </AdminLayout>
              </AdminGuard>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminGuard>
                <AdminLayout>
                  <AnalyticsDashboard />
                </AdminLayout>
              </AdminGuard>
            }
          />
          <Route
            path="/admin/quiz-analytics"
            element={
              <AdminGuard>
                <AdminLayout>
                  <QuizResultsAnalytics />
                </AdminLayout>
              </AdminGuard>
            }
          />
          <Route
            path="/admin/quiz-history"
            element={
              <AdminGuard>
                <AdminLayout>
                  <QuizHistoryManagement />
                </AdminLayout>
              </AdminGuard>
            }
          />
          <Route
            path="/admin/study-library-content"
            element={
              <AdminGuard>
                <AdminLayout>
                  <StudyLibraryContentManagement />
                </AdminLayout>
              </AdminGuard>
            }
          />
        </Routes>
        </BrowserRouter>
      </QuizTimerProvider>
    </ChakraProvider>
  );
};
