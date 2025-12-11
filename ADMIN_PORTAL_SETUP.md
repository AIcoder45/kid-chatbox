# Admin Portal Setup Guide

## Overview

This document describes the comprehensive admin portal that has been implemented for the KidChatbox platform.

## Features Implemented

### 1. Database Schema ✅
- Complete database migration script (`server/scripts/migrate-schema.js`)
- Tables for: users, roles, permissions, topics, subtopics, study materials, quizzes, quiz questions, quiz attempts, study progress, activity logs, tokens usage
- RBAC (Role-Based Access Control) system
- User approval workflow

### 2. Backend APIs ✅
- **Admin Routes** (`server/routes/admin.js`):
  - User management (list, approve, reject, suspend, assign roles)
  - Role and permission management
  - User analytics per user
  
- **Topics Routes** (`server/routes/topics.js`):
  - CRUD operations for topics and subtopics
  - Age group and difficulty filtering
  
- **Study Material Routes** (`server/routes/study-material.js`):
  - Create, read, update, delete study materials
  - Support for multiple content types (text, video, animated story, etc.)
  
- **Quizzes Routes** (`server/routes/quizzes.js`):
  - Quiz creation and management
  - Question management (multiple choice, true/false, fill blanks, match pairs, image-based)
  - Quiz attempt tracking
  - Score calculation and token rewards
  
- **Admin Analytics Routes** (`server/routes/admin-analytics.js`):
  - Platform summary statistics
  - User analytics
  - Topic analytics
  - Age group distribution
  - Popular topics
  - Quiz success rates
  - Activity logs

### 3. Frontend Components ✅
- **Admin Dashboard** (`src/components/admin/AdminDashboard.tsx`):
  - KPI cards with animations
  - Summary statistics
  - Pending user alerts
  
- **User Management** (`src/components/admin/UserManagement.tsx`):
  - User list with filters (status, search)
  - Approve/reject users
  - Assign roles
  - Suspend users
  - View user details
  
- **Topic Management** (`src/components/admin/TopicManagement.tsx`):
  - Create/edit topics
  - View subtopics
  - Delete topics
  
- **Admin Layout** (`src/components/admin/AdminLayout.tsx`):
  - Sidebar navigation
  - Consistent admin UI
  
- **Admin Guard** (`src/components/admin/AdminGuard.tsx`):
  - Route protection for admin pages
  - Permission checking

### 4. Services ✅
- **Admin Service** (`src/services/admin.ts`):
  - Complete API client for all admin operations
  - TypeScript interfaces for all data types

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

New dependencies added:
- `jspdf` - PDF export
- `xlsx` - Excel export  
- `react-icons` - Icons

### 2. Run Database Migration
```bash
node server/scripts/migrate-schema.js
```

Or it will run automatically when the server starts (via `server/config/database.js`).

### 3. Create First Admin User

After running the migration, you need to manually create an admin user in the database:

```sql
-- First, register a user normally through the app
-- Then run this SQL to assign admin role:

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'your-admin@email.com'
AND r.name = 'admin';
```

### 4. Start the Application
```bash
npm run dev:all
```

## Admin Portal Routes

- `/admin` - Dashboard
- `/admin/users` - User Management
- `/admin/topics` - Topic Management
- `/admin/quizzes` - Quiz Builder (to be implemented)
- `/admin/analytics` - Analytics & Reports (to be implemented)

## User Approval Workflow

1. User registers → Status: `pending`
2. Admin reviews user in User Management
3. Admin approves → Status: `approved`, module access granted
4. User can now access Study and Quiz modules

## Role & Permission System

### Default Roles:
- **admin** - Full platform control (all permissions)
- **content_manager** - Can manage topics, content, quizzes
- **student** - Standard user (default for new registrations)
- **parent** - Can view child progress (future feature)

### Permissions:
- `manage_users` - Manage all users
- `approve_users` - Approve/reject registrations
- `manage_topics` - Create/edit/delete topics
- `manage_subtopics` - Create/edit/delete subtopics
- `manage_study_material` - Manage study content
- `manage_quizzes` - Create/edit/delete quizzes
- `view_analytics` - View platform analytics
- `assign_roles` - Assign roles to users
- `export_reports` - Export reports

