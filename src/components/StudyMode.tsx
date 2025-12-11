/**
 * Study Mode component - Provides CBSE-style detailed topic explanations with animations
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  Container,
  SimpleGrid,
} from '@/shared/design-system';
import { StudyModeForm } from './StudyModeForm';
import { generateLesson } from '@/services/study';
import { QuizConfig } from '@/types/quiz';
import { Lesson } from '@/services/study';
import { authApi, studyApi, profileApi } from '@/services/api';
import { User } from '@/types';
import { STUDY_MODE_MESSAGES } from '@/constants/study';
import { useFontSize } from '@/contexts/FontSizeContext';
import { AnimatedCard } from './study/AnimatedCard';
import { TopicImage } from './study/TopicImage';
import { AnimatedSection } from './study/AnimatedSection';
import { AnimatedListItem } from './study/AnimatedListItem';
import { KeyPointCard } from './study/KeyPointCard';

type StudyPhase = 'config' | 'loading' | 'lesson' | 'complete';

/**
 * Study Mode component that generates and displays CBSE-style lessons
 */
export const StudyMode: React.FC = () => {
  const navigate = useNavigate();
  const { fontSize } = useFontSize();
  const [phase, setPhase] = useState<StudyPhase>('config');
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionSaved, setSessionSaved] = useState(false);

  const handleTopicSubmit = useCallback(async (config: {
    subject: string;
    topic: string;
    difficulty: string;
  }) => {
    // Get user profile data - fetch fresh data from API to ensure we have latest profile
    let userProfile: User | null = null;
    
    try {
      // Fetch fresh user profile from API (includes latest age and preferredLanguage)
      const { user: freshUser } = await profileApi.getProfile();
      userProfile = freshUser as User | null;
    } catch (error) {
      // If profile API fails, try auth API
      try {
        const { user: authUser } = await authApi.fetchCurrentUser();
        userProfile = authUser as User | null;
      } catch (authError) {
        // If both fail, fall back to localStorage
        console.warn('Failed to fetch fresh user data, using cached data:', error);
    const { user } = authApi.getCurrentUser();
        userProfile = user as User | null;
      }
    }
    
    if (!userProfile || !userProfile.age || !userProfile.preferredLanguage) {
      setError(STUDY_MODE_MESSAGES.ERROR_PROFILE_INCOMPLETE);
      setPhase('config');
      return;
    }

    const quizConfig: QuizConfig = {
      age: userProfile.age,
      language: userProfile.preferredLanguage as QuizConfig['language'],
      subject: config.subject as QuizConfig['subject'],
      subtopics: [config.topic],
      questionCount: 15,
      difficulty: config.difficulty as QuizConfig['difficulty'],
    };
    setConfig(quizConfig);
    setPhase('loading');
    setError(null);

    try {
      const generatedLesson = await generateLesson(quizConfig, userProfile);
      setLesson(generatedLesson);
      setPhase('lesson');

      try {
        const { user } = authApi.getCurrentUser();
        if (user && quizConfig) {
          await studyApi.saveStudySession({
            user_id: (user as { id: string }).id,
            timestamp: new Date().toISOString(),
            subject: quizConfig.subject,
            topic: quizConfig.subtopics[0] || '',
            age: quizConfig.age,
            language: quizConfig.language,
            difficulty: quizConfig.difficulty,
            lesson_title: generatedLesson.title,
            lesson_introduction: generatedLesson.introduction,
            lesson_explanation: generatedLesson.explanation,
            lesson_key_points: generatedLesson.keyPoints,
            lesson_examples: generatedLesson.examples,
            lesson_summary: generatedLesson.summary,
          });
          setSessionSaved(true);
        }
      } catch (saveErr) {
        console.error('Failed to save study session:', saveErr);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : STUDY_MODE_MESSAGES.ERROR_GENERATION_FAILED
      );
      setPhase('config');
    }
  }, []);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleTakeQuiz = () => {
    if (config) {
      navigate('/quiz', { state: { config } });
    }
  };

  const getUserGrade = (): string => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.grade || `Class ${Math.floor((config?.age || 8) / 2) + 1}`;
      }
    } catch (error) {
      // Ignore
    }
    return `Class ${Math.floor((config?.age || 8) / 2) + 1}`;
  };

  const getUserProfile = (): { grade?: string; age?: number } => {
    try {
      const { user } = authApi.getCurrentUser();
      const typedUser = user as User | null;
      return {
        grade: typedUser?.grade,
        age: typedUser?.age,
      };
    } catch {
      return {};
    }
  };

  const userProfile = getUserProfile();
  const baseFontSize = `${fontSize}px`;
  const headingSize = `${fontSize * 1.5}px`;
  const subHeadingSize = `${fontSize * 1.25}px`;

  if (phase === 'config') {
    return (
      <Container maxW="container.lg" py={{ base: 4, md: 8 }}>
        <VStack spacing={6}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={4}>
              <StudyModeForm
                onTopicSubmit={handleTopicSubmit}
                userGrade={userProfile.grade}
                userAge={userProfile.age}
              />
              {error && (
                <Alert status="error" maxWidth="700px" borderRadius="lg">
                  <AlertIcon />
                  {error}
                </Alert>
              )}
            </VStack>
          </motion.div>
        </VStack>
      </Container>
    );
  }

  if (phase === 'loading') {
    return (
      <Box
        padding={{ base: 4, md: 6 }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <VStack spacing={6}>
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Spinner size="xl" color="blue.500" thickness="4px" />
          </motion.div>
          <VStack spacing={2}>
            <Text fontSize={subHeadingSize} fontWeight="bold">
              {STUDY_MODE_MESSAGES.LOADING_MESSAGE}
            </Text>
            <Text fontSize={baseFontSize} color="gray.600">
              Preparing personalized content for {getUserGrade()}...
            </Text>
          </VStack>
        </VStack>
      </Box>
    );
  }

  if (phase === 'lesson' && lesson && config) {
    return (
      <Box
        padding={{ base: 4, md: 6 }}
        bg="gray.50"
        minHeight="100vh"
        style={{ fontSize: baseFontSize }}
      >
        <Container maxW="container.xl">
          <VStack spacing={{ base: 4, md: 6 }} align="stretch">
            {/* Header Card */}
            <AnimatedCard delay={0.1} boxShadow="xl">
              <VStack spacing={4} align="stretch">
                <HStack justifyContent="space-between" alignItems="center" flexWrap="wrap">
                  <Badge colorScheme="blue" fontSize={baseFontSize} padding={2} borderRadius="md">
                    {getUserGrade()}
                  </Badge>
                  <Badge colorScheme="green" fontSize={baseFontSize} padding={2} borderRadius="md">
                    {config.subject}
                  </Badge>
                </HStack>
                <Heading
                  size="xl"
                  color="blue.700"
                  textAlign="center"
                  fontSize={headingSize}
                  fontWeight="bold"
                >
                  {lesson.title}
                </Heading>
              </VStack>
            </AnimatedCard>

            {/* Topic Image */}
            <TopicImage subject={config.subject} topic={config.subtopics[0] || ''} />

            {/* Introduction */}
            <AnimatedCard delay={0.2}>
              <AnimatedSection title="Introduction" delay={0.3} titleColor="blue.600">
                <Box>
                  {lesson.introduction.split('\n\n').map((paragraph, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    >
                      <Text
                        fontSize={baseFontSize}
                        lineHeight="tall"
                        color="gray.700"
                        marginBottom={index < lesson.introduction.split('\n\n').length - 1 ? 4 : 0}
                      >
                        {paragraph.trim()}
                      </Text>
                    </motion.div>
                  ))}
                </Box>
              </AnimatedSection>
            </AnimatedCard>

            {/* Detailed Explanation */}
            <AnimatedCard delay={0.3}>
              <AnimatedSection title="Topic Explanation" delay={0.4} titleColor="blue.600">
                <VStack spacing={2} align="stretch">
                  {lesson.explanation.map((point, index) => (
                    <AnimatedListItem
                      key={index}
                      text={point}
                      index={index}
                      fontSize={baseFontSize}
                    />
                  ))}
                </VStack>
              </AnimatedSection>
            </AnimatedCard>

            {/* Examples */}
            {lesson.examples.length > 0 && (
              <AnimatedCard delay={0.4} bg="green.50" borderWidth={2} borderColor="green.200">
                <AnimatedSection title="Examples" delay={0.5} titleColor="green.600" borderColor="green.300">
                  <VStack spacing={4} align="stretch">
                    {lesson.examples.map((example, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      >
                        <Box
                          padding={{ base: 4, md: 6 }}
                          borderRadius="lg"
                          bg="white"
                          borderLeftWidth={4}
                          borderLeftColor="green.400"
                          boxShadow="sm"
                        >
                          <HStack spacing={2} marginBottom={3}>
                            <Badge colorScheme="green" fontSize={baseFontSize}>
                              Example {index + 1}
                            </Badge>
                          </HStack>
                          <Text fontSize={baseFontSize} lineHeight="tall" color="gray.700">
                            {example}
                          </Text>
                        </Box>
                      </motion.div>
                    ))}
                  </VStack>
                </AnimatedSection>
              </AnimatedCard>
            )}

            {/* Key Points */}
            <AnimatedCard delay={0.5} bg="yellow.50" borderWidth={2} borderColor="yellow.300">
              <AnimatedSection
                title="📌 Top 20 Key Points to Remember"
                delay={0.6}
                titleColor="yellow.700"
                borderColor="yellow.400"
              >
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 2 }}
                  spacing={4}
                  width="100%"
                >
                  {lesson.keyPoints.map((point, index) => (
                    <KeyPointCard
                      key={index}
                      point={point}
                      index={index}
                      fontSize={baseFontSize}
                    />
                  ))}
                </SimpleGrid>
              </AnimatedSection>
            </AnimatedCard>

            {/* Summary */}
            <AnimatedCard delay={0.6} bg="purple.50" borderWidth={2} borderColor="purple.300">
              <AnimatedSection title="Summary" delay={0.7} titleColor="purple.700" borderColor="purple.400">
                <Text fontSize={baseFontSize} lineHeight="tall" color="gray.700" fontWeight="medium">
                  {lesson.summary}
                </Text>
              </AnimatedSection>
            </AnimatedCard>

            {/* Action Buttons */}
            <AnimatedCard delay={0.7} boxShadow="xl">
              <VStack spacing={4}>
                {sessionSaved && (
                  <Alert status="success" borderRadius="lg">
                    <AlertIcon />
                    <Text fontSize={baseFontSize}>Your study session has been saved! 📚</Text>
                  </Alert>
                )}
                <HStack
                  spacing={4}
                  justifyContent="center"
                  flexWrap="wrap"
                  width="100%"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      colorScheme="blue"
                      size="lg"
                      onClick={handleTakeQuiz}
                      fontSize={baseFontSize}
                      px={8}
                    >
                      Take Quiz on This Topic 🎯
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      colorScheme="gray"
                      size="lg"
                      onClick={handleBackToDashboard}
                      fontSize={baseFontSize}
                      px={8}
                    >
                      Back to Dashboard
                    </Button>
                  </motion.div>
                </HStack>
              </VStack>
            </AnimatedCard>
          </VStack>
        </Container>
      </Box>
    );
  }

  return null;
};
