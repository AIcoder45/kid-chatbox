# Quiz Management Feature Implementation

## Overview

This document describes the comprehensive quiz management system implemented for the admin portal, allowing admins to create quizzes using AI generation or JSON upload, and schedule tests with users based on selected plans.

## Features Implemented

### 1. AI-Generated Quiz Creation ✅
- **Multiple Input Fields:**
  - Number of questions (1-50)
  - Difficulty levels (Basic, Advanced, Expert, Mix)
  - Topics selection (multiple topics supported)
  - Age groups (6-8, 9-11, 12-14 years)
  - Language preference (English, Hindi, Hinglish)
  - Passing percentage
  - Optional time limit
- **Backend Integration:** Server-side OpenAI API integration for question generation
- **Validation:** Comprehensive input validation and error handling

### 2. JSON Upload Quiz Creation ✅
- **JSON Format Support:** Upload quizzes via JSON with questions, answers, and justifications
- **Flexible Structure:** Supports multiple question types (multiple choice, true/false, fill blank, etc.)
- **Validation:** JSON parsing and structure validation
- **Error Handling:** Clear error messages for invalid JSON formats

### 3. Scheduled Tests ✅
- **Plan-Based Scheduling:** Schedule tests for users based on selected plans
- **Direct User Assignment:** Option to assign tests directly to specific users
- **Scheduling Options:**
  - Scheduled date/time
  - Optional due date
  - Custom instructions for students
- **Status Tracking:** Track test status (scheduled, active, completed, cancelled)

## Database Schema