## Next Steps (To Complete)

### Frontend Components Needed:
1. **Quiz Builder Component** - Visual quiz creation interface
2. **Analytics Dashboard** - Charts and graphs for analytics
3. **Report Export** - PDF/Excel export functionality
4. **Subtopic Management** - Create/edit subtopics UI
5. **Study Material Editor** - Rich content editor
6. **Enhanced Student UI** - Improved study and quiz interfaces with animations

### Backend Enhancements:
1. Add activity logging middleware
2. Implement PDF/Excel export endpoints
3. Add image upload for topics/subtopics
4. Add video/audio upload support
5. Implement phone OTP (Phase 2)

## API Endpoints

### Admin APIs:
- `GET /api/admin/users` - List users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id/approve` - Approve/reject user
- `PUT /api/admin/users/:id/roles` - Assign roles
- `PUT /api/admin/users/:id` - Update user
- `PUT /api/admin/users/:id/reset-password` - Reset password
- `PUT /api/admin/users/:id/suspend` - Suspend user
- `GET /api/admin/roles` - List roles
- `GET /api/admin/permissions` - List permissions

### Topic APIs:
- `POST /api/topics` - Create topic
- `GET /api/topics` - List topics
- `GET /api/topics/:id` - Get topic with subtopics
- `PUT /api/topics/:id` - Update topic
- `DELETE /api/topics/:id` - Delete topic
- `POST /api/topics/:topicId/subtopics` - Create subtopic
- `GET /api/topics/:topicId/subtopics` - List subtopics
- `PUT /api/topics/subtopics/:id` - Update subtopic
- `DELETE /api/topics/subtopics/:id` - Delete subtopic

### Study Material APIs:
- `POST /api/study-material` - Create material
- `GET /api/study-material/subtopic/:subtopicId` - Get materials
- `GET /api/study-material/:id` - Get material
- `PUT /api/study-material/:id` - Update material
- `DELETE /api/study-material/:id` - Delete material

### Quiz APIs:
- `POST /api/quizzes` - Create quiz
- `GET /api/quizzes/subtopic/:subtopicId` - List quizzes
- `GET /api/quizzes/:id` - Get quiz with questions
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz
- `POST /api/quizzes/:quizId/questions` - Add question
- `PUT /api/quizzes/questions/:id` - Update question
- `DELETE /api/quizzes/questions/:id` - Delete question
- `POST /api/quizzes/:quizId/attempt` - Start quiz
- `POST /api/quizzes/attempts/:attemptId/submit` - Submit quiz
- `GET /api/quizzes/attempts/:attemptId/result` - Get result

### Analytics APIs:
- `GET /api/admin/analytics/summary` - Platform summary
- `GET /api/admin/analytics/users` - User analytics
- `GET /api/admin/analytics/topics` - Topic analytics
- `GET /api/admin/analytics/age-groups` - Age distribution
- `GET /api/admin/analytics/popular-topics` - Popular topics
- `GET /api/admin/analytics/quiz-success-rates` - Success rates
- `GET /api/admin/analytics/activity-logs` - Activity logs

## Security

- All admin routes require authentication
- Permission-based access control (RBAC)
- Admin guard checks user roles
- Module access control for students

## Notes

- The system uses PostgreSQL with UUID primary keys
- All timestamps are stored in UTC
- JSONB is used for flexible data storage (options, content, etc.)
- Framer Motion is used for animations
- Chakra UI provides the component library
- TypeScript ensures type safety throughout

## Troubleshooting

### Database Migration Issues:
- Ensure PostgreSQL is running
- Check database connection in `.env`
- Run migration manually: `node server/scripts/migrate-schema.js`

### Admin Access Issues:
- Verify user has admin role assigned
- Check user status is 'approved'
- Ensure JWT token is valid

### API Errors:
- Check server logs for detailed errors
- Verify database tables exist
- Ensure environment variables are set

