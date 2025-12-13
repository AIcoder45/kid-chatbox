/**
 * Quiz Management Component
 * Orchestrates quiz creation, editing, and scheduling
 */

import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  useToast,
} from '@/shared/design-system';
import { Quiz, QuizQuestion, ScheduledTest } from '@/services/admin';
import { QuizTable } from './quiz/QuizTable';
import { ScheduledTestsTable } from './quiz/ScheduledTestsTable';
import { CreateQuizModal } from './quiz/CreateQuizModal';
import { EditQuizModal } from './quiz/EditQuizModal';
import { ViewQuizModal } from './quiz/ViewQuizModal';
import { EditQuestionModal } from './quiz/EditQuestionModal';
import { ScheduleTestModal } from './quiz/ScheduleTestModal';
import { ViewScheduledTestModal } from './quiz/ViewScheduledTestModal';
import { QuizReport } from './quiz/QuizReport';
import { useQuizManagement } from './quiz/useQuizManagement';
import { createQuizHandlers } from './quiz/quizHandlers';

/**
 * Quiz Management component
 */
export const QuizManagement: React.FC = () => {
  const {
    quizzes,
    topics,
    subtopics,
    plans,
    scheduledTests,
    loading,
    error,
    loadQuizzes,
    loadTopics,
    loadSubtopics,
    loadScheduledTests,
    loadData,
  } = useQuizManagement();

  const toast = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [viewingQuiz, setViewingQuiz] = useState<{ quiz: Quiz; questions: QuizQuestion[] } | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [viewingScheduledTest, setViewingScheduledTest] = useState<ScheduledTest | null>(null);
  const [editingScheduledTestId, setEditingScheduledTestId] = useState<string | null>(null);
  const [reportScheduledTestId, setReportScheduledTestId] = useState<string | null>(null);
  const [editQuizModalTab, setEditQuizModalTab] = useState(0);
  const [editQuizFormData, setEditQuizFormData] = useState({
    name: '',
    description: '',
    ageGroup: '',
    difficulty: '',
    numberOfQuestions: 15,
    passingPercentage: 60,
    timeLimit: '',
    isActive: true,
  });
  const [editQuizJsonContent, setEditQuizJsonContent] = useState('');
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isScheduleOpen, onOpen: onScheduleOpen, onClose: onScheduleClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isViewScheduledTestOpen, onOpen: onViewScheduledTestOpen, onClose: onViewScheduledTestClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isEditQuizOpen, onOpen: onEditQuizOpen, onClose: onEditQuizClose } = useDisclosure();
  const { isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose } = useDisclosure();

  const handlers = createQuizHandlers({
    toast,
    setLoading: setActionLoading,
    loadQuizzes,
    loadTopics,
    loadScheduledTests,
    topics,
    onClose,
    onScheduleClose,
    onViewOpen,
    onEditOpen,
    onEditQuizOpen,
    onEditQuizClose,
    onViewScheduledTestOpen,
    setViewingQuiz,
    setEditingQuestion,
    setEditingQuiz,
    setViewingScheduledTest,
    setEditingScheduledTestId,
    viewingQuiz,
  });

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateQuiz = async (type: 'ai' | 'json', data: any) => {
    type === 'ai' ? await handlers.handleAIGenerate(data) : await handlers.handleJSONUpload(data);
  };

  const handleScheduleTestSubmit = async (data: typeof scheduleFormData) => {
    await handlers.handleScheduleTest(data, editingScheduledTestId);
    setEditingScheduledTestId(null);
    setScheduleFormData({ quizId: '', scheduledFor: '', visibleFrom: '', visibleUntil: '', durationMinutes: '', planIds: [], userIds: [], instructions: '' });
  };

  const handleEditScheduledTestClick = async (testId: string) => {
    await handlers.handleEditScheduledTest(testId, setScheduleFormData, onScheduleOpen);
  };

  const handleUpdateQuizSubmit = async (data: typeof editQuizFormData) => {
    if (!editingQuiz) return;
    await handlers.handleUpdateQuiz(editingQuiz.id, data);
    setEditingQuiz(null);
  };

  const handleUpdateQuizFromJSONSubmit = async (jsonContent: string) => {
    if (!editingQuiz) return;
    await handlers.handleUpdateQuizFromJSON(editingQuiz.id, jsonContent);
    setEditingQuiz(null);
  };

  const handleEditQuizClick = (quiz: Quiz) => {
    handlers.handleEditQuiz(quiz, setEditQuizFormData, setEditQuizModalTab, setEditQuizJsonContent);
  };

  const handleUpdateQuestionSubmit = async (question: QuizQuestion) => {
    await handlers.handleUpdateQuestion(question);
    setEditingQuestion(null);
  };

  const handleViewReport = (testId: string) => {
    setReportScheduledTestId(testId);
    onReportOpen();
  };

  const resetScheduleForm = () => {
    setScheduleFormData({ quizId: '', scheduledFor: '', visibleFrom: '', visibleUntil: '', durationMinutes: '', planIds: [], userIds: [], instructions: '' });
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
        <VStack spacing={3} align="stretch" display={{ base: 'flex', md: 'none' }}>
          <Heading size="md" color="gray.700">
            Quiz Management
          </Heading>
          <HStack spacing={2} flexWrap="wrap">
            <Button colorScheme="green" variant="outline" size="sm" flex="1" minW="120px" onClick={() => { resetScheduleForm(); onScheduleOpen(); }}>
              Schedule Quiz
            </Button>
            <Button colorScheme="blue" size="sm" flex="1" minW="120px" onClick={onOpen}>
              Create Quiz
            </Button>
          </HStack>
        </VStack>
        <HStack justify="space-between" align="center" display={{ base: 'none', md: 'flex' }}>
          <Heading size="lg" color="gray.700">
            Quiz Management
          </Heading>
          <HStack spacing={3}>
            <Button colorScheme="green" variant="outline" onClick={() => { resetScheduleForm(); onScheduleOpen(); }}>
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
              <QuizTable
                quizzes={quizzes}
                onView={handlers.handleViewQuiz}
                onEdit={handleEditQuizClick}
                onSchedule={(quiz) => {
                  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
                  const nextWeek = new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
                  setScheduleFormData({ quizId: quiz.id, scheduledFor: '', visibleFrom: tomorrow, visibleUntil: nextWeek, durationMinutes: quiz.timeLimit?.toString() || '60', planIds: [], userIds: [], instructions: '' });
                  onScheduleOpen();
                }}
                onDelete={handlers.handleDeleteQuiz}
              />
            </TabPanel>

            <TabPanel>
              <ScheduledTestsTable
                scheduledTests={scheduledTests}
                onView={handlers.handleViewScheduledTest}
                onEdit={handleEditScheduledTestClick}
                onDelete={handlers.handleDeleteScheduledTest}
                onViewReport={handleViewReport}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <CreateQuizModal
          isOpen={isOpen}
          onClose={onClose}
          onCreate={handleCreateQuiz}
          topics={topics}
          subtopics={subtopics}
          onTopicChange={loadSubtopics}
          loading={actionLoading}
        />

        <EditQuizModal
          isOpen={isEditQuizOpen}
          onClose={() => { onEditQuizClose(); setEditingQuiz(null); }}
          onUpdate={handleUpdateQuizSubmit}
          onUpdateFromJSON={handleUpdateQuizFromJSONSubmit}
          formData={editQuizFormData}
          setFormData={setEditQuizFormData}
          jsonContent={editQuizJsonContent}
          setJsonContent={setEditQuizJsonContent}
          activeTab={editQuizModalTab}
          setActiveTab={setEditQuizModalTab}
          loading={actionLoading}
        />

        <ViewQuizModal
          isOpen={isViewOpen}
          onClose={onViewClose}
          quiz={viewingQuiz}
          onEditQuestion={handlers.handleEditQuestion}
        />

        <EditQuestionModal
          isOpen={isEditOpen}
          onClose={() => { onEditClose(); setEditingQuestion(null); }}
          question={editingQuestion}
          onUpdate={handleUpdateQuestionSubmit}
          loading={actionLoading}
        />

        <ScheduleTestModal
          isOpen={isScheduleOpen}
          onClose={() => { onScheduleClose(); setEditingScheduledTestId(null); resetScheduleForm(); }}
          onSubmit={handleScheduleTestSubmit}
          quizzes={quizzes}
          plans={plans}
          formData={scheduleFormData}
          setFormData={setScheduleFormData}
          isEditing={!!editingScheduledTestId}
          loading={actionLoading}
        />

        <ViewScheduledTestModal
          isOpen={isViewScheduledTestOpen}
          onClose={onViewScheduledTestClose}
          test={viewingScheduledTest}
          onEdit={handleEditScheduledTestClick}
        />

        {reportScheduledTestId && (
          <QuizReport scheduledTestId={reportScheduledTestId} isOpen={isReportOpen} onClose={() => { onReportClose(); setReportScheduledTestId(null); }} />
        )}
      </VStack>
    </Box>
  );
};
