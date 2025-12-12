/**
 * Quiz Management Component
 * Create quizzes with AI generation or JSON upload, and schedule tests with users based on plans
 */

import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Input,
  Select,
  Card,
  CardBody,
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
  FormControl,
  FormLabel,
  Textarea,
  Badge,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  CheckboxGroup,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@/shared/design-system';
import { adminApi, scheduledTestsApi, ScheduledTest } from '@/services/admin';
import { planApi } from '@/services/api';
import { Topic, Subtopic, Quiz, QuizQuestion } from '@/services/admin';
import { QuizReport } from './quiz/QuizReport';

/**
 * Quiz Management component
 */
export const QuizManagement: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [plans, setPlans] = useState<Array<{ id: string; name: string }>>([]);
  const [scheduledTests, setScheduledTests] = useState<ScheduledTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isScheduleOpen, onOpen: onScheduleOpen, onClose: onScheduleClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isViewScheduledTestOpen, onOpen: onViewScheduledTestOpen, onClose: onViewScheduledTestClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isEditQuizOpen, onOpen: onEditQuizOpen, onClose: onEditQuizClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState(0);
  const [createModalTab, setCreateModalTab] = useState(0);
  const [editQuizModalTab, setEditQuizModalTab] = useState(0);
  const [, setSelectedQuiz] = useState<Quiz | null>(null);
  const [viewingQuiz, setViewingQuiz] = useState<{ quiz: Quiz; questions: QuizQuestion[] } | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [viewingScheduledTest, setViewingScheduledTest] = useState<ScheduledTest | null>(null);
  const [editingScheduledTestId, setEditingScheduledTestId] = useState<string | null>(null);
  const [reportScheduledTestId, setReportScheduledTestId] = useState<string | null>(null);
  const { isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose } = useDisclosure();
  const toast = useToast();

  // AI Generation Form State
  const [aiFormData, setAiFormData] = useState({
    name: '',
    description: '',
    ageGroup: '',
    difficulty: '',
    numberOfQuestions: 15,
    passingPercentage: 60,
    timeLimit: '',
    topics: [] as string[],
    language: 'English',
  });

  // JSON Upload Form State
  const [jsonFormData, setJsonFormData] = useState({
    name: '',
    description: '',
    ageGroup: '',
    difficulty: '',
    passingPercentage: 60,
    timeLimit: '',
    jsonContent: '',
  });

  // Edit Quiz Form State
  const [editQuizFormData, setEditQuizFormData] = useState({
    name: '',
    description: '',
    ageGroup: '',
    difficulty: '',
    numberOfQuestions: 15,
    passingPercentage: 60,
    timeLimit: '',
    subtopicId: '',
    isActive: true,
  });

  // Edit Quiz JSON Upload Form State
  const [editQuizJsonFormData, setEditQuizJsonFormData] = useState({
    jsonContent: '',
  });

  // Schedule Test Form State
  const [scheduleFormData, setScheduleFormData] = useState({
    quizId: '',
    scheduledFor: '',
    visibleFrom: '',
    visibleUntil: '',
    durationMinutes: '',
    planIds: [] as string[],
    userIds: [] as string[],
    instructions: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      loadSubtopics(selectedTopic);
    } else {
      setSubtopics([]);
      setSelectedSubtopic('');
    }
  }, [selectedTopic]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadQuizzes(),
        loadTopics(),
        loadPlans(),
        loadScheduledTests(),
      ]);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadQuizzes = async () => {
    try {
      const data = await adminApi.getAllQuizzes();
      // Map snake_case fields from database to camelCase for frontend
      const mappedQuizzes = data.quizzes.map((quiz: any) => mapQuizData(quiz));
      setQuizzes(mappedQuizzes);
    } catch (err) {
      console.error('Failed to load quizzes', err);
    }
  };

  const loadTopics = async () => {
    try {
      const data = await adminApi.getTopics({ isActive: true });
      setTopics(data.topics);
    } catch (err) {
      console.error('Failed to load topics', err);
    }
  };

  const loadSubtopics = async (topicId: string) => {
    try {
      const data = await adminApi.getTopic(topicId);
      setSubtopics(data.subtopics);
    } catch (err) {
      console.error('Failed to load subtopics', err);
    }
  };

  const loadPlans = async () => {
    try {
      const data = await planApi.getAllPlans();
      setPlans(data.plans.filter((p) => p.status === 'active'));
    } catch (err) {
      console.error('Failed to load plans', err);
    }
  };

  const loadScheduledTests = async () => {
    try {
      const data = await scheduledTestsApi.getScheduledTests();
      // Map snake_case fields from database to camelCase for frontend
      const mappedTests = data.scheduledTests.map((test: any) => ({
        ...test,
        quizName: test.quiz_name || test.quizName,
        quizDescription: test.quiz_description || test.quizDescription,
        scheduledBy: test.scheduled_by || test.scheduledBy,
        scheduledByName: test.scheduled_by_name || test.scheduledByName,
        scheduledFor: test.scheduled_for || test.scheduledFor,
        visibleFrom: test.visible_from || test.visibleFrom,
        visibleUntil: test.visible_until || test.visibleUntil,
        durationMinutes: test.duration_minutes || test.durationMinutes,
        planIds: test.plan_ids || test.planIds || [],
        userIds: test.user_ids || test.userIds || [],
        createdAt: test.created_at || test.createdAt,
        updatedAt: test.updated_at || test.updatedAt,
      }));
      setScheduledTests(mappedTests);
    } catch (err) {
      console.error('Failed to load scheduled tests', err);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiFormData.name || !aiFormData.ageGroup || !aiFormData.difficulty) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      await adminApi.generateQuiz({
        subtopicId: selectedSubtopic && selectedSubtopic.trim() ? selectedSubtopic : undefined,
        name: aiFormData.name,
        description: aiFormData.description,
        ageGroup: aiFormData.ageGroup,
        difficulty: aiFormData.difficulty,
        numberOfQuestions: aiFormData.numberOfQuestions,
        passingPercentage: aiFormData.passingPercentage,
        timeLimit: aiFormData.timeLimit ? parseInt(aiFormData.timeLimit) : undefined,
        topics: aiFormData.topics,
        language: aiFormData.language,
      });

      toast({
        title: 'Success',
        description: 'Quiz generated successfully with AI',
        status: 'success',
        duration: 3000,
      });

      onClose();
      setAiFormData({
        name: '',
        description: '',
        ageGroup: '',
        difficulty: '',
        numberOfQuestions: 15,
        passingPercentage: 60,
        timeLimit: '',
        topics: [],
        language: 'English',
      });
      setSelectedTopic('');
      setSelectedSubtopic('');
      await loadQuizzes();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate quiz';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJSONUpload = async () => {
    if (!jsonFormData.name || !jsonFormData.ageGroup || !jsonFormData.difficulty || !jsonFormData.jsonContent) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields and provide JSON content',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      let questions;
      try {
        questions = JSON.parse(jsonFormData.jsonContent);
      } catch (parseError) {
        toast({
          title: 'Invalid JSON',
          description: 'Please provide valid JSON format',
          status: 'error',
          duration: 3000,
        });
        return;
      }

      if (!Array.isArray(questions) || questions.length === 0) {
        toast({
          title: 'Invalid Format',
          description: 'Questions must be a non-empty array',
          status: 'error',
          duration: 3000,
        });
        return;
      }

      // Validate each question has mandatory fields
      const validQuestionTypes = ['multiple_choice', 'true_false', 'fill_blank', 'match_pairs', 'image_based'];
      const validationErrors: string[] = [];

      questions.forEach((q: any, index: number) => {
        const questionNum = index + 1;

        // Check mandatory fields - support both 'question' and 'questionText'
        const questionText = q.question || q.questionText;
        if (!questionText || (typeof questionText === 'string' && questionText.trim() === '')) {
          validationErrors.push(`Question ${questionNum}: Missing or empty 'question' or 'questionText' field`);
        }

        if (!q.correctAnswer) {
          validationErrors.push(`Question ${questionNum}: Missing 'correctAnswer' field`);
        }

        // For multiple choice questions, options are mandatory
        const questionType = q.questionType || 'multiple_choice';
        if (questionType === 'multiple_choice') {
          if (!q.options || typeof q.options !== 'object' || Object.keys(q.options).length === 0) {
            validationErrors.push(`Question ${questionNum}: Missing or empty 'options' field (required for multiple choice)`);
          } else {
            // Validate that correctAnswer exists in options
            const correctAnswer = String(q.correctAnswer).toUpperCase();
            const optionKeys = Object.keys(q.options).map((k: string) => k.toUpperCase());
            if (!optionKeys.includes(correctAnswer)) {
              validationErrors.push(`Question ${questionNum}: 'correctAnswer' "${q.correctAnswer}" not found in options`);
            }
          }
        }

        // Validate questionType if provided
        if (q.questionType && !validQuestionTypes.includes(q.questionType)) {
          validationErrors.push(`Question ${questionNum}: Invalid 'questionType'. Must be one of: ${validQuestionTypes.join(', ')}`);
        }

        // Validate correctAnswer format
        if (q.correctAnswer && typeof q.correctAnswer !== 'string' && !Array.isArray(q.correctAnswer)) {
          validationErrors.push(`Question ${questionNum}: 'correctAnswer' must be a string or array`);
        }

        // Validate options format if provided
        if (q.options && typeof q.options !== 'object') {
          validationErrors.push(`Question ${questionNum}: 'options' must be an object`);
        }

        // Validate points if provided
        if (q.points !== undefined && (typeof q.points !== 'number' || q.points < 0)) {
          validationErrors.push(`Question ${questionNum}: 'points' must be a non-negative number`);
        }
      });

      if (validationErrors.length > 0) {
        toast({
          title: 'Validation Errors',
          description: validationErrors.slice(0, 5).join('; ') + (validationErrors.length > 5 ? ` ... and ${validationErrors.length - 5} more` : ''),
          status: 'error',
          duration: 8000,
          isClosable: true,
        });
        return;
      }

      setLoading(true);
      await adminApi.uploadQuiz({
        subtopicId: selectedSubtopic && selectedSubtopic.trim() ? selectedSubtopic : undefined,
        name: jsonFormData.name,
        description: jsonFormData.description,
        ageGroup: jsonFormData.ageGroup,
        difficulty: jsonFormData.difficulty,
        passingPercentage: jsonFormData.passingPercentage,
        timeLimit: jsonFormData.timeLimit ? parseInt(jsonFormData.timeLimit) : undefined,
        questions,
      });

      toast({
        title: 'Success',
        description: 'Quiz uploaded successfully',
        status: 'success',
        duration: 3000,
      });

      onClose();
      setJsonFormData({
        name: '',
        description: '',
        ageGroup: '',
        difficulty: '',
        passingPercentage: 60,
        timeLimit: '',
        jsonContent: '',
      });
      setSelectedTopic('');
      setSelectedSubtopic('');
      await loadQuizzes();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload quiz';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadJSONTemplate = () => {
    const template = [
      {
        question: 'What is 2 + 2?',
        questionType: 'multiple_choice',
        options: {
          A: '3',
          B: '4',
          C: '5',
          D: '6',
        },
        correctAnswer: 'B',
        explanation: '2 + 2 equals 4. This is basic addition.',
        justification: 'The sum of two and two is four.',
        hint: 'Think about counting: 2, then 2 more',
        points: 1,
      },
      {
        question: 'Which planet is closest to the Sun?',
        questionType: 'multiple_choice',
        options: {
          A: 'Venus',
          B: 'Mercury',
          C: 'Earth',
          D: 'Mars',
        },
        correctAnswer: 'B',
        explanation: 'Mercury is the closest planet to the Sun in our solar system.',
        justification: 'Mercury orbits closest to the Sun.',
        points: 1,
      },
    ];

    const jsonString = JSON.stringify(template, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quiz-template.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Downloaded',
      description: 'JSON template downloaded successfully',
      status: 'success',
      duration: 3000,
    });
  };

  const handleScheduleTest = async () => {
    if (!scheduleFormData.quizId || !scheduleFormData.scheduledFor || !scheduleFormData.visibleFrom) {
      toast({
        title: 'Validation Error',
        description: 'Quiz, scheduled date, and visible from date are required',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (scheduleFormData.planIds.length === 0 && scheduleFormData.userIds.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one plan or user',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      if (editingScheduledTestId) {
        // Update existing scheduled test
        await scheduledTestsApi.updateScheduledTest(editingScheduledTestId, {
          scheduledFor: scheduleFormData.scheduledFor,
          visibleFrom: scheduleFormData.visibleFrom,
          visibleUntil: scheduleFormData.visibleUntil || undefined,
          durationMinutes: scheduleFormData.durationMinutes ? parseInt(scheduleFormData.durationMinutes) : undefined,
          planIds: scheduleFormData.planIds.length > 0 ? scheduleFormData.planIds : undefined,
          userIds: scheduleFormData.userIds.length > 0 ? scheduleFormData.userIds : undefined,
          instructions: scheduleFormData.instructions || undefined,
        });

        toast({
          title: 'Success',
          description: 'Scheduled test updated successfully',
          status: 'success',
          duration: 3000,
        });
      } else {
        // Create new scheduled test
        await scheduledTestsApi.createScheduledTest({
          quizId: scheduleFormData.quizId,
          scheduledFor: scheduleFormData.scheduledFor,
          visibleFrom: scheduleFormData.visibleFrom,
          visibleUntil: scheduleFormData.visibleUntil || undefined,
          durationMinutes: scheduleFormData.durationMinutes ? parseInt(scheduleFormData.durationMinutes) : undefined,
          planIds: scheduleFormData.planIds.length > 0 ? scheduleFormData.planIds : undefined,
          userIds: scheduleFormData.userIds.length > 0 ? scheduleFormData.userIds : undefined,
          instructions: scheduleFormData.instructions || undefined,
        });

        toast({
          title: 'Success',
          description: 'Test scheduled successfully',
          status: 'success',
          duration: 3000,
        });
      }

      onScheduleClose();
      setEditingScheduledTestId(null);
      setScheduleFormData({
        quizId: '',
        scheduledFor: '',
        visibleFrom: '',
        visibleUntil: '',
        durationMinutes: '',
        planIds: [],
        userIds: [],
        instructions: '',
      });
      await loadScheduledTests();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to schedule test';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewScheduledTest = async (testId: string) => {
    try {
      setLoading(true);
      const data = await scheduledTestsApi.getScheduledTest(testId);
      const test = data.scheduledTest as unknown as {
        quiz_name?: string;
        quiz_description?: string;
        scheduled_by?: string;
        scheduled_by_name?: string;
        scheduled_for?: string;
        visible_from?: string;
        visible_until?: string;
        duration_minutes?: number;
        plan_ids?: string[];
        user_ids?: string[];
        created_at?: string;
        updated_at?: string;
        quizName?: string;
        quizDescription?: string;
        scheduledBy?: string;
        scheduledByName?: string;
        scheduledFor?: string;
        visibleFrom?: string;
        visibleUntil?: string;
        durationMinutes?: number;
        planIds?: string[];
        userIds?: string[];
        createdAt?: string;
        updatedAt?: string;
        plans?: Array<{ id: string; name: string; description?: string }>;
        users?: Array<{ id: string; name: string; email: string }>;
        [key: string]: unknown;
      };
      // Map snake_case to camelCase
      const mappedTest: ScheduledTest = {
        id: test.id as string,
        quizId: (test.quiz_id as string) || (test.quizId as string),
        scheduledBy: (test.scheduled_by as string) || (test.scheduledBy as string),
        scheduledFor: (test.scheduled_for as string) || (test.scheduledFor as string),
        visibleFrom: (test.visible_from as string) || (test.visibleFrom as string),
        visibleUntil: (test.visible_until as string) || (test.visibleUntil as string),
        durationMinutes: (test.duration_minutes as number) || (test.durationMinutes as number),
        planIds: (test.plan_ids as string[]) || (test.planIds as string[]) || [],
        userIds: (test.user_ids as string[]) || (test.userIds as string[]) || [],
        status: test.status as 'scheduled' | 'active' | 'completed' | 'cancelled',
        instructions: test.instructions as string | undefined,
        createdAt: (test.created_at as string) || (test.createdAt as string),
        updatedAt: (test.updated_at as string) || (test.updatedAt as string),
        quizName: (test.quiz_name as string) || (test.quizName as string),
        quizDescription: (test.quiz_description as string) || (test.quizDescription as string),
        scheduledByName: (test.scheduled_by_name as string) || (test.scheduledByName as string),
        plans: test.plans,
        users: test.users,
      };
      setViewingScheduledTest(mappedTest);
      onViewScheduledTestOpen();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load scheduled test';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditScheduledTest = async (testId: string) => {
    try {
      setLoading(true);
      const data = await scheduledTestsApi.getScheduledTest(testId);
      const test = data.scheduledTest as unknown as {
        quiz_id?: string;
        quizId?: string;
        scheduled_for?: string;
        scheduledFor?: string;
        visible_from?: string;
        visibleFrom?: string;
        visible_until?: string;
        visibleUntil?: string;
        duration_minutes?: number;
        durationMinutes?: number;
        plan_ids?: string[];
        planIds?: string[];
        user_ids?: string[];
        userIds?: string[];
        instructions?: string;
        [key: string]: unknown;
      };
      
      // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
      const formatDateTimeLocal = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      const testAny = test as Record<string, unknown>;
      setScheduleFormData({
        quizId: (testAny.quiz_id as string) || (testAny.quizId as string) || '',
        scheduledFor: formatDateTimeLocal((testAny.scheduled_for as string) || (testAny.scheduledFor as string) || ''),
        visibleFrom: formatDateTimeLocal((testAny.visible_from as string) || (testAny.visibleFrom as string) || ''),
        visibleUntil: (testAny.visible_until as string) || (testAny.visibleUntil as string)
          ? formatDateTimeLocal((testAny.visible_until as string) || (testAny.visibleUntil as string) || '')
          : '',
        durationMinutes: (testAny.duration_minutes as number) || (testAny.durationMinutes as number)
          ? String((testAny.duration_minutes as number) || (testAny.durationMinutes as number))
          : '',
        planIds: (testAny.plan_ids as string[]) || (testAny.planIds as string[]) || [],
        userIds: (testAny.user_ids as string[]) || (testAny.userIds as string[]) || [],
        instructions: (testAny.instructions as string) || '',
      });
      setEditingScheduledTestId(testId);
      onScheduleOpen();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load scheduled test';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    try {
      await adminApi.deleteQuiz(quizId);
      toast({
        title: 'Success',
        description: 'Quiz deleted successfully',
        status: 'success',
        duration: 3000,
      });
      await loadQuizzes();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete quiz';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleViewReport = (testId: string) => {
    setReportScheduledTestId(testId);
    onReportOpen();
  };

  const handleDeleteScheduledTest = async (testId: string) => {
    if (!confirm('Are you sure you want to delete this scheduled test?')) {
      return;
    }

    try {
      await scheduledTestsApi.deleteScheduledTest(testId);
      toast({
        title: 'Success',
        description: 'Scheduled test deleted successfully',
        status: 'success',
        duration: 3000,
      });
      await loadScheduledTests();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete scheduled test';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
      });
    }
  };

  /**
   * Parse and map question data from database format to frontend format
   */
  const parseQuestions = (questions: unknown[]): QuizQuestion[] => {
    return questions.map((q: any) => {
      // Map database field names (snake_case) to frontend field names (camelCase)
      // Handle both snake_case and camelCase, prioritize snake_case from DB
      // Check for null/undefined properly - null is a valid value that means "no value"
      const questionText = (q.question_text !== undefined && q.question_text !== null) 
        ? q.question_text 
        : ((q.questionText !== undefined && q.questionText !== null) ? q.questionText : '');
      const questionType = (q.question_type !== undefined && q.question_type !== null)
        ? q.question_type
        : ((q.questionType !== undefined && q.questionType !== null) ? q.questionType : 'multiple_choice');
      const questionImageUrl = (q.question_image_url !== undefined && q.question_image_url !== null)
        ? q.question_image_url
        : ((q.questionImageUrl !== undefined && q.questionImageUrl !== null) ? q.questionImageUrl : null);
      const orderIndex = (q.order_index !== undefined && q.order_index !== null)
        ? q.order_index
        : ((q.orderIndex !== undefined && q.orderIndex !== null) ? q.orderIndex : 0);
      
      // Parse options (can be string JSONB or object)
      let options = q.options;
      if (options) {
        if (typeof options === 'string') {
          try {
            options = JSON.parse(options);
          } catch (e) {
            console.error('Error parsing options:', e);
            options = null;
          }
        }
      }

      // Parse correctAnswer (can be string JSONB or string/array)
      let correctAnswer = q.correct_answer !== undefined ? q.correct_answer : q.correctAnswer;
      if (correctAnswer) {
        if (typeof correctAnswer === 'string') {
          try {
            // Try to parse as JSON first (for arrays or complex objects)
            correctAnswer = JSON.parse(correctAnswer);
          } catch (e) {
            // If parsing fails, keep as string (simple answer like "A" or "B")
            correctAnswer = correctAnswer;
          }
        }
      }

      return {
        id: q.id,
        quizId: q.quiz_id || q.quizId,
        questionType: questionType,
        questionText: questionText,
        questionImageUrl: questionImageUrl,
        options: options || null,
        correctAnswer: correctAnswer || null,
        explanation: q.explanation !== undefined ? q.explanation : null,
        hint: q.hint !== undefined ? q.hint : null,
        points: q.points !== undefined ? q.points : 1,
        orderIndex: orderIndex,
      };
    });
  };

  /**
   * Map quiz data from database format to frontend format
   */
  const mapQuizData = (quiz: Quiz): Quiz => {
    const quizData = quiz as unknown as Record<string, unknown>;
    return {
      ...quiz,
      ageGroup: (quizData.age_group as string | undefined) || quiz.ageGroup,
      numberOfQuestions: quizData.number_of_questions !== undefined ? (quizData.number_of_questions as number) : quiz.numberOfQuestions,
      passingPercentage: quizData.passing_percentage !== undefined ? (quizData.passing_percentage as number) : quiz.passingPercentage,
      timeLimit: quizData.time_limit !== undefined ? ((quizData.time_limit as number | null) ?? undefined) : quiz.timeLimit,
      subtopicId: (quizData.subtopic_id as string | undefined) || quiz.subtopicId,
      isActive: quizData.is_active !== undefined ? (quizData.is_active as boolean) : quiz.isActive,
    };
  };

  const handleViewQuiz = async (quiz: Quiz) => {
    try {
      setLoading(true);
      const data = await adminApi.getQuiz(quiz.id);
      
      // Parse JSONB fields from database and map snake_case to camelCase
      const parsedQuestions = parseQuestions(data.questions);
      const mappedQuiz = mapQuizData(data.quiz);

      setViewingQuiz({
        quiz: mappedQuiz,
        questions: parsedQuestions,
      });
      onViewOpen();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load quiz';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (question: QuizQuestion) => {
    setEditingQuestion({ ...question });
    onEditOpen();
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setEditQuizFormData({
      name: quiz.name,
      description: quiz.description || '',
      ageGroup: quiz.ageGroup,
      difficulty: quiz.difficulty,
      numberOfQuestions: quiz.numberOfQuestions,
      passingPercentage: quiz.passingPercentage,
      timeLimit: quiz.timeLimit?.toString() || '',
      subtopicId: quiz.subtopicId || '',
      isActive: quiz.isActive,
    });
    setEditQuizModalTab(0);
    setEditQuizJsonFormData({ jsonContent: '' });
    onEditQuizOpen();
  };

  const handleUpdateQuiz = async () => {
    if (!editingQuiz) return;

    try {
      setLoading(true);
      await adminApi.updateQuiz(editingQuiz.id, {
        name: editQuizFormData.name,
        description: editQuizFormData.description,
        ageGroup: editQuizFormData.ageGroup,
        difficulty: editQuizFormData.difficulty,
        numberOfQuestions: editQuizFormData.numberOfQuestions,
        passingPercentage: editQuizFormData.passingPercentage,
        timeLimit: editQuizFormData.timeLimit ? parseInt(editQuizFormData.timeLimit, 10) : undefined,
        isActive: editQuizFormData.isActive,
      });

      toast({
        title: 'Success',
        description: 'Quiz updated successfully',
        status: 'success',
        duration: 3000,
      });

      // Reload quizzes list
      await loadQuizzes();

      // Reload viewing quiz if it's the same one
      if (viewingQuiz && viewingQuiz.quiz.id === editingQuiz.id) {
        const data = await adminApi.getQuiz(editingQuiz.id);
        const parsedQuestions = parseQuestions(data.questions);
        const mappedQuiz = mapQuizData(data.quiz);
        setViewingQuiz({
          quiz: mappedQuiz,
          questions: parsedQuestions,
        });
      }

      onEditQuizClose();
      setEditingQuiz(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update quiz';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuizFromJSON = async () => {
    if (!editingQuiz || !editQuizJsonFormData.jsonContent.trim()) {
      toast({
        title: 'Error',
        description: 'Please paste JSON content',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      let quizData: {
        name?: string;
        description?: string;
        ageGroup?: string;
        difficulty?: string;
        passingPercentage?: number;
        timeLimit?: number;
        questions?: Array<{
          question?: string;
          questionText?: string;
          questionType?: string;
          options?: Record<string, string>;
          correctAnswer: string | string[];
          explanation?: string;
          hint?: string;
          points?: number;
        }>;
      };

      try {
        quizData = JSON.parse(editQuizJsonFormData.jsonContent);
      } catch (parseError) {
        toast({
          title: 'Error',
          description: 'Invalid JSON format. Please check your JSON syntax.',
          status: 'error',
          duration: 3000,
        });
        return;
      }

      // Update quiz basic info if provided
      const updateData: Partial<Quiz> = {};
      if (quizData.name) updateData.name = quizData.name;
      if (quizData.description !== undefined) updateData.description = quizData.description;
      if (quizData.ageGroup) updateData.ageGroup = quizData.ageGroup;
      if (quizData.difficulty) updateData.difficulty = quizData.difficulty;
      if (quizData.passingPercentage !== undefined) updateData.passingPercentage = quizData.passingPercentage;
      if (quizData.timeLimit !== undefined) updateData.timeLimit = quizData.timeLimit;

      if (Object.keys(updateData).length > 0) {
        await adminApi.updateQuiz(editingQuiz.id, updateData);
      }

      // Update questions if provided
      if (quizData.questions && Array.isArray(quizData.questions)) {
        // Get current questions
        const currentQuiz = await adminApi.getQuiz(editingQuiz.id);
        const currentQuestions = currentQuiz.questions;

        // Delete all existing questions
        for (const question of currentQuestions) {
          await adminApi.deleteQuestion(question.id);
        }

        // Add new questions
        for (let i = 0; i < quizData.questions.length; i++) {
          const q = quizData.questions[i];
          const questionText = q.question || q.questionText || '';
          
          await adminApi.addQuestion(editingQuiz.id, {
            questionType: q.questionType || 'multiple_choice',
            questionText: questionText,
            questionImageUrl: undefined,
            options: q.options || null,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || undefined,
            hint: q.hint || undefined,
            points: q.points || 1,
            orderIndex: i,
          });
        }

        // Update number of questions
        await adminApi.updateQuiz(editingQuiz.id, {
          numberOfQuestions: quizData.questions.length,
        });
      }

      toast({
        title: 'Success',
        description: 'Quiz updated successfully from JSON',
        status: 'success',
        duration: 3000,
      });

      // Reload quizzes list
      await loadQuizzes();

      // Reload viewing quiz if it's the same one
      if (viewingQuiz && viewingQuiz.quiz.id === editingQuiz.id) {
        const data = await adminApi.getQuiz(editingQuiz.id);
        const parsedQuestions = parseQuestions(data.questions);
        const mappedQuiz = mapQuizData(data.quiz);
        setViewingQuiz({
          quiz: mappedQuiz,
          questions: parsedQuestions,
        });
      }

      onEditQuizClose();
      setEditingQuiz(null);
      setEditQuizJsonFormData({ jsonContent: '' });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update quiz from JSON';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion) return;

    try {
      setLoading(true);
      await adminApi.updateQuestion(editingQuestion.id, {
        questionText: editingQuestion.questionText,
        options: editingQuestion.options,
        correctAnswer: editingQuestion.correctAnswer,
        explanation: editingQuestion.explanation,
        hint: editingQuestion.hint,
        points: editingQuestion.points,
      });

      toast({
        title: 'Success',
        description: 'Question updated successfully',
        status: 'success',
        duration: 3000,
      });

      // Reload quiz data with proper parsing
      if (viewingQuiz) {
        const data = await adminApi.getQuiz(viewingQuiz.quiz.id);
        const parsedQuestions = parseQuestions(data.questions);
        const mappedQuiz = mapQuizData(data.quiz);
        setViewingQuiz({
          quiz: mappedQuiz,
          questions: parsedQuestions,
        });
      }

      onEditClose();
      setEditingQuestion(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update question';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const openScheduleModal = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    const now = new Date();
    const defaultVisibleFrom = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
    const defaultVisibleUntil = new Date(defaultVisibleFrom.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days later

    setScheduleFormData({
      quizId: quiz.id,
      scheduledFor: '',
      visibleFrom: defaultVisibleFrom.toISOString().slice(0, 16),
      visibleUntil: defaultVisibleUntil.toISOString().slice(0, 16),
      durationMinutes: quiz.timeLimit ? quiz.timeLimit.toString() : '60',
      planIds: [],
      userIds: [],
      instructions: '',
    });
    onScheduleOpen();
  };

  if (loading && quizzes.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box p={{ base: 4, md: 6 }}>
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading size={{ base: 'md', md: 'lg' }} color="gray.700">
            Quiz Management
          </Heading>
          <HStack spacing={3}>
            <Button colorScheme="green" variant="outline" onClick={() => {
              setScheduleFormData({
                quizId: '',
                scheduledFor: '',
                visibleFrom: '',
                visibleUntil: '',
                durationMinutes: '60',
                planIds: [],
                userIds: [],
                instructions: '',
              });
              onScheduleOpen();
            }}>
              Schedule Quiz
            </Button>
            <Button colorScheme="blue" onClick={onOpen}>
              Create Quiz
            </Button>
          </HStack>
        </HStack>

        <Tabs index={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab>Quizzes</Tab>
            <Tab>Scheduled Tests</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Card>
                <CardBody>
                  {quizzes.length === 0 ? (
                    <Text textAlign="center" py={8} color="gray.500">
                      No quizzes found. Create your first quiz!
                    </Text>
                  ) : (
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Name</Th>
                          <Th>Description</Th>
                          <Th>Age Group</Th>
                          <Th>Difficulty</Th>
                          <Th>Questions</Th>
                          <Th>Passing %</Th>
                          <Th>Time Limit</Th>
                          <Th>Status</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {quizzes.map((quiz) => (
                          <Tr key={quiz.id}>
                            <Td fontWeight="medium">{quiz.name}</Td>
                            <Td>
                              <Text fontSize="sm" noOfLines={2} maxW="200px">
                                {quiz.description || 'No description'}
                              </Text>
                            </Td>
                            <Td>
                              <Badge colorScheme="purple">{quiz.ageGroup}</Badge>
                            </Td>
                            <Td>
                              <Badge colorScheme="blue">{quiz.difficulty}</Badge>
                            </Td>
                            <Td>{quiz.numberOfQuestions}</Td>
                            <Td>{quiz.passingPercentage}%</Td>
                            <Td>{quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}</Td>
                            <Td>
                              <Badge colorScheme={quiz.isActive ? 'green' : 'gray'}>
                                {quiz.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </Td>
                            <Td>
                              <HStack spacing={1}>
                                <Button
                                  size="xs"
                                  colorScheme="green"
                                  variant="outline"
                                  onClick={() => handleViewQuiz(quiz)}
                                >
                                  View
                                </Button>
                                <Button
                                  size="xs"
                                  colorScheme="orange"
                                  variant="outline"
                                  onClick={() => handleEditQuiz(quiz)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="xs"
                                  colorScheme="blue"
                                  variant="outline"
                                  onClick={() => openScheduleModal(quiz)}
                                >
                                  Schedule
                                </Button>
                                <IconButton
                                  aria-label="Delete quiz"
                                  icon={<Text>🗑️</Text>}
                                  size="xs"
                                  colorScheme="red"
                                  variant="ghost"
                                  onClick={() => handleDeleteQuiz(quiz.id)}
                                />
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  )}
                </CardBody>
              </Card>
            </TabPanel>

            <TabPanel>
              <Card>
                <CardBody>
                  {scheduledTests.length === 0 ? (
                    <Text textAlign="center" py={8} color="gray.500">
                      No scheduled tests found.
                    </Text>
                  ) : (
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Quiz</Th>
                          <Th>Scheduled For</Th>
                          <Th>Visible From</Th>
                          <Th>Visible Until</Th>
                          <Th>Duration</Th>
                          <Th>Plans/Users</Th>
                          <Th>Status</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {scheduledTests.map((test) => (
                          <Tr key={test.id}>
                            <Td fontWeight="medium">{test.quizName || 'N/A'}</Td>
                            <Td>{new Date(test.scheduledFor).toLocaleString()}</Td>
                            <Td>{new Date(test.visibleFrom).toLocaleString()}</Td>
                            <Td>{test.visibleUntil ? new Date(test.visibleUntil).toLocaleString() : 'N/A'}</Td>
                            <Td>{test.durationMinutes ? `${test.durationMinutes} min` : 'N/A'}</Td>
                            <Td>
                              <VStack align="start" spacing={1}>
                                {test.planIds && test.planIds.length > 0 && (
                                  <Badge colorScheme="purple">
                                    {test.planIds.length} Plan{test.planIds.length > 1 ? 's' : ''}
                                  </Badge>
                                )}
                                {test.userIds && test.userIds.length > 0 && (
                                  <Badge colorScheme="blue">
                                    {test.userIds.length} User{test.userIds.length > 1 ? 's' : ''}
                                  </Badge>
                                )}
                              </VStack>
                            </Td>
                            <Td>
                              <Badge
                                colorScheme={
                                  test.status === 'scheduled'
                                    ? 'blue'
                                    : test.status === 'active'
                                    ? 'green'
                                    : test.status === 'completed'
                                    ? 'gray'
                                    : 'red'
                                }
                              >
                                {test.status}
                              </Badge>
                            </Td>
                            <Td>
                              <HStack spacing={2}>
                                <Button
                                  size="xs"
                                  colorScheme="blue"
                                  variant="outline"
                                  onClick={() => handleViewScheduledTest(test.id)}
                                >
                                  View
                                </Button>
                                <Button
                                  size="xs"
                                  colorScheme="orange"
                                  variant="outline"
                                  onClick={() => handleEditScheduledTest(test.id)}
                                >
                                  Edit
                                </Button>
                                {(test.status === 'completed' || test.status === 'active') && (
                                  <Button
                                    size="xs"
                                    colorScheme="green"
                                    variant="outline"
                                    onClick={() => handleViewReport(test.id)}
                                  >
                                    Report
                                  </Button>
                                )}
                                <IconButton
                                  aria-label="Delete scheduled test"
                                  icon={<Text>🗑️</Text>}
                                  size="xs"
                                  colorScheme="red"
                                  variant="ghost"
                                  onClick={() => handleDeleteScheduledTest(test.id)}
                                />
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  )}
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Create Quiz Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent maxW="90vw" maxH="90vh">
            <ModalHeader>Create Quiz</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Tabs index={createModalTab} onChange={setCreateModalTab}>
                <TabList>
                  <Tab>AI Generation</Tab>
                  <Tab>JSON Upload</Tab>
                </TabList>
                <TabPanels>
                  {/* AI Generation Tab */}
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <FormControl isRequired>
                        <FormLabel>Topic</FormLabel>
                        <Select
                          value={selectedTopic}
                          onChange={(e) => setSelectedTopic(e.target.value)}
                          placeholder="Select topic"
                        >
                          {topics.map((topic) => (
                            <option key={topic.id} value={topic.id}>
                              {topic.title}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                       <FormControl>
                         <FormLabel>Subtopic (Optional)</FormLabel>
                         <Select
                           value={selectedSubtopic}
                           onChange={(e) => setSelectedSubtopic(e.target.value)}
                           placeholder="Select subtopic (optional)"
                           disabled={!selectedTopic}
                         >
                           <option value="">None</option>
                           {subtopics.map((subtopic) => (
                             <option key={subtopic.id} value={subtopic.id}>
                               {subtopic.title}
                             </option>
                           ))}
                         </Select>
                       </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Quiz Name</FormLabel>
                        <Input
                          value={aiFormData.name}
                          onChange={(e) => setAiFormData({ ...aiFormData, name: e.target.value })}
                          placeholder="Enter quiz name"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                          value={aiFormData.description}
                          onChange={(e) => setAiFormData({ ...aiFormData, description: e.target.value })}
                          placeholder="Enter quiz description"
                        />
                      </FormControl>

                      <HStack>
                        <FormControl isRequired>
                          <FormLabel>Age Group</FormLabel>
                          <Select
                            value={aiFormData.ageGroup}
                            onChange={(e) => setAiFormData({ ...aiFormData, ageGroup: e.target.value })}
                            placeholder="Select age group"
                          >
                            <option value="6-8">6-8 years</option>
                            <option value="9-11">9-11 years</option>
                            <option value="12-14">12-14 years</option>
                          </Select>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Difficulty</FormLabel>
                          <Select
                            value={aiFormData.difficulty}
                            onChange={(e) => setAiFormData({ ...aiFormData, difficulty: e.target.value })}
                            placeholder="Select difficulty"
                          >
                            <option value="Basic">Basic</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                            <option value="Mix">Mix</option>
                          </Select>
                        </FormControl>
                      </HStack>

                      <HStack>
                        <FormControl isRequired>
                          <FormLabel>Number of Questions</FormLabel>
                          <NumberInput
                            value={aiFormData.numberOfQuestions}
                            onChange={(_, value) =>
                              setAiFormData({ ...aiFormData, numberOfQuestions: value || 15 })
                            }
                            min={1}
                            max={50}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Passing Percentage</FormLabel>
                          <NumberInput
                            value={aiFormData.passingPercentage}
                            onChange={(_, value) =>
                              setAiFormData({ ...aiFormData, passingPercentage: value || 60 })
                            }
                            min={0}
                            max={100}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>
                      </HStack>

                      <HStack>
                        <FormControl>
                          <FormLabel>Time Limit (minutes)</FormLabel>
                          <Input
                            type="number"
                            value={aiFormData.timeLimit}
                            onChange={(e) => setAiFormData({ ...aiFormData, timeLimit: e.target.value })}
                            placeholder="Optional"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Language</FormLabel>
                          <Select
                            value={aiFormData.language}
                            onChange={(e) => setAiFormData({ ...aiFormData, language: e.target.value })}
                          >
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Hinglish">Hinglish</option>
                          </Select>
                        </FormControl>
                      </HStack>
                    </VStack>
                  </TabPanel>

                  {/* JSON Upload Tab */}
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <FormControl isRequired>
                        <FormLabel>Topic</FormLabel>
                        <Select
                          value={selectedTopic}
                          onChange={(e) => setSelectedTopic(e.target.value)}
                          placeholder="Select topic"
                        >
                          {topics.map((topic) => (
                            <option key={topic.id} value={topic.id}>
                              {topic.title}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                       <FormControl>
                         <FormLabel>Subtopic (Optional)</FormLabel>
                         <Select
                           value={selectedSubtopic}
                           onChange={(e) => setSelectedSubtopic(e.target.value)}
                           placeholder="Select subtopic (optional)"
                           disabled={!selectedTopic}
                         >
                           <option value="">None</option>
                           {subtopics.map((subtopic) => (
                             <option key={subtopic.id} value={subtopic.id}>
                               {subtopic.title}
                             </option>
                           ))}
                         </Select>
                       </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Quiz Name</FormLabel>
                        <Input
                          value={jsonFormData.name}
                          onChange={(e) => setJsonFormData({ ...jsonFormData, name: e.target.value })}
                          placeholder="Enter quiz name"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                          value={jsonFormData.description}
                          onChange={(e) => setJsonFormData({ ...jsonFormData, description: e.target.value })}
                          placeholder="Enter quiz description"
                        />
                      </FormControl>

                      <HStack>
                        <FormControl isRequired>
                          <FormLabel>Age Group</FormLabel>
                          <Select
                            value={jsonFormData.ageGroup}
                            onChange={(e) => setJsonFormData({ ...jsonFormData, ageGroup: e.target.value })}
                            placeholder="Select age group"
                          >
                            <option value="6-8">6-8 years</option>
                            <option value="9-11">9-11 years</option>
                            <option value="12-14">12-14 years</option>
                          </Select>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Difficulty</FormLabel>
                          <Select
                            value={jsonFormData.difficulty}
                            onChange={(e) => setJsonFormData({ ...jsonFormData, difficulty: e.target.value })}
                            placeholder="Select difficulty"
                          >
                            <option value="Basic">Basic</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                            <option value="Mix">Mix</option>
                          </Select>
                        </FormControl>
                      </HStack>

                      <FormControl isRequired>
                        <HStack justify="space-between" mb={2}>
                          <FormLabel mb={0}>JSON Questions</FormLabel>
                          <Button
                            size="sm"
                            variant="outline"
                            colorScheme="blue"
                            onClick={handleDownloadJSONTemplate}
                          >
                            📥 Download Template
                          </Button>
                        </HStack>
                        <Textarea
                          value={jsonFormData.jsonContent}
                          onChange={(e) => setJsonFormData({ ...jsonFormData, jsonContent: e.target.value })}
                          placeholder={`[\n  {\n    "question": "Question text",\n    "options": {"A": "...", "B": "...", "C": "...", "D": "..."},\n    "correctAnswer": "A",\n    "explanation": "Explanation text"\n  }\n]`}
                          height="200px"
                          fontFamily="mono"
                        />
                        <Text fontSize="sm" color="gray.500" mt={1}>
                          Format: Array of question objects with question, options, correctAnswer, and explanation/justification
                        </Text>
                      </FormControl>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={createModalTab === 0 ? handleAIGenerate : handleJSONUpload}
                isLoading={loading}
              >
                {createModalTab === 0 ? 'Generate with AI' : 'Upload Quiz'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Schedule Test Modal */}
        <Modal
          isOpen={isScheduleOpen}
          onClose={() => {
            onScheduleClose();
            setEditingScheduledTestId(null);
            setScheduleFormData({
              quizId: '',
              scheduledFor: '',
              visibleFrom: '',
              visibleUntil: '',
              durationMinutes: '',
              planIds: [],
              userIds: [],
              instructions: '',
            });
          }}
          size="lg"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{editingScheduledTestId ? 'Edit Scheduled Test' : 'Schedule Test'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired isDisabled={!!editingScheduledTestId}>
                  <FormLabel>Quiz</FormLabel>
                  <Select
                    value={scheduleFormData.quizId}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, quizId: e.target.value })}
                    placeholder="Select quiz"
                    isDisabled={!!editingScheduledTestId}
                  >
                    {quizzes
                      .filter((q) => q.isActive)
                      .map((quiz) => (
                        <option key={quiz.id} value={quiz.id}>
                          {quiz.name}
                        </option>
                      ))}
                  </Select>
                  {editingScheduledTestId && (
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Quiz cannot be changed when editing
                    </Text>
                  )}
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Scheduled For</FormLabel>
                  <Input
                    type="datetime-local"
                    value={scheduleFormData.scheduledFor}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, scheduledFor: e.target.value })}
                  />
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    When the test should be scheduled
                  </Text>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Visible From</FormLabel>
                  <Input
                    type="datetime-local"
                    value={scheduleFormData.visibleFrom}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, visibleFrom: e.target.value })}
                  />
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    When the exam will become visible to students
                  </Text>
                </FormControl>

                <HStack>
                  <FormControl>
                    <FormLabel>Visible Until</FormLabel>
                    <Input
                      type="datetime-local"
                      value={scheduleFormData.visibleUntil}
                      onChange={(e) => setScheduleFormData({ ...scheduleFormData, visibleUntil: e.target.value })}
                    />
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      When the exam will no longer be visible (optional)
                    </Text>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <Input
                      type="number"
                      value={scheduleFormData.durationMinutes}
                      onChange={(e) => setScheduleFormData({ ...scheduleFormData, durationMinutes: e.target.value })}
                      placeholder="60"
                    />
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      How long the exam will be visible (optional)
                    </Text>
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Select Plans</FormLabel>
                  <CheckboxGroup
                    value={scheduleFormData.planIds}
                    onChange={(values) =>
                      setScheduleFormData({ ...scheduleFormData, planIds: values as string[] })
                    }
                  >
                    <VStack align="start" spacing={2}>
                      {plans.map((plan) => (
                        <Checkbox key={plan.id} value={plan.id}>
                          {plan.name}
                        </Checkbox>
                      ))}
                    </VStack>
                  </CheckboxGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Instructions</FormLabel>
                  <Textarea
                    value={scheduleFormData.instructions}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, instructions: e.target.value })}
                    placeholder="Optional instructions for students"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="ghost"
                mr={3}
                onClick={() => {
                  onScheduleClose();
                  setEditingScheduledTestId(null);
                  setScheduleFormData({
                    quizId: '',
                    scheduledFor: '',
                    visibleFrom: '',
                    visibleUntil: '',
                    durationMinutes: '',
                    planIds: [],
                    userIds: [],
                    instructions: '',
                  });
                }}
              >
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleScheduleTest} isLoading={loading}>
                {editingScheduledTestId ? 'Update Test' : 'Schedule Test'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* View Scheduled Test Modal */}
        <Modal isOpen={isViewScheduledTestOpen} onClose={onViewScheduledTestClose} size="2xl" scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent maxH="90vh" maxW="90vw">
            <ModalHeader>
              <VStack align="start" spacing={1}>
                <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold">
                  {viewingScheduledTest?.quizName || 'Scheduled Test Details'}
                </Text>
                <Badge
                  colorScheme={
                    viewingScheduledTest?.status === 'scheduled'
                      ? 'blue'
                      : viewingScheduledTest?.status === 'active'
                      ? 'green'
                      : viewingScheduledTest?.status === 'completed'
                      ? 'gray'
                      : 'red'
                  }
                >
                  {viewingScheduledTest?.status || 'N/A'}
                </Badge>
              </VStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {viewingScheduledTest ? (
                <VStack spacing={4} align="stretch">
                  <Card>
                    <CardBody>
                      <VStack spacing={3} align="stretch">
                        <Box>
                          <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={1}>
                            Quiz Information
                          </Text>
                          <Text>
                            <Text as="span" fontWeight="medium">Name:</Text> {viewingScheduledTest.quizName || 'N/A'}
                          </Text>
                          {viewingScheduledTest.quizDescription && (
                            <Text mt={1}>
                              <Text as="span" fontWeight="medium">Description:</Text>{' '}
                              {viewingScheduledTest.quizDescription}
                            </Text>
                          )}
                        </Box>

                        <Box>
                          <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={1}>
                            Schedule Details
                          </Text>
                          <Text>
                            <Text as="span" fontWeight="medium">Scheduled For:</Text>{' '}
                            {new Date(viewingScheduledTest.scheduledFor).toLocaleString()}
                          </Text>
                          <Text mt={1}>
                            <Text as="span" fontWeight="medium">Visible From:</Text>{' '}
                            {new Date(viewingScheduledTest.visibleFrom).toLocaleString()}
                          </Text>
                          {viewingScheduledTest.visibleUntil && (
                            <Text mt={1}>
                              <Text as="span" fontWeight="medium">Visible Until:</Text>{' '}
                              {new Date(viewingScheduledTest.visibleUntil).toLocaleString()}
                            </Text>
                          )}
                          {viewingScheduledTest.durationMinutes && (
                            <Text mt={1}>
                              <Text as="span" fontWeight="medium">Duration:</Text>{' '}
                              {viewingScheduledTest.durationMinutes} minutes
                            </Text>
                          )}
                        </Box>

                        {((viewingScheduledTest.plans && viewingScheduledTest.plans.length > 0) ||
                          (viewingScheduledTest.users && viewingScheduledTest.users.length > 0) ||
                          (viewingScheduledTest.planIds && viewingScheduledTest.planIds.length > 0) ||
                          (viewingScheduledTest.userIds && viewingScheduledTest.userIds.length > 0)) && (
                          <Box>
                            <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={2}>
                              Assigned To
                            </Text>
                            {viewingScheduledTest.plans && viewingScheduledTest.plans.length > 0 && (
                              <VStack align="start" spacing={2} mb={3}>
                                <Text fontWeight="medium">Plans ({viewingScheduledTest.plans.length}):</Text>
                                {viewingScheduledTest.plans.map((plan) => (
                                  <Badge key={plan.id} colorScheme="purple" p={2}>
                                    {plan.name}
                                    {plan.description && (
                                      <Text fontSize="xs" mt={1} color="gray.600">
                                        {plan.description}
                                      </Text>
                                    )}
                                  </Badge>
                                ))}
                              </VStack>
                            )}
                            {viewingScheduledTest.users && viewingScheduledTest.users.length > 0 && (
                              <VStack align="start" spacing={2}>
                                <Text fontWeight="medium">Users ({viewingScheduledTest.users.length}):</Text>
                                {viewingScheduledTest.users.map((user) => (
                                  <Badge key={user.id} colorScheme="blue" p={2}>
                                    {user.name} ({user.email})
                                  </Badge>
                                ))}
                              </VStack>
                            )}
                          </Box>
                        )}

                        {viewingScheduledTest.instructions && (
                          <Box>
                            <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={1}>
                              Instructions
                            </Text>
                            <Text>{viewingScheduledTest.instructions}</Text>
                          </Box>
                        )}

                        <Box>
                          <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={1}>
                            Metadata
                          </Text>
                          <Text fontSize="sm">
                            <Text as="span" fontWeight="medium">Scheduled By:</Text>{' '}
                            {viewingScheduledTest.scheduledByName || 'N/A'}
                          </Text>
                          <Text fontSize="sm" mt={1}>
                            <Text as="span" fontWeight="medium">Created:</Text>{' '}
                            {new Date(viewingScheduledTest.createdAt).toLocaleString()}
                          </Text>
                          <Text fontSize="sm" mt={1}>
                            <Text as="span" fontWeight="medium">Last Updated:</Text>{' '}
                            {new Date(viewingScheduledTest.updatedAt).toLocaleString()}
                          </Text>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>
                </VStack>
              ) : (
                <Text>Loading...</Text>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onViewClose}>
                Close
              </Button>
              {viewingScheduledTest && (
                <Button
                  colorScheme="orange"
                  onClick={() => {
                    onViewScheduledTestClose();
                    handleEditScheduledTest(viewingScheduledTest.id);
                  }}
                >
                  Edit
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* View Quiz Modal */}
        <Modal isOpen={isViewOpen} onClose={onViewClose} size="3xl" scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent maxH="90vh" maxW="90vw">
            <ModalHeader>
              <VStack align="start" spacing={1}>
                <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold">
                  {viewingQuiz?.quiz.name}
                </Text>
                <HStack spacing={4} flexWrap="wrap">
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    <Text as="span" fontWeight="bold">Age Group:</Text> {viewingQuiz?.quiz.ageGroup || 'N/A'}
                  </Text>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    <Text as="span" fontWeight="bold">Questions:</Text> {viewingQuiz?.quiz.numberOfQuestions || 0}
                  </Text>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    <Text as="span" fontWeight="bold">Status:</Text>{' '}
                    <Badge colorScheme={viewingQuiz?.quiz.isActive ? 'green' : 'red'} size="sm">
                      {viewingQuiz?.quiz.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Text>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    <Text as="span" fontWeight="bold">Time Limit:</Text>{' '}
                    {viewingQuiz?.quiz.timeLimit ? `${viewingQuiz.quiz.timeLimit} min` : 'No limit'}
                  </Text>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    <Text as="span" fontWeight="bold">Difficulty:</Text> {viewingQuiz?.quiz.difficulty || 'N/A'}
                  </Text>
                </HStack>
              </VStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {viewingQuiz && (
                <VStack spacing={4} align="stretch">
                  {viewingQuiz.quiz.description && (
                    <Box>
                      <Text fontWeight="bold" mb={2}>Description:</Text>
                      <Text>{viewingQuiz.quiz.description}</Text>
                    </Box>
                  )}

                  <Box>
                    <HStack justify="space-between" mb={3}>
                      <Heading size="sm">Questions ({viewingQuiz.questions.length})</Heading>
                      <Text fontSize="sm" color="gray.500">
                        Passing: {viewingQuiz.quiz.passingPercentage}% | Time Limit: {viewingQuiz.quiz.timeLimit ? `${viewingQuiz.quiz.timeLimit} min` : 'No limit'}
                      </Text>
                    </HStack>

                    <VStack spacing={4} align="stretch">
                      {viewingQuiz.questions.map((question, index) => {
                        // Options and correctAnswer are already parsed in handleViewQuiz
                        const options = question.options as Record<string, string> | undefined;
                        const correctAnswer = question.correctAnswer as string | string[] | undefined;

                        return (
                          <Card key={question.id} variant="outline" borderWidth="2px">
                            <CardBody>
                              <HStack justify="space-between" mb={3}>
                                <Text fontWeight="bold" color="blue.600" fontSize={{ base: 'md', md: 'lg' }}>
                                  Question {index + 1} of {viewingQuiz.questions.length}
                                </Text>
                                <HStack spacing={2}>
                                  <Badge colorScheme="purple">{question.questionType}</Badge>
                                  <Badge colorScheme="green">{question.points} pts</Badge>
                                  <Button
                                    size="xs"
                                    colorScheme="blue"
                                    variant="outline"
                                    onClick={() => handleEditQuestion(question)}
                                  >
                                    Edit
                                  </Button>
                                </HStack>
                              </HStack>

                              <Text mb={4} fontSize="md" fontWeight="medium" color="gray.700">
                                {question.questionText && question.questionText.trim() !== '' 
                                  ? question.questionText 
                                  : 'No question text provided'}
                              </Text>

                              {question.questionImageUrl && (
                                <Box mb={3}>
                                  <img
                                    src={question.questionImageUrl}
                                    alt="Question illustration"
                                    style={{ maxWidth: '100%', borderRadius: '8px' }}
                                  />
                                </Box>
                              )}

                              {options && Object.keys(options).length > 0 ? (
                                <Box mb={3}>
                                  <Text fontWeight="bold" mb={2} fontSize="sm" color="gray.600">
                                    Answer Options:
                                  </Text>
                                  <VStack align="stretch" spacing={2}>
                                    {Object.entries(options).map(([key, value]) => {
                                      const isCorrect = Array.isArray(correctAnswer)
                                        ? correctAnswer.includes(key)
                                        : String(correctAnswer).toUpperCase() === String(key).toUpperCase();
                                      return (
                                        <HStack
                                          key={key}
                                          p={3}
                                          bg={isCorrect ? 'green.50' : 'gray.50'}
                                          borderRadius="md"
                                          border={isCorrect ? '2px solid' : '1px solid'}
                                          borderColor={isCorrect ? 'green.400' : 'gray.300'}
                                          _hover={{ bg: isCorrect ? 'green.100' : 'gray.100' }}
                                        >
                                          <Badge
                                            colorScheme={isCorrect ? 'green' : 'gray'}
                                            minW="40px"
                                            fontSize="sm"
                                            p={1}
                                          >
                                            {key}
                                          </Badge>
                                          <Text flex={1} fontSize="sm">
                                            {value}
                                          </Text>
                                          {isCorrect && (
                                            <Badge colorScheme="green" fontSize="xs">
                                              ✓ Correct Answer
                                            </Badge>
                                          )}
                                        </HStack>
                                      );
                                    })}
                                  </VStack>
                                  {/* Always show correct answer summary */}
                                  {correctAnswer && (
                                    <Box mt={3} p={2} bg="green.50" borderRadius="md" border="1px solid" borderColor="green.300">
                                      <Text fontSize="sm" fontWeight="bold" color="green.700" mb={1}>
                                        Correct Answer:
                                      </Text>
                                      <Text fontSize="sm" fontWeight="medium" color="green.800">
                                        {Array.isArray(correctAnswer)
                                          ? correctAnswer.map((ans) => {
                                              const ansStr = String(ans).toUpperCase();
                                              const optionText = options[ansStr] || options[ans] || options[String(ans)] || ans;
                                              return `${ansStr}: ${optionText}`;
                                            }).join(' | ')
                                          : (() => {
                                              const ansStr = String(correctAnswer).toUpperCase();
                                              const optionText = options[ansStr] || options[correctAnswer as string] || String(correctAnswer);
                                              return `${ansStr}: ${optionText}`;
                                            })()}
                                      </Text>
                                    </Box>
                                  )}
                                </Box>
                              ) : (
                                correctAnswer && (
                                  <Box mb={3} p={3} bg="green.50" borderRadius="md" border="2px solid" borderColor="green.400">
                                    <Text fontWeight="bold" mb={2} fontSize="sm" color="green.700">
                                      Correct Answer:
                                    </Text>
                                    <Text fontSize="md" fontWeight="bold" color="green.800">
                                      {Array.isArray(correctAnswer)
                                        ? correctAnswer.join(', ')
                                        : String(correctAnswer)}
                                    </Text>
                                  </Box>
                                )
                              )}

                              {question.explanation && (
                                <Box mt={3} p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
                                  <Text fontSize="sm" fontWeight="bold" mb={2} color="blue.700">
                                    Explanation:
                                  </Text>
                                  <Text fontSize="sm" color="blue.800">
                                    {question.explanation}
                                  </Text>
                                </Box>
                              )}

                              {question.hint && (
                                <Box mt={2} p={2} bg="yellow.50" borderRadius="md" border="1px solid" borderColor="yellow.200">
                                  <Text fontSize="sm" fontWeight="bold" mb={1} color="yellow.700">
                                    Hint:
                                  </Text>
                                  <Text fontSize="sm" color="yellow.800">
                                    {question.hint}
                                  </Text>
                                </Box>
                              )}
                            </CardBody>
                          </Card>
                        );
                      })}
                    </VStack>
                  </Box>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={onViewClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Edit Question Modal */}
        <Modal isOpen={isEditOpen} onClose={onEditClose} size="2xl" scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent maxW="90vw" maxH="90vh">
            <ModalHeader>Edit Question</ModalHeader>
            <ModalCloseButton />
            <ModalBody overflowY="auto" maxH="calc(90vh - 140px)">
              {editingQuestion && (
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel>Question Text</FormLabel>
                    <Textarea
                      value={editingQuestion.questionText || ''}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, questionText: e.target.value })
                      }
                      rows={3}
                      placeholder="Enter the question text here..."
                    />
                  </FormControl>

                  {editingQuestion.options &&
                    typeof editingQuestion.options === 'object' &&
                    !Array.isArray(editingQuestion.options) &&
                    editingQuestion.options !== null ? (
                      <FormControl>
                        <FormLabel>Options</FormLabel>
                        <VStack spacing={2}>
                          {Object.entries(editingQuestion.options as Record<string, unknown>).map(
                            ([key, value]) => (
                              <HStack key={key} w="100%">
                                <Badge minW="40px" textAlign="center">
                                  {String(key)}
                                </Badge>
                                <Input
                                  value={typeof value === 'string' ? value : String(value || '')}
                                  onChange={(e) => {
                                    const newOptions = {
                                      ...(editingQuestion.options as Record<string, unknown>),
                                      [key]: e.target.value,
                                    };
                                    setEditingQuestion({ ...editingQuestion, options: newOptions });
                                  }}
                                />
                              </HStack>
                            )
                          )}
                        </VStack>
                      </FormControl>
                    ) : null}

                  <FormControl>
                    <FormLabel>Correct Answer</FormLabel>
                    <Input
                      value={
                        Array.isArray(editingQuestion.correctAnswer)
                          ? editingQuestion.correctAnswer.join(', ')
                          : String(editingQuestion.correctAnswer)
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        // Handle multiple answers (comma-separated) or single answer
                        const answer = value.includes(',')
                          ? value.split(',').map((v) => v.trim())
                          : value.trim();
                        setEditingQuestion({ ...editingQuestion, correctAnswer: answer });
                      }}
                      placeholder="A or A, B for multiple"
                    />
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Enter option letter(s). Use comma for multiple correct answers.
                    </Text>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Explanation</FormLabel>
                    <Textarea
                      value={editingQuestion.explanation || ''}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, explanation: e.target.value })
                      }
                      rows={3}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Hint (Optional)</FormLabel>
                    <Input
                      value={editingQuestion.hint || ''}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, hint: e.target.value })
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Points</FormLabel>
                    <NumberInput
                      value={editingQuestion.points}
                      onChange={(_, value) =>
                        setEditingQuestion({ ...editingQuestion, points: value || 1 })
                      }
                      min={1}
                      max={10}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onEditClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleUpdateQuestion} isLoading={loading}>
                Update Question
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Edit Quiz Modal */}
        <Modal isOpen={isEditQuizOpen} onClose={onEditQuizClose} size="3xl" scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent maxW="90vw" maxH="90vh">
            <ModalHeader>Edit Quiz</ModalHeader>
            <ModalCloseButton />
            <ModalBody overflowY="auto" maxH="calc(90vh - 140px)">
              <Tabs index={editQuizModalTab} onChange={setEditQuizModalTab}>
                <TabList>
                  <Tab>Manual Edit</Tab>
                  <Tab>JSON Upload</Tab>
                </TabList>
                <TabPanels>
                  {/* Manual Edit Tab */}
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <FormControl isRequired>
                        <FormLabel>Quiz Name</FormLabel>
                        <Input
                          value={editQuizFormData.name}
                          onChange={(e) => setEditQuizFormData({ ...editQuizFormData, name: e.target.value })}
                          placeholder="Enter quiz name"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                          value={editQuizFormData.description}
                          onChange={(e) => setEditQuizFormData({ ...editQuizFormData, description: e.target.value })}
                          placeholder="Enter quiz description"
                          rows={3}
                        />
                      </FormControl>

                      <HStack>
                        <FormControl isRequired>
                          <FormLabel>Age Group</FormLabel>
                          <Select
                            value={editQuizFormData.ageGroup}
                            onChange={(e) => setEditQuizFormData({ ...editQuizFormData, ageGroup: e.target.value })}
                            placeholder="Select age group"
                          >
                            <option value="6-8">6-8 years</option>
                            <option value="9-11">9-11 years</option>
                            <option value="12-14">12-14 years</option>
                          </Select>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Difficulty</FormLabel>
                          <Select
                            value={editQuizFormData.difficulty}
                            onChange={(e) => setEditQuizFormData({ ...editQuizFormData, difficulty: e.target.value })}
                            placeholder="Select difficulty"
                          >
                            <option value="Basic">Basic</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                            <option value="Mix">Mix</option>
                          </Select>
                        </FormControl>
                      </HStack>

                      <HStack>
                        <FormControl>
                          <FormLabel>Number of Questions</FormLabel>
                          <NumberInput
                            value={editQuizFormData.numberOfQuestions}
                            onChange={(_, value) =>
                              setEditQuizFormData({ ...editQuizFormData, numberOfQuestions: value || 15 })
                            }
                            min={1}
                            max={50}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Passing Percentage</FormLabel>
                          <NumberInput
                            value={editQuizFormData.passingPercentage}
                            onChange={(_, value) =>
                              setEditQuizFormData({ ...editQuizFormData, passingPercentage: value || 60 })
                            }
                            min={0}
                            max={100}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>
                      </HStack>

                      <HStack>
                        <FormControl>
                          <FormLabel>Time Limit (minutes)</FormLabel>
                          <Input
                            type="number"
                            value={editQuizFormData.timeLimit}
                            onChange={(e) => setEditQuizFormData({ ...editQuizFormData, timeLimit: e.target.value })}
                            placeholder="Optional"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Status</FormLabel>
                          <Select
                            value={editQuizFormData.isActive ? 'active' : 'inactive'}
                            onChange={(e) =>
                              setEditQuizFormData({ ...editQuizFormData, isActive: e.target.value === 'active' })
                            }
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </Select>
                        </FormControl>
                      </HStack>
                    </VStack>
                  </TabPanel>

                  {/* JSON Upload Tab */}
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <Alert status="info">
                        <AlertIcon />
                        <Box>
                          <AlertTitle>Update Quiz from JSON</AlertTitle>
                          <AlertDescription>
                            Paste JSON content to update quiz details and questions. The JSON should contain quiz metadata and a questions array.
                          </AlertDescription>
                        </Box>
                      </Alert>

                      <FormControl isRequired>
                        <HStack justify="space-between" mb={2}>
                          <FormLabel mb={0}>JSON Content</FormLabel>
                          <Button
                            size="sm"
                            variant="outline"
                            colorScheme="blue"
                            onClick={handleDownloadJSONTemplate}
                          >
                            📥 Download Template
                          </Button>
                        </HStack>
                        <Textarea
                          value={editQuizJsonFormData.jsonContent}
                          onChange={(e) =>
                            setEditQuizJsonFormData({ ...editQuizJsonFormData, jsonContent: e.target.value })
                          }
                          placeholder={`{\n  "name": "Quiz Name",\n  "description": "Description",\n  "ageGroup": "6-8",\n  "difficulty": "Basic",\n  "passingPercentage": 60,\n  "timeLimit": 30,\n  "questions": [\n    {\n      "question": "Question text",\n      "options": {"A": "...", "B": "...", "C": "...", "D": "..."},\n      "correctAnswer": "A",\n      "explanation": "Explanation text"\n    }\n  ]\n}`}
                          height="300px"
                          fontFamily="mono"
                        />
                      </FormControl>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onEditQuizClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={editQuizModalTab === 0 ? handleUpdateQuiz : handleUpdateQuizFromJSON}
                isLoading={loading}
              >
                {editQuizModalTab === 0 ? 'Update Quiz' : 'Update from JSON'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Quiz Report Modal */}
        {reportScheduledTestId && (
          <QuizReport
            scheduledTestId={reportScheduledTestId}
            isOpen={isReportOpen}
            onClose={() => {
              onReportClose();
              setReportScheduledTestId(null);
            }}
          />
        )}
      </VStack>
    </Box>
  );
};

