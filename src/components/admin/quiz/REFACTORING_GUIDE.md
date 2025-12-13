# QuizManagement Refactoring Guide

## Current Problem
**QuizManagement.tsx: 3,127 lines** - Everything in one file!

## Breakdown by Section

| Section | Lines | What It Contains |
|---------|-------|------------------|
| Imports & Types | 1-64 | All imports, type definitions |
| State Management | 65-154 | 20+ useState hooks |
| Data Loading | 156-247 | loadQuizzes, loadTopics, loadSubtopics, etc. |
| Topic/Subtopic Logic | 249-326 | ensureTopicAndSubtopic function |
| Handler Functions | 328-1147 | All CRUD handlers (~800 lines) |
| CSV Parsing | 624-795 | CSV parsing utilities |
| Template Downloads | 797-870 | JSON/CSV template generators |
| Main Render | 1525-1775 | Tabs, headers, buttons |
| Create Quiz Modal | 1776-2276 | Inline modal (~500 lines) |
| Schedule Modal | 2278-2431 | Inline modal (~150 lines) |
| View Scheduled Modal | 2433-2592 | Inline modal (~160 lines) |
| View Quiz Modal | 2594-2799 | Already extracted |
| Edit Question Modal | 2801-2925 | Already extracted |
| Edit Quiz Modal | 2927-3109 | Inline modal (~180 lines) |
| Quiz Report | 3111-3121 | Already extracted |

## Files Created ✅

1. **`csvParsing.ts`** - CSV parsing utilities
2. **`fileTemplates.ts`** - Template generators  
3. **`topicUtils.ts`** - Topic/subtopic creation logic
4. **`CreateQuizModal.tsx`** - Create quiz modal component
5. **`TopicSubtopicSelector.tsx`** - Reusable selector component
6. **`useQuizManagement.ts`** - Data loading hook
7. **`ScheduledTestsTable.tsx`** - Scheduled tests table

## Files Still Needed 🔄

1. **`ScheduleTestModal.tsx`** - Extract schedule modal (lines 2278-2431)
2. **`ViewScheduledTestModal.tsx`** - Extract view modal (lines 2433-2592)
3. **`EditQuizModal.tsx`** - Extract edit modal (lines 2927-3109)
4. **`quizHandlers.ts`** - Extract all handler functions (lines 328-1147)
5. **`questionValidation.ts`** - Extract question validation logic

## Target Structure

After refactoring, `QuizManagement.tsx` should be ~300-400 lines:

```typescript
// QuizManagement.tsx (simplified)
import { useQuizManagement } from './quiz/useQuizManagement';
import { QuizTable } from './quiz/QuizTable';
import { ScheduledTestsTable } from './quiz/ScheduledTestsTable';
import { CreateQuizModal } from './quiz/CreateQuizModal';
import { EditQuizModal } from './quiz/EditQuizModal';
import { ViewQuizModal } from './quiz/ViewQuizModal';
import { ScheduleTestModal } from './quiz/ScheduleTestModal';
import { ViewScheduledTestModal } from './quiz/ViewScheduledTestModal';
import { EditQuestionModal } from './quiz/EditQuestionModal';
import { QuizReport } from './quiz/QuizReport';
import { useQuizHandlers } from './quiz/quizHandlers';

export const QuizManagement = () => {
  const { quizzes, topics, subtopics, plans, scheduledTests, loading, error, loadData } = useQuizManagement();
  const handlers = useQuizHandlers({ loadData, ... });
  
  // Minimal state for modals only
  const [activeTab, setActiveTab] = useState(0);
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  // ... other modal states
  
  return (
    <Box>
      {/* Header */}
      {/* Tabs */}
      <Tabs>
        <TabPanel>
          <QuizTable {...handlers} />
        </TabPanel>
        <TabPanel>
          <ScheduledTestsTable {...handlers} />
        </TabPanel>
      </Tabs>
      
      {/* Modals */}
      <CreateQuizModal {...props} />
      <EditQuizModal {...props} />
      {/* ... other modals */}
    </Box>
  );
};
```

## Benefits

1. **Maintainability** - Each component has single responsibility
2. **Reusability** - Components can be reused elsewhere
3. **Testability** - Easier to test individual components
4. **Readability** - Main file becomes an orchestrator
5. **Performance** - Better code splitting opportunities

## Next Steps

1. Create remaining modal components
2. Extract handler functions to `quizHandlers.ts`
3. Refactor main `QuizManagement.tsx` to use extracted components
4. Update imports and fix any type issues
5. Test all functionality

