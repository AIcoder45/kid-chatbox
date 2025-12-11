# Comprehensive Analytics System Documentation

## Overview

A complete analytics system has been built for the admin portal to track all user activities, study patterns, quiz performance, and system metrics. The system provides comprehensive insights through various chart types and automated recommendations.

## Components Built

### 1. Event Tracking System (`server/utils/eventTracker.js`)

Comprehensive event tracking utility that logs all user activities:

**Event Types Tracked:**
- User Events: LOGIN, LOGOUT, REGISTER, APPROVED, REJECTED, SUSPENDED
- Study Events: TOPIC_VIEWED, SUBTOPIC_VIEWED, STUDY_MATERIAL_VIEWED, STUDY_SESSION_STARTED, STUDY_SESSION_COMPLETED, VIDEO_STARTED, VIDEO_PAUSED, VIDEO_COMPLETED, CONTENT_REVISITED
- Quiz Events: QUIZ_STARTED, QUIZ_COMPLETED, QUIZ_ABANDONED, QUESTION_ANSWERED, HINT_USED, EXPLANATION_VIEWED
- Dashboard Events: DASHBOARD_VIEWED, HOME_SCREEN_VIEWED
- Admin Events: TOPIC_CREATED, QUIZ_CREATED, USER_CREATED, USER_UPDATED
- System Events: IDLE_TIME_DETECTED, DROPOFF_DETECTED

**Tracking Functions:**
- `trackLogin()` - Tracks user logins
- `trackLogout()` - Tracks user logouts with session duration
- `trackTopicView()` - Tracks topic views
- `trackSubtopicView()` - Tracks subtopic views
- `trackStudySessionStart()` - Tracks study session starts
- `trackStudySessionComplete()` - Tracks study session completion with duration and progress
- `trackQuizStart()` - Tracks quiz attempts start
- `trackQuizComplete()` - Tracks quiz completion with score and duration
- `trackQuestionAnswer()` - Tracks individual question answers
- `trackHintUsed()` - Tracks hint usage
- `trackExplanationViewed()` - Tracks explanation views
- `trackVideoStart/Pause/Complete()` - Tracks video interactions
- `trackDashboardView()` - Tracks dashboard views
- `trackContentRevisit()` - Tracks content revisits
- `trackIdleTime()` - Tracks idle time detection
- `trackDropoff()` - Tracks dropoff points
- `trackTopicCreated()` - Tracks topic creation by admins
- `trackQuizCreated()` - Tracks quiz creation by admins
- `trackUserApproved()` - Tracks user approvals

### 2. Database Schema Enhancement

**Migration Script:** `server/scripts/migrate-analytics-schema.js`

Enhanced `activity_logs` table with:
- `event_type` (VARCHAR) - Specific event type
- `duration` (INTEGER) - Duration in seconds
- Indexes for performance:
  - `idx_activity_logs_event_type` - Fast event type queries
  - `idx_activity_logs_duration` - Duration-based analytics
  - `idx_activity_logs_user_event` - User-event composite index
  - `idx_activity_logs_created_at_date` - Date-based queries

### 3. Analytics API Endpoints (`server/routes/admin-analytics.js`)

**Endpoints:**

1. **GET /api/admin/analytics/summary**
   - Platform summary statistics
   - Total users, active users, pending users
   - Total topics, quizzes, attempts
   - Average score

2. **GET /api/admin/analytics/users**
   - User analytics with filters (ageGroup, startDate, endDate)
   - Quiz attempts, study sessions, average scores
   - Total study time, tokens earned

3. **GET /api/admin/analytics/topics**
   - Topic performance metrics
   - Subtopic count, quiz count, attempt count
   - Average scores, unique students

4. **GET /api/admin/analytics/engagement**
   - Daily Active Users (DAU)
   - Weekly Active Users (WAU)
   - Monthly Active Users (MAU)
   - Session duration distribution
   - Most active hours of the day

5. **GET /api/admin/analytics/study**
   - Most studied topics
   - Least studied topics
   - Study completion rates
   - Average study time per session

6. **GET /api/admin/analytics/quizzes**
   - Most attempted quizzes
   - Quiz success rates by difficulty
   - Questions with high error rates
   - Average scores per quiz

7. **GET /api/admin/analytics/insights**
   - Automated insights and recommendations
   - Topics rarely studied
   - Quizzes with high failure rates
   - Inactive users

8. **GET /api/admin/analytics/activity-logs**
   - Activity logs with filters
   - User, action, eventType, date range filters

### 4. Frontend Analytics Dashboard

**Main Component:** `src/components/admin/AnalyticsDashboard.tsx`

**Sub-components:**

1. **UserAnalytics** (`src/components/admin/analytics/UserAnalytics.tsx`)
   - Bar charts for top users by quiz attempts
   - Line charts for average scores
   - Area charts for study time distribution
   - Pie charts for age group distribution

