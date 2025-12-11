/**
 * QuizTutor component - Main component managing the quiz flow
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  VStack,
  Text,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from '@/shared/design-system';
import { AllQuestionsView } from './AllQuestionsView';
import { Timer } from './Timer';
import { ResultsView } from './ResultsView';
import { ConfigurationForm } from './ConfigurationForm';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateQuizQuestions, generateImprovementTips } from '@/services/openai';
import { quizApi, authApi, scheduledTestsApi, profileApi, planApi } from '@/services/api';
import { QuizConfig, AnswerResult, Question } from '@/types/quiz';
import { QUIZ_CONSTANTS, SUBJECTS, MESSAGES } from '@/constants/quiz';
import { isValidAnswer } from '@/utils/validation';
import { User } from '@/types';

type QuizPhase = 'config' | 'loading' | 'quiz' | 'results';

/**
 * Main quiz tutor component that manages the entire quiz flow
 * Handles configuration, question display, answer tracking, and results
 */
export const QuizTutor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [phase, setPhase] = useState<QuizPhase>('config');
  const [config, setConfig] = useState<QuizConfig | null>(() => {
    try {
      return (location.state as { config?: QuizConfig })?.config || null;
    } catch {
      return null;
    }
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Map<number, 'A' | 'B' | 'C' | 'D'>>(
    new Map()
  );
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [allAnswerResults, setAllAnswerResults] = useState<AnswerResult[]>([]);
  const [improvementTips, setImprovementTips] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [resultSaved, setResultSaved] = useState(false);
  const [scheduledTestId, setScheduledTestId] = useState<string | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedScheduledTestRef = useRef(false);
  const beepPlayedRef = useRef(false);
  const totalTimeRef = useRef<number>(0);
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const pendingNavigationRef = useRef<(() => void) | null>(null);
  const isSubmittingRef = useRef(false);

  const handleConfigComplete = useCallback(async (quizConfig: {
    subject: string;
    subtopics: string[];
    questionCount?: number;
    difficulty: string;
    instructions?: string;
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
    
    // Validate user profile has required fields
    if (!userProfile || !userProfile.age || !userProfile.preferredLanguage) {
      setError('Please complete your profile first. Go to Profile to set your age and preferred language.');
      setPhase('config');
      return;
    }

    // Check plan limits before starting quiz (only for AI-generated quizzes, not scheduled tests)
    if (!scheduledTestId) {
      try {
        const { user } = authApi.getCurrentUser();
        if (user && (user as { id: string }).id) {
          const planInfo = await planApi.getUserPlan((user as { id: string }).id);
          if (planInfo.limits.remainingQuizzes <= 0) {
            setError(
              `Daily quiz limit reached. You have used ${planInfo.usage.quizCount} of ${planInfo.limits.dailyQuizLimit} quizzes today. Please try again tomorrow or upgrade your plan.`
            );
            setPhase('config');
            return;
          }
        }
      } catch (planError) {
        // If plan check fails, log warning but allow quiz to proceed
        console.warn('Failed to check plan limits:', planError);
      }
    }

    const fullConfig: QuizConfig = {
      age: userProfile.age,
      language: userProfile.preferredLanguage as QuizConfig['language'],
      subject: quizConfig.subject as QuizConfig['subject'],
      subtopics: quizConfig.subtopics,
      questionCount: quizConfig.questionCount || QUIZ_CONSTANTS.DEFAULT_QUESTIONS,
      difficulty: quizConfig.difficulty as QuizConfig['difficulty'],
      instructions: quizConfig.instructions,
    };
    setConfig(fullConfig);
    setPhase('loading');
    setError(null);

    try {
      const generatedQuestions = await generateQuizQuestions(fullConfig);
      setQuestions(generatedQuestions);
      setPhase('quiz');
      setAnswers(new Map());
      // Calculate timer based on question count
      const totalTime = fullConfig.questionCount * QUIZ_CONSTANTS.TIME_PER_QUESTION_SECONDS;
      totalTimeRef.current = totalTime;
      beepPlayedRef.current = false;
      setTimeRemaining(totalTime);
      setAllAnswerResults([]);
      setImprovementTips([]);
      setQuizStartTime(Date.now());
      setResultSaved(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate quiz questions. Please try again.'
      );
      setPhase('config');
    }
  }, [scheduledTestId]);

  /**
   * Detect location changes during quiz and block navigation away from quiz page
   */
  const previousPathnameRef = useRef<string>(location.pathname);
  useEffect(() => {
    if (
      phase === 'quiz' &&
      previousPathnameRef.current === '/quiz' &&
      location.pathname !== '/quiz' &&
      !isSubmittingRef.current
    ) {
      // User navigated away from quiz page - navigate back and show confirmation
      navigate('/quiz', { replace: true });
      // Show confirmation modal
      onConfirmOpen();
    }
    previousPathnameRef.current = location.pathname;
  }, [location.pathname, phase, navigate, onConfirmOpen]);

  /**
   * Submit quiz and process results
   */
  const handleSubmitQuiz = useCallback(async () => {
    if (phase !== 'quiz' || questions.length === 0 || isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;

    // Clear timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // Process all answers
    const answerResults: AnswerResult[] = questions.map((question) => {
      const childAnswer = answers.get(question.number) || null;
      const isCorrect = childAnswer === question.correctAnswer;

      return {
        questionNumber: question.number,
        question: question.question,
        childAnswer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        isCorrect,
        options: question.options,
      };
    });

    setAllAnswerResults(answerResults);
    setPhase('loading');

    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);
    const correctCount = answerResults.filter((r) => r.isCorrect).length;
    const wrongCount = answerResults.filter((r) => !r.isCorrect).length;
    const scorePercentage = Math.round((correctCount / answerResults.length) * 100);

    // Save quiz result to backend
    try {
      const { user } = authApi.getCurrentUser();
      if (user && config) {
        const explanations = answerResults
          .filter((r) => !r.isCorrect)
          .map((r) => `Q${r.questionNumber}: ${r.explanation}`)
          .join(' | ');

        await quizApi.saveQuizResult({
          user_id: (user as { id: string }).id,
          timestamp: new Date().toISOString(),
          subject: config.subject,
          subtopic: config.subtopics.join(', '),
          age: config.age,
          language: config.language,
          answers: answerResults,
          correct_count: correctCount,
          wrong_count: wrongCount,
          explanation_of_mistakes: explanations,
          time_taken: timeTaken,
          score_percentage: scorePercentage,
        });
        setResultSaved(true);
      }
    } catch (err) {
      // Continue even if save fails
      console.error('Failed to save quiz result:', err);
    }

    try {
      // Only generate AI improvement tips for AI-generated quizzes, not scheduled tests
      if (scheduledTestId) {
        // For scheduled tests, use simple tips without AI
        const wrongCount = answerResults.filter((r) => !r.isCorrect).length;
        if (wrongCount === 0) {
          setImprovementTips(['Great job! You answered all questions correctly! 🎉']);
        } else {
          setImprovementTips([
            `You got ${correctCount} out of ${answerResults.length} questions correct!`,
            'Review the explanations to understand the correct answers.',
            'Keep practicing to improve your score!',
          ]);
        }
        setPhase('results');
      } else {
        // Generate AI improvement tips for AI-generated quizzes
        const wrongAnswers = answerResults
          .filter((r) => !r.isCorrect)
          .map((r) => ({
            questionNumber: r.questionNumber,
            question: r.question,
            childAnswer: r.childAnswer || '',
            correctAnswer: r.correctAnswer,
            explanation: r.explanation,
          }));

        if (config && wrongAnswers.length > 0) {
          const tips = await generateImprovementTips(
            wrongAnswers,
            config.age,
            config.language
          );
          setImprovementTips(tips);
        } else {
          setImprovementTips(['Great job! You answered all questions correctly! 🎉']);
        }
        setPhase('results');
      }
    } catch (err) {
      // Continue to results even if tips generation fails
      console.error('Failed to generate improvement tips:', err);
      setPhase('results');
    } finally {
      // Reset submitting flag after a delay to allow navigation
      setTimeout(() => {
        isSubmittingRef.current = false;
      }, 1000);
    }
  }, [phase, questions, answers, config, quizStartTime, scheduledTestId]);

  /**
   * Handle confirmation to submit quiz and navigate
   */
  const handleConfirmLeave = useCallback(async () => {
    if (phase !== 'quiz' || isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    onConfirmClose();

    // Submit quiz before navigating
    await handleSubmitQuiz();

    // Execute pending navigation if exists
    if (pendingNavigationRef.current) {
      pendingNavigationRef.current();
      pendingNavigationRef.current = null;
    }
  }, [phase, onConfirmClose, handleSubmitQuiz]);

  /**
   * Handle cancel - stay on quiz page
   */
  const handleCancelLeave = useCallback(() => {
    onConfirmClose();
    pendingNavigationRef.current = null;
  }, [onConfirmClose]);

  /**
   * Prevent page refresh/back button during quiz
   */
  useEffect(() => {
    if (phase === 'quiz') {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = MESSAGES.QUIZ_REFRESH_WARNING;
        return e.returnValue;
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [phase]);

  /**
   * Intercept link clicks during quiz
   */
  useEffect(() => {
    if (phase !== 'quiz') {
      return;
    }

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;

      if (link && link.href) {
        const currentOrigin = window.location.origin;
        const linkUrl = new URL(link.href, window.location.href);

        // Only intercept internal navigation
        if (linkUrl.origin === currentOrigin && linkUrl.pathname !== location.pathname) {
          e.preventDefault();
          e.stopPropagation();

          // Store navigation function
          pendingNavigationRef.current = () => {
            navigate(linkUrl.pathname + linkUrl.search);
          };
          onConfirmOpen();
        }
      }
    };

    document.addEventListener('click', handleLinkClick, true);

    return () => {
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, [phase, location.pathname, navigate, onConfirmOpen]);

  /**
   * Play beep sound
   */
  const playBeep = useCallback(() => {
    try {
      // Check if AudioContext is available
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('AudioContext not available');
        return;
      }

      // Create audio context for beep sound
      const audioContext = new AudioContextClass();
      if (!audioContext) {
        console.warn('Failed to create AudioContext');
        return;
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // Beep frequency
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (err) {
      // Silently fail - beep is not critical functionality
      console.warn('Could not play beep sound:', err);
    }
  }, []);

  // Timer effect with beep alert at 20% time remaining
  useEffect(() => {
    if (phase === 'quiz' && timeRemaining > 0 && totalTimeRef.current > 0) {
      // Calculate 20% threshold
      const twentyPercentThreshold = Math.ceil(totalTimeRef.current * 0.2);
      
      // Play beep when crossing 20% threshold
      if (timeRemaining <= twentyPercentThreshold && !beepPlayedRef.current) {
        playBeep();
        beepPlayedRef.current = true;
      }

      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          // Check for 20% threshold on each tick
          if (totalTimeRef.current > 0) {
            const threshold = Math.ceil(totalTimeRef.current * 0.2);
            if (prev <= threshold && !beepPlayedRef.current) {
              playBeep();
              beepPlayedRef.current = true;
            }
          }
          
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [phase, timeRemaining, playBeep]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (phase === 'quiz' && timeRemaining === 0 && questions.length > 0) {
      handleSubmitQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeRemaining, questions.length]);

  const handleAnswerSelect = useCallback(
    (questionNumber: number, answer: 'A' | 'B' | 'C' | 'D') => {
      if (!isValidAnswer(answer) || phase !== 'quiz') {
        return;
      }

      setAnswers((prevAnswers) => {
        const newAnswers = new Map(prevAnswers);
        newAnswers.set(questionNumber, answer);
        return newAnswers;
      });
    },
    [phase]
  );

  const handleStartNewQuiz = useCallback(() => {
    navigate('/quiz');
  }, [navigate]);

  const handleBackToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const handleRetrySameTopic = useCallback(() => {
    if (!config) {
      return;
    }
    handleConfigComplete(config);
  }, [config, handleConfigComplete]);

  /**
   * Loads and starts/resumes a scheduled test quiz
   */
  const loadScheduledTest = useCallback(async (testId: string, attemptId?: string | null, resume?: boolean) => {
    // Prevent multiple calls
    if (hasLoadedScheduledTestRef.current) {
      return;
    }
    hasLoadedScheduledTestRef.current = true;

    try {
      setPhase('loading');
      setError(null);

      // Get scheduled test details
      const testData = await scheduledTestsApi.getScheduledTest(testId);
      const test = testData.scheduledTest;

      // Check if test is visible
      const now = new Date();
      const visibleFrom = new Date(test.visible_from);
      if (visibleFrom > now) {
        setError('This test is not available yet. Please check back later.');
        setPhase('config');
        hasLoadedScheduledTestRef.current = false;
        return;
      }

      // Check if test has expired
      if (test.visible_until) {
        const visibleUntil = new Date(test.visible_until);
        if (visibleUntil < now) {
          setError('This test has expired.');
          setPhase('config');
          hasLoadedScheduledTestRef.current = false;
          return;
        }
      }

      let attemptData: any;
      let quiz: any;
      let restoredAnswers = new Map<number, 'A' | 'B' | 'C' | 'D'>();
      let timeElapsed = 0;

      // Resume existing attempt if attemptId is provided
      if (resume && attemptId) {
        try {
          // Get existing attempt and quiz data
          attemptData = await quizApi.getQuizAttempt(attemptId);
          quiz = attemptData.quiz;
          
          // Calculate time elapsed since start
          if (attemptData.attempt.started_at) {
            const startTime = new Date(attemptData.attempt.started_at).getTime();
            timeElapsed = Math.floor((Date.now() - startTime) / 1000);
          }
          
          // Restore answers from existing attempt
          if (attemptData.attempt.answers && Array.isArray(attemptData.attempt.answers)) {
            attemptData.attempt.answers.forEach((answer: { question_id: string; user_answer: string }) => {
              // Find question number by matching question_id
              const questionIndex = quiz.questions.findIndex((q: any) => q.id === answer.question_id);
              if (questionIndex !== -1) {
                try {
                  const userAnswer = JSON.parse(answer.user_answer);
                  const answerKey = typeof userAnswer === 'string' ? userAnswer.toUpperCase() : String(userAnswer).toUpperCase();
                  if (['A', 'B', 'C', 'D'].includes(answerKey)) {
                    restoredAnswers.set(questionIndex + 1, answerKey as 'A' | 'B' | 'C' | 'D');
                  }
                } catch {
                  // If parsing fails, try direct value
                  const answerKey = answer.user_answer.toUpperCase();
                  if (['A', 'B', 'C', 'D'].includes(answerKey)) {
                    restoredAnswers.set(questionIndex + 1, answerKey as 'A' | 'B' | 'C' | 'D');
                  }
                }
              }
            });
          }
        } catch (err) {
          // If resume fails, start new attempt
          console.warn('Failed to resume attempt, starting new one:', err);
          attemptData = await quizApi.startQuizAttempt(test.quiz_id);
          quiz = attemptData.quiz;
          restoredAnswers = new Map<number, 'A' | 'B' | 'C' | 'D'>();
          timeElapsed = 0;
        }
      } else {
        // Start new quiz attempt
        attemptData = await quizApi.startQuizAttempt(test.quiz_id);
        quiz = attemptData.quiz;
        restoredAnswers = new Map<number, 'A' | 'B' | 'C' | 'D'>();
        timeElapsed = 0;
      }

      // Map API questions to Question format
      const mappedQuestions: Question[] = quiz.questions.map((q: any, index: number) => {
        const options = q.options as Record<string, string>;
        
        // Convert options to the format expected by Question type
        const questionOptions: { A: string; B: string; C: string; D: string } = {
          A: options.A || '',
          B: options.B || '',
          C: options.C || '',
          D: options.D || '',
        };

        // Get correct answer from question data
        let correctAnswer: 'A' | 'B' | 'C' | 'D' = 'A';
        if (q.correct_answer) {
          try {
            // Parse if it's JSON string
            const parsed = JSON.parse(q.correct_answer);
            const answerStr = typeof parsed === 'string' ? parsed : String(parsed);
            correctAnswer = answerStr.toUpperCase() as 'A' | 'B' | 'C' | 'D';
          } catch {
            // If not JSON, use directly
            correctAnswer = q.correct_answer.toUpperCase() as 'A' | 'B' | 'C' | 'D';
          }
        }

        return {
          number: index + 1,
          question: q.question_text,
          options: questionOptions,
          correctAnswer,
          explanation: q.explanation || '',
        };
      });

      // Extract age from age group (e.g., "6-8" -> 6)
      const ageMatch = test.quiz_age_group.match(/^(\d+)/);
      const age = ageMatch ? parseInt(ageMatch[1], 10) : 8;

      // Set up quiz config for scheduled test
      const scheduledConfig: QuizConfig = {
        age,
        language: 'English', // Default, adjust if available in test data
        subject: SUBJECTS.OTHER, // Use valid subject type
        subtopics: [test.quiz_name],
        questionCount: quiz.number_of_questions,
        difficulty: test.quiz_difficulty as QuizConfig['difficulty'],
      };

      setConfig(scheduledConfig);
      setQuestions(mappedQuestions);
      setAnswers(restoredAnswers);
      setPhase('quiz');

      // Set timer based on time limit or default
      const timeLimitMinutes = test.time_limit || test.duration_minutes || Math.ceil(quiz.number_of_questions * QUIZ_CONSTANTS.TIME_PER_QUESTION_SECONDS / 60);
      const totalTimeSeconds = timeLimitMinutes * 60;
      const remainingTime = Math.max(0, totalTimeSeconds - timeElapsed);
      totalTimeRef.current = totalTimeSeconds;
      
      // Reset beep flag if we're resuming and haven't crossed 20% threshold yet
      const twentyPercentThreshold = Math.ceil(totalTimeSeconds * 0.2);
      beepPlayedRef.current = remainingTime <= twentyPercentThreshold;
      
      setTimeRemaining(remainingTime);
      setQuizStartTime(Date.now() - (timeElapsed * 1000));
      setAllAnswerResults([]);
      setImprovementTips([]);
      setResultSaved(false);
    } catch (err) {
      console.error('Failed to load scheduled test:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load scheduled test. Please try again.'
      );
      setPhase('config');
      hasLoadedScheduledTestRef.current = false;
    }
  }, []);

  // Check for scheduled test in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const testId = searchParams.get('scheduledTestId');
    const attemptId = searchParams.get('attemptId');
    const resume = searchParams.get('resume') === 'true';

    if (testId && phase === 'config' && !hasLoadedScheduledTestRef.current) {
      setScheduledTestId(testId);
      loadScheduledTest(testId, attemptId || null, resume);
    }
  }, [location.search, phase, loadScheduledTest]);

  // Auto-start quiz if config is passed from Study mode (only for AI-generated quizzes, not scheduled tests)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const testId = searchParams.get('scheduledTestId');
    
    // Only auto-start AI quiz if there's no scheduled test in URL
    if (config && phase === 'config' && !scheduledTestId && !testId) {
      handleConfigComplete(config);
    }
  }, [config, phase, handleConfigComplete, scheduledTestId, location.search]);

  const score = allAnswerResults.filter((r) => r.isCorrect).length;
  const answeredCount = answers.size;

  if (phase === 'config') {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box padding={{ base: 4, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <ConfigurationForm onConfigComplete={handleConfigComplete} />
            </motion.div>
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert status="error" marginTop={4} maxWidth="600px" marginX="auto" borderRadius="xl">
                    <AlertIcon />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </motion.div>
        {/* Confirmation Modal for Navigation */}
        <Modal isOpen={isConfirmOpen} onClose={handleCancelLeave} isCentered>
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
          <ModalContent>
            <ModalHeader>{MESSAGES.QUIZ_LEAVE_CONFIRMATION_TITLE}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>{MESSAGES.QUIZ_LEAVE_CONFIRMATION_MESSAGE}</Text>
              {config && (
                <Alert status="info" marginTop={4}>
                  <AlertIcon />
                  <AlertDescription>
                    You have answered {answers.size} out of {config.questionCount} questions.
                  </AlertDescription>
                </Alert>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleCancelLeave}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleConfirmLeave}>
                Submit & Leave
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }

  if (phase === 'loading') {
    return (
      <>
        <Box
          padding={{ base: 4, md: 6 }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="semibold" textAlign="center">
                  {scheduledTestId
                    ? 'Loading your scheduled test...'
                    : config
                      ? 'Generating your quiz questions...'
                      : 'Loading results...'}
                </Text>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              >
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Please wait...
                </Text>
              </motion.div>
            </VStack>
          </motion.div>
        </Box>
        {/* Confirmation Modal for Navigation */}
        <Modal isOpen={isConfirmOpen} onClose={handleCancelLeave} isCentered>
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
          <ModalContent>
            <ModalHeader>{MESSAGES.QUIZ_LEAVE_CONFIRMATION_TITLE}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>{MESSAGES.QUIZ_LEAVE_CONFIRMATION_MESSAGE}</Text>
              {config && (
                <Alert status="info" marginTop={4}>
                  <AlertIcon />
                  <AlertDescription>
                    You have answered {answers.size} out of {config.questionCount} questions.
                  </AlertDescription>
                </Alert>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleCancelLeave}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleConfirmLeave}>
                Submit & Leave
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }

  if (phase === 'quiz' && questions.length > 0) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Box padding={{ base: 4, md: 6 }}>
            <VStack spacing={{ base: 4, md: 6 }}>
              {config && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ width: '100%' }}
                >
                  <Timer
                    timeRemaining={timeRemaining}
                    totalTime={totalTimeRef.current || (config.questionCount * QUIZ_CONSTANTS.TIME_PER_QUESTION_SECONDS)}
                  />

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Box width="100%" maxWidth="1000px" marginX="auto" mt={4}>
                      <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600" textAlign="center" fontWeight="medium">
                        Answered: {answeredCount} of {config.questionCount} questions
                      </Text>
                    </Box>
                  </motion.div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ width: '100%' }}
              >
                <AllQuestionsView
                  questions={questions}
                  answers={answers}
                  onAnswerSelect={handleAnswerSelect}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  colorScheme="green"
                  size={{ base: 'md', md: 'lg' }}
                  onClick={handleSubmitQuiz}
                  width="100%"
                  isDisabled={answeredCount === 0}
                  boxShadow="lg"
                  _hover={{ boxShadow: 'xl' }}
                  transition="all 0.2s"
                >
                  Submit Quiz ({answeredCount}/{config?.questionCount || 0} answered)
                </Button>
              </motion.div>
            </VStack>
          </Box>
        </motion.div>
        {/* Confirmation Modal for Navigation */}
        <Modal isOpen={isConfirmOpen} onClose={handleCancelLeave} isCentered>
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
          <ModalContent>
            <ModalHeader>{MESSAGES.QUIZ_LEAVE_CONFIRMATION_TITLE}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>{MESSAGES.QUIZ_LEAVE_CONFIRMATION_MESSAGE}</Text>
              {config && (
                <Alert status="info" marginTop={4}>
                  <AlertIcon />
                  <AlertDescription>
                    You have answered {answers.size} out of {config.questionCount} questions.
                  </AlertDescription>
                </Alert>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleCancelLeave}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleConfirmLeave}>
                Submit & Leave
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }

  if (phase === 'results' && config && allAnswerResults.length > 0) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box padding={{ base: 4, md: 6 }}>
            <ResultsView
              score={score}
              totalQuestions={config.questionCount}
              allAnswerResults={allAnswerResults}
              config={config}
              improvementTips={improvementTips}
              resultSaved={resultSaved}
              timeTaken={Math.floor((Date.now() - quizStartTime) / 1000)}
              onStartNewQuiz={handleStartNewQuiz}
              onRetrySameTopic={handleRetrySameTopic}
              onBackToDashboard={handleBackToDashboard}
            />
          </Box>
        </motion.div>
        {/* Confirmation Modal for Navigation */}
        <Modal isOpen={isConfirmOpen} onClose={handleCancelLeave} isCentered>
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
          <ModalContent>
            <ModalHeader>{MESSAGES.QUIZ_LEAVE_CONFIRMATION_TITLE}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>{MESSAGES.QUIZ_LEAVE_CONFIRMATION_MESSAGE}</Text>
              {config && (
                <Alert status="info" marginTop={4}>
                  <AlertIcon />
                  <AlertDescription>
                    You have answered {answers.size} out of {config.questionCount} questions.
                  </AlertDescription>
                </Alert>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleCancelLeave}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleConfirmLeave}>
                Submit & Leave
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <>
      {/* Confirmation Modal for Navigation */}
      <Modal isOpen={isConfirmOpen} onClose={handleCancelLeave} isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader>{MESSAGES.QUIZ_LEAVE_CONFIRMATION_TITLE}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{MESSAGES.QUIZ_LEAVE_CONFIRMATION_MESSAGE}</Text>
            {config && (
              <Alert status="info" marginTop={4}>
                <AlertIcon />
                <AlertDescription>
                  You have answered {answers.size} out of {config.questionCount} questions.
                </AlertDescription>
              </Alert>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleCancelLeave}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleConfirmLeave}>
              Submit & Leave
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
