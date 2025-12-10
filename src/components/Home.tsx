/**
 * Home page component - Modern Gen Z style landing page with animations
 */

import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Container,
  SimpleGrid,
  Heading,
} from '@/shared/design-system';
import { AnimatedGradient } from '@/components/home/AnimatedGradient';
import { FloatingElement } from '@/components/home/FloatingElement';
import { HeroSection } from '@/components/home/HeroSection';
import { HeroImage } from '@/components/home/HeroImage';
import { FeatureCard } from '@/components/home/FeatureCard';
import { CTASection } from '@/components/home/CTASection';
import { APP_CONSTANTS } from '@/constants/app';

/**
 * Main Home page component
 */
export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

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
                title="Smart Study Mode"
                description="Learn at your own pace with AI-powered lessons that adapt to your style"
                delay={0.6}
              />
              <FeatureCard
                emoji="🎯"
                title="Interactive Quizzes"
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
    </Box>
  );
};