2. **StudyAnalytics** (`src/components/admin/analytics/StudyAnalytics.tsx`)
   - Bar charts for most/least studied topics
   - Pie charts for completion rates
   - Average study time metrics

3. **QuizAnalytics** (`src/components/admin/analytics/QuizAnalytics.tsx`)
   - Bar charts for most attempted quizzes
   - Success rate by difficulty
   - Radar charts for quiz performance metrics
   - Tables for high error rate questions

4. **EngagementAnalytics** (`src/components/admin/analytics/EngagementAnalytics.tsx`)
   - Area charts for DAU
   - Line charts for WAU
   - Pie charts for session duration
   - Bar charts for active hours

5. **SystemAnalytics** (`src/components/admin/analytics/SystemAnalytics.tsx`)
   - System performance metrics
   - Topics performance charts
   - Platform statistics

6. **AnalyticsInsights** (`src/components/admin/analytics/AnalyticsInsights.tsx`)
   - Automated insights display
   - Recommendations
   - Alert system for critical issues

### 5. Chart Types Implemented

- **Bar Charts** - User activity, quiz attempts, topic views
- **Line Charts** - Score trends, active users over time
- **Area Charts** - DAU trends, study time
- **Pie Charts** - Age group distribution, completion rates
- **Donut Charts** - (Can be implemented using Pie charts)
- **Radar Charts** - Quiz performance metrics
- **Heatmaps** - (Can be added for activity patterns)
- **Funnel Charts** - (Can be added for conversion funnels)

### 6. Event Tracking Integration

**Routes with Tracking:**
- `server/routes/auth.js` - Login, Register tracking
- `server/routes/quizzes.js` - Quiz start, completion, question answers
- `server/routes/study.js` - Study session tracking

**To Add Tracking:**
- Dashboard views (frontend)
- Video interactions (frontend)
- Hint usage (frontend)
- Explanation views (frontend)
- Idle time detection (frontend)
- Dropoff detection (frontend)

## Usage

### Accessing Analytics Dashboard

1. Navigate to `/admin/analytics` as an admin user
2. Use date range filters (7d, 30d, 90d, custom)
3. Filter by age group
4. View insights and recommendations
5. Explore different analytics tabs

### Running Migration

```bash
node server/scripts/migrate-analytics-schema.js
```

### Adding New Event Tracking

```javascript
const { trackEvent, EVENT_TYPES } = require('../utils/eventTracker');

// Track a custom event
await trackEvent({
  userId: user.id,
  eventType: EVENT_TYPES.CUSTOM_EVENT,
  resourceType: 'resource_type',
  resourceId: resourceId,
  metadata: { customData: 'value' },
  duration: 120, // seconds
});
```

## Features

### ✅ Implemented

1. Comprehensive event tracking system
2. Database schema with proper indexes
3. Analytics API endpoints
4. User analytics dashboard
5. Study analytics dashboard
6. Quiz analytics dashboard
7. Engagement analytics dashboard
8. System performance analytics
9. Automated insights and recommendations
10. Multiple chart types (Bar, Line, Area, Pie, Radar)
11. Date range filtering
12. Age group filtering

### 🔄 To Be Enhanced

1. Export functionality (PDF, Excel, CSV) - Basic structure ready
2. Frontend tracking for dashboard views, video interactions
3. Heatmap charts for activity patterns
4. Funnel charts for conversion tracking
5. Real-time analytics updates
6. Custom date range picker UI
7. More detailed insights

## Next Steps

1. **Add Frontend Tracking:**
   - Track dashboard views on component mount
   - Track video play/pause/complete events
   - Track hint and explanation views
   - Implement idle time detection
   - Track dropoff points

2. **Export Functionality:**
   - Add PDF export using jsPDF
   - Add Excel export using xlsx
   - Add CSV export
   - Export buttons in dashboard

3. **Enhanced Visualizations:**
   - Add heatmap for activity patterns
   - Add funnel charts for conversion
   - Add correlation charts
   - Add leaderboards

4. **Performance Optimization:**
   - Add caching for analytics queries
   - Implement data aggregation tables
   - Add background jobs for heavy calculations

## API Examples

### Get User Analytics
```bash
GET /api/admin/analytics/users?ageGroup=9-11&startDate=2024-01-01&endDate=2024-01-31
```

### Get Engagement Analytics
```bash
GET /api/admin/analytics/engagement?startDate=2024-01-01&endDate=2024-01-31
```

### Get Insights
```bash
GET /api/admin/analytics/insights
```

## Notes

- All analytics endpoints require `view_analytics` permission
- Event tracking is non-blocking (errors don't break the app)
- Analytics queries are optimized with proper indexes
- Dashboard components are responsive and mobile-friendly
- Chart data is dynamically loaded based on filters

