# Why QuizManagement.tsx is 3100+ Lines

## Root Causes

The file contains **everything** in one component:

### 1. **State Management** (~100 lines)
- 20+ useState hooks for all form states, modals, selections
- State for AI generation, JSON upload, editing, scheduling

### 2. **Data Loading Functions** (~200 lines)
- loadQuizzes, loadTopics, loadSubtopics, loadPlans, loadScheduledTests
- All data fetching logic inline

### 3. **Handler Functions** (~800 lines)
- handleAIGenerate, handleJSONUpload, handleScheduleTest
- handleDeleteQuiz, handleViewQuiz, handleEditQuiz
- handleUpdateQuiz, handleUpdateQuestion
- handleViewScheduledTest, handleEditScheduledTest
- ensureTopicAndSubtopic (topic/subtopic creation logic)

### 4. **CSV/JSON Parsing** (~200 lines)
- parseCSV, parseCSVLine, countLines, handleFileUpload
- Template download functions

### 5. **Inline Modal Components** (~1300 lines)
- Create Quiz Modal (AI + JSON/CSV tabs) - ~500 lines
- Edit Quiz Modal (Manual + JSON tabs) - ~200 lines
- Schedule Test Modal - ~150 lines
- View Scheduled Test Modal - ~160 lines
- View Quiz Modal - Already extracted
- Edit Question Modal - Already extracted

### 6. **Inline Table Components** (~200 lines)
- Quiz Table - Already extracted
- Scheduled Tests Table - ~100 lines

### 7. **Utility Functions** (~100 lines)
- parseQuestions, mapQuizData (already extracted)

### 8. **Main Render Logic** (~400 lines)
- Tabs, headers, buttons, modals orchestration

## Solution: Break Into Smaller Files

### ✅ Already Created:
1. `csvParsing.ts` - CSV utilities
2. `fileTemplates.ts` - Template generators
3. `CreateQuizModal.tsx` - Create quiz modal
4. `TopicSubtopicSelector.tsx` - Topic/subtopic selector
5. `useQuizManagement.ts` - Data loading hook
6. `ScheduledTestsTable.tsx` - Scheduled tests table

### 🔄 Still Need:
1. `ScheduleTestModal.tsx` - Schedule test modal
2. `ViewScheduledTestModal.tsx` - View scheduled test modal
3. `EditQuizModal.tsx` - Edit quiz modal
4. `quizHandlers.ts` - Extract all handler functions
5. Refactor main `QuizManagement.tsx` to use extracted components

## Target Structure

```
QuizManagement.tsx (~300 lines)
├── useQuizManagement hook
├── QuizTable component
├── ScheduledTestsTable component
├── CreateQuizModal component
├── EditQuizModal component
├── ViewQuizModal component
├── ScheduleTestModal component
├── ViewScheduledTestModal component
├── EditQuestionModal component
└── QuizReport component
```

This will reduce the main file from **3100+ lines to ~300 lines**!

