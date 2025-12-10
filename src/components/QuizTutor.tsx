/**
 * QuizTutor component - Main component managing the quiz flow
 */

import { useState, useCallback, useEffect, useRef } from 'react';
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
} from '@/shared/design-system';
import { AllQuestionsView } from './AllQuestionsView';
import { Timer } from './Timer';
import { ResultsView } from './ResultsView';
import { ConfigurationForm } from './ConfigurationForm';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateQuizQuestions, generateImprovementTips } from '@/services/openai';
import { quizApi, authApi } from '@/services/api';
import { QuizConfig, AnswerResult, Question } from '@/types/quiz';
import { QUIZ_CONSTANTS } from '@/constants/quiz';
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
  const [config, setConfig] = useState<QuizConfig | null>(
    location.state?.config || null
  );
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
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleConfigComplete = useCallback(async (quizConfig: {
    subject: string;
    subtopics: string[];
    questionCount?: number;
    difficulty: string;
  }) => {
    // Get user profile data
    const { user } = authApi.getCurrentUser();
    const userProfile = user as User | null;
    
    if (!userProfile || !userProfile.age || !userProfile.preferredLanguage) {
      setError('Please complete your profile first. Go to Profile to set your age and preferred language.');
      setPhase('config');
      return;
    }

    const fullConfig: QuizConfig = {
      age: userProfile.age,
      language: userProfile.preferredLanguage as QuizConfig['language'],
      subject: quizConfig.subject as QuizConfig['subject'],
      subtopics: quizConfig.subtopics,
      questionCount: quizConfig.questionCount || QUIZ_CONSTANTS.DEFAULT_QUESTIONS,
      difficulty: quizConfig.difficulty as QuizConfig['difficulty'],
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
  }, []);

  // Timer effect
  useEffect(() => {
    if (phase === 'quiz' && timeRemaining > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
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
  }, [phase, timeRemaining]);

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

  const handleSubmitQuiz = useCallback(async () => {
    if (phase !== 'quiz' || questions.length === 0) {
      return;
    }

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
      // Get wrong answers for improvement tips
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
    } catch (err) {
      // Continue to results even if tips generation fails
      console.error('Failed to generate improvement tips:', err);
      setPhase('results');
    }
  }, [phase, questions, answers, config, quizStartTime]);

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

  // Auto-start quiz if config is passed from Study mode
  useEffect(() => {
    if (config && phase === 'config') {
      handleConfigComplete(config);
    }
  }, [config, phase, handleConfigComplete]);

  const score = allAnswerResults.filter((r) => r.isCorrect).length;
  const answeredCount = answers.size;

  if (phase === 'config') {
    return (
      <Box padding={6}>
        <ConfigurationForm onConfigComplete={handleConfigComplete} />
        {error && (
          <Alert status="error" marginTop={4} maxWidth="600px" marginX="auto">
            <AlertIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </Box>
    );
  }

  if (phase === 'loading') {
    return (
      <Box padding={6} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text fontSize="lg">
            {config ? 'Generating your quiz questions...' : 'Loading results...'}
          </Text>
        </VStack>
      </Box>
    );
  }

  if (phase === 'quiz' && questions.length > 0) {
    return (
      <Box padding={6}>
        <VStack spacing={6}>
          {config && (
            <>
              <Timer
                timeRemaining={timeRemaining}
                totalTime={config.questionCount * QUIZ_CONSTANTS.TIME_PER_QUESTION_SECONDS}
              />

              <Box width="100%" maxWidth="1000px" marginX="auto">
                <Text fontSize="md" color="gray.600" textAlign="center">
                  Answered: {answeredCount} of {config.questionCount} questions
                </Text>
              </Box>
            </>
          )}

          <AllQuestionsView
            questions={questions}
            answers={answers}
            onAnswerSelect={handleAnswerSelect}
          />

          <Box width="100%" maxWidth="1000px" marginX="auto">
            <Button
              colorScheme="green"
              size="lg"
              onClick={handleSubmitQuiz}
              width="100%"
              isDisabled={answeredCount === 0}
            >
              Submit Quiz ({answeredCount}/{config?.questionCount || 0} answered)
            </Button>
          </Box>
        </VStack>
      </Box>
    );
  }

  if (phase === 'results' && config && allAnswerResults.length > 0) {
    return (
      <Box padding={6}>
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
    );
  }

  return null;
};
