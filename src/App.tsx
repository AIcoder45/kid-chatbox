/**
 * Main App component with routing
 */

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Login } from '@/components/auth/Login';
import { Register } from '@/components/auth/Register';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Dashboard } from '@/components/Dashboard';
import { StudyMode } from '@/components/StudyMode';
import { QuizTutor } from '@/components/QuizTutor';
import { QuizHistory } from '@/components/QuizHistory';
import { StudyHistory } from '@/components/StudyHistory';
import { Profile } from '@/components/Profile';
import { Layout } from '@/components/layout/Layout';
import { Home } from '@/components/Home';
import { authApi } from '@/services/api';
import { User } from '@/types';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
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

  const handleLoginSuccess = () => {
    const { user: currentUser } = authApi.getCurrentUser();
    setUser(currentUser as User);
  };

  const handleRegisterSuccess = () => {
    const { user: currentUser } = authApi.getCurrentUser();
    setUser(currentUser as User);
  };

  if (loading) {
    return null;
  }

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login
                  onLoginSuccess={handleLoginSuccess}
                  onSwitchToRegister={() => window.location.href = '/register'}
                />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Register
                  onRegisterSuccess={handleRegisterSuccess}
                  onSwitchToLogin={() => window.location.href = '/login'}
                />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <Layout user={user}>
                  {user && <Dashboard user={user} />}
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/study"
            element={
              <AuthGuard>
                <Layout user={user}>
                  <StudyMode />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/quiz"
            element={
              <AuthGuard>
                <Layout user={user}>
                  <QuizTutor />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <Layout user={user}>
                  {user && <Profile user={user} />}
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/quiz-history"
            element={
              <AuthGuard>
                <Layout user={user}>
                  <QuizHistory />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/study-history"
            element={
              <AuthGuard>
                <Layout user={user}>
                  <StudyHistory />
                </Layout>
              </AuthGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};
