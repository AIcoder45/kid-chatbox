# Backend API Server

Node.js/Express backend with PostgreSQL database for KidChatbox application.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 12+ installed and running
- PostgreSQL database created (or will be created automatically)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update database credentials:
     ```
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=kidchatbox
     DB_USER=postgres
     DB_PASSWORD=your_password
     ```
   - Set JWT secret:
     ```
     JWT_SECRET=your-secret-key-change-in-production
     ```

3. **Create PostgreSQL database:**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE kidchatbox;

   # Exit
   \q
   ```

4. **Start the server:**
   ```bash
   npm run dev:server
   ```

   The database tables will be created automatically on first run.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/social` - Social login (Google/Apple)

### Quiz

- `POST /api/quiz/results` - Save quiz result (requires auth)
- `GET /api/quiz/history/:userId` - Get quiz history (requires auth)

### Analytics

- `GET /api/analytics/:userId` - Get user analytics (requires auth)
- `GET /api/analytics/recommendations/:userId` - Get recommended topics (requires auth)

## Database Schema

### users
- id (UUID, Primary Key)
- email (VARCHAR, Unique)
- password_hash (VARCHAR)
- name (VARCHAR)
- age (INTEGER)
- grade (VARCHAR)
- preferred_language (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### quiz_results
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key → users.id)
- timestamp (TIMESTAMP)
- subject (VARCHAR)
- subtopic (TEXT)
- age (INTEGER)
- language (VARCHAR)
- correct_count (INTEGER)
- wrong_count (INTEGER)
- explanation_of_mistakes (TEXT)
- time_taken (INTEGER)
- score_percentage (DECIMAL)

### quiz_answers
- id (UUID, Primary Key)
- quiz_result_id (UUID, Foreign Key → quiz_results.id)
- question_number (INTEGER)
- question (TEXT)
- child_answer (VARCHAR)
- correct_answer (VARCHAR)
- explanation (TEXT)
- is_correct (BOOLEAN)

## Running Both Frontend and Backend

To run both frontend and backend simultaneously:

```bash
npm run dev:all
```

This will start:
- Backend API on http://localhost:3000
- Frontend on http://localhost:5173 (or Vite default port)

## Testing

Test the API with:

```bash
# Health check
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