### Scheduled Tests Table
```sql
CREATE TABLE scheduled_tests (
  id UUID PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id),
  scheduled_by UUID REFERENCES users(id),
  scheduled_for TIMESTAMP NOT NULL,
  due_date TIMESTAMP,
  plan_ids UUID[],
  user_ids UUID[],
  status VARCHAR(20) CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  instructions TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## API Endpoints

### Quiz Management

#### Generate Quiz with AI
```
POST /api/quizzes/generate
```
**Request Body:**
```json
{
  "subtopicId": "uuid",
  "name": "Quiz Name",
  "description": "Optional description",
  "ageGroup": "6-8",
  "difficulty": "Basic",
  "numberOfQuestions": 15,
  "passingPercentage": 60,
  "timeLimit": 30,
  "topics": ["Topic 1", "Topic 2"],
  "language": "English"
}
```

#### Upload Quiz from JSON
```
POST /api/quizzes/upload
```
**Request Body:**
```json
{
  "subtopicId": "uuid",
  "name": "Quiz Name",
  "description": "Optional description",
  "ageGroup": "6-8",
  "difficulty": "Basic",
  "passingPercentage": 60,
  "timeLimit": 30,
  "questions": [
    {
      "question": "Question text",
      "questionType": "multiple_choice",
      "options": {"A": "...", "B": "...", "C": "...", "D": "..."},
      "correctAnswer": "A",
      "explanation": "Explanation text",
      "justification": "Justification text",
      "hint": "Optional hint",
      "points": 1
    }
  ]
}
```

#### Get All Quizzes
```
GET /api/quizzes?ageGroup=6-8&difficulty=Basic&subtopicId=uuid
```

### Scheduled Tests

#### Create Scheduled Test
```
POST /api/scheduled-tests
```
**Request Body:**
```json
{
  "quizId": "uuid",
  "scheduledFor": "2024-01-15T10:00:00Z",
  "dueDate": "2024-01-20T23:59:59Z",
  "planIds": ["plan-uuid-1", "plan-uuid-2"],
  "userIds": ["user-uuid-1"],
  "instructions": "Optional instructions"
}
```

#### Get All Scheduled Tests
```
GET /api/scheduled-tests?status=scheduled&quizId=uuid
```

#### Get Scheduled Test by ID
```
GET /api/scheduled-tests/:id
```

#### Update Scheduled Test
```
PUT /api/scheduled-tests/:id
```

#### Delete Scheduled Test
```
DELETE /api/scheduled-tests/:id
```

#### Get Eligible Users
```
GET /api/scheduled-tests/:id/eligible-users
```

## Frontend Components

### QuizManagement Component
**Location:** `src/components/admin/QuizManagement.tsx`

**Features:**
- Tabbed interface for Quizzes and Scheduled Tests
- Modal for creating quizzes with two tabs:
  - AI Generation tab
  - JSON Upload tab
- Modal for scheduling tests
- Quiz list with actions (Schedule, Delete)
- Scheduled tests list with status badges
- Plan selection for scheduling

**Key Functions:**
- `handleAIGenerate()` - Generates quiz using AI
- `handleJSONUpload()` - Uploads quiz from JSON
- `handleScheduleTest()` - Schedules test with plans/users
- `loadQuizzes()` - Loads all quizzes
- `loadScheduledTests()` - Loads all scheduled tests

## Backend Services

### OpenAI Service
**Location:** `server/utils/openai.js`

**Function:**
- `generateQuizQuestions(config)` - Generates quiz questions using OpenAI API

### Database Migration
**Location:** `server/scripts/migrate-scheduled-tests.js`

**Run Migration:**
```bash
npm run db:migrate-scheduled-tests
```

Or the migration runs automatically on server start.

## Setup Instructions

### 1. Environment Variables
Ensure these are set in your `.env` file:
```env
OPENAI_API_KEY=sk-your-key-here
# OR
VITE_OPENAI_API_KEY=sk-your-key-here
```

### 2. Run Database Migration
The scheduled tests table will be created automatically on server start, or run manually:
```bash
npm run db:migrate-scheduled-tests
```

### 3. Access Admin Portal
1. Login as admin user
2. Navigate to `/admin/quizzes`
3. Click "Create Quiz" to start creating quizzes

## Usage Examples

### Creating AI-Generated Quiz
1. Click "Create Quiz" button
2. Select "AI Generation" tab
3. Select Topic and Subtopic
4. Fill in quiz details (name, age group, difficulty, number of questions)
5. Optionally set topics, language, time limit
6. Click "Generate with AI"
7. Quiz is created with AI-generated questions

### Uploading Quiz from JSON
1. Click "Create Quiz" button
2. Select "JSON Upload" tab
3. Select Topic and Subtopic
4. Fill in quiz details
5. Paste JSON questions in the textarea
6. Click "Upload Quiz"
7. Quiz is created with uploaded questions

### Scheduling a Test
1. Click "Schedule" button on any quiz
2. Select quiz (if not pre-selected)
3. Set scheduled date/time
4. Optionally set due date
5. Select plans (users with these plans will be eligible)
6. Optionally add specific user IDs
7. Add instructions (optional)
8. Click "Schedule Test"

## JSON Format Example

```json
[
  {
    "question": "What is 2 + 2?",
    "questionType": "multiple_choice",
    "options": {
      "A": "3",
      "B": "4",
      "C": "5",
      "D": "6"
    },
    "correctAnswer": "B",
    "explanation": "2 + 2 equals 4. This is basic addition.",
    "justification": "The sum of two and two is four.",
    "hint": "Think about counting: 2, then 2 more",
    "points": 1
  },
  {
    "question": "Which planet is closest to the Sun?",
    "questionType": "multiple_choice",
    "options": {
      "A": "Venus",
      "B": "Mercury",
      "C": "Earth",
      "D": "Mars"
    },
    "correctAnswer": "B",
    "explanation": "Mercury is the closest planet to the Sun in our solar system.",
    "points": 1
  }
]
```

## Permissions

All endpoints require the `manage_quizzes` permission. Ensure admin users have this permission assigned.

## Notes

- AI generation uses GPT-4 model
- Questions are validated for structure and completeness
- Scheduled tests can target multiple plans and users simultaneously
- Quiz deletion cascades to scheduled tests (handled by database constraints)
- All timestamps are stored in UTC

## Future Enhancements

Potential improvements:
- Bulk quiz creation
- Quiz templates
- Question bank management
- Automated test notifications
- Test analytics and reporting
- Recurring test schedules


