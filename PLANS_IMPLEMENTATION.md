# User Plans & Daily Limits Implementation

## Overview

This document describes the implementation of the User Plans and Daily Limits system for KidChatbox.

## Features

### 1. Default User Registration
- New users (email/password or OAuth) are automatically assigned the **Freemium Plan**
- Freemium Plan limits:
  - Max 1 quiz per day
  - Max 1 topic per day
  - No carry-forward limits
  - Daily counters reset at midnight server time

### 2. Admin Control Panel
- **Super Admin Only** access to plan management
- Create multiple plans with:
  - Plan Name
  - Description
  - Daily Quiz Limit
  - Daily Topic Limit
  - Monthly Cost (optional)
  - Status (Active/Inactive)
- Assign plans to users
- View plan usage statistics

### 3. Backend Architecture

#### Database Schema

**Plans Table:**
```sql
- id (UUID)
- name (VARCHAR, UNIQUE)
- description (TEXT)
- daily_quiz_limit (INTEGER)
- daily_topic_limit (INTEGER)
- monthly_cost (DECIMAL)
- status (active/inactive)
- created_at, updated_at
```

**User Plans Table:**
```sql
- id (UUID)
- user_id (UUID, FK → users)
- plan_id (UUID, FK → plans)
- assigned_at (TIMESTAMP)
- assigned_by (UUID, FK → users)
```

**Daily Usage Table:**
```sql
- id (UUID)
- user_id (UUID, FK → users)
- usage_date (DATE)
- quiz_count (INTEGER)
- topic_count (INTEGER)
- reset_at (TIMESTAMP)
```

#### API Endpoints

**Plan Management:**
- `GET /api/plans` - Get all plans
- `GET /api/plans/:id` - Get plan by ID
- `POST /api/plans` - Create new plan
- `PUT /api/plans/:id` - Update plan
- `DELETE /api/plans/:id` - Delete/deactivate plan
- `POST /api/plans/:planId/assign/:userId` - Assign plan to user
- `GET /api/plans/user/:userId` - Get user's current plan and usage

**Middleware:**
- `checkQuizLimit` - Validates daily quiz limit before allowing quiz start
- `checkTopicLimit` - Validates daily topic limit before allowing topic access
- `incrementQuizUsage` - Increments quiz count after successful quiz start
- `incrementTopicUsage` - Increments topic count after successful topic access

#### Protected Routes

**Quiz Routes:**
- `POST /api/quizzes/:quizId/attempt` - Protected with `checkQuizLimit` and `incrementQuizUsage`

**Study Routes:**
- `POST /api/study/sessions` - Protected with `checkTopicLimit` and `incrementTopicUsage`

### 4. Frontend Components

**Admin Panel:**
- `/admin/plans` - Plan Management page
  - View all plans
  - Create/Edit plans
  - Assign plans to users
  - View plan statistics

**User Features:**
- Users can view their current plan and daily usage via API
- Limit validation happens automatically on quiz/topic access

## Setup Instructions

### 1. Run Database Migration

```bash
npm run db:migrate-plans
```

Or the migration will run automatically on server start.

### 2. Verify Freemium Plan

The Freemium plan is created automatically during migration. Verify it exists:

```sql
SELECT * FROM plans WHERE name = 'Freemium';
```

### 3. Test Plan Assignment

1. Login as admin
2. Navigate to `/admin/plans`
3. Create a new plan or use existing Freemium plan
4. Assign plan to a user via "Assign Plan to User" button

## Daily Limit Reset

Daily counters automatically reset at midnight server time. The system uses PostgreSQL's `CURRENT_DATE` function to track daily usage. When a new day starts, `getDailyUsage()` creates a new record with zero counts.

## Usage Examples

### Check User's Daily Limits

```javascript
// Get user plan and usage
const response = await apiClient.get(`/api/plans/user/${userId}`);
const { plan, usage, limits } = response.data;

console.log(`Plan: ${plan.name}`);
console.log(`Quizzes used: ${usage.quizCount}/${limits.dailyQuizLimit}`);
console.log(`Topics used: ${usage.topicCount}/${limits.dailyTopicLimit}`);
```

### Assign Plan to User (Admin)

```javascript
// Assign Premium plan to user
await apiClient.post(`/api/plans/${planId}/assign/${userId}`);
```

### Create New Plan (Admin)

```javascript
const newPlan = {
  name: 'Premium',
  description: 'Unlimited access',
  dailyQuizLimit: 10,
  dailyTopicLimit: 10,
  monthlyCost: 9.99,
  status: 'active'
};

await apiClient.post('/api/plans', newPlan);
```

## Error Handling

When a user exceeds their daily limit:

**Quiz Limit Exceeded:**
```json
{
  "success": false,
  "message": "Daily quiz limit reached. You have used 1 of 1 quizzes today.",
  "limit": 1,
  "used": 1,
  "remaining": 0
}
```

**Topic Limit Exceeded:**
```json
{
  "success": false,
  "message": "Daily topic limit reached. You have used 1 of 1 topics today.",
  "limit": 1,
  "used": 1,
  "remaining": 0
}
```

## Files Created/Modified

### Backend Files:
- `server/scripts/migrate-plans-schema.js` - Database migration
- `server/utils/plans.js` - Plan utility functions
- `server/routes/plans.js` - Plan management API routes
- `server/middleware/plan-limits.js` - Limit validation middleware
- `server/routes/auth.js` - Updated to assign Freemium plan on registration
- `server/routes/quizzes.js` - Added limit validation
- `server/routes/study.js` - Added limit validation
- `server/config/database.js` - Added plans migration

### Frontend Files:
- `src/components/admin/PlanManagement.tsx` - Plan management UI
- `src/components/admin/AdminLayout.tsx` - Added Plans navigation
- `src/App.tsx` - Added Plans route

## Notes

- Daily limits reset automatically at midnight server time
- Users without an assigned plan default to Freemium limits
- Plan changes take effect immediately when assigned
- Only active plans can be assigned to users
- Plans with assigned users cannot be hard-deleted (soft-deleted by setting status to inactive)

