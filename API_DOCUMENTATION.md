# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "age": 10,
  "grade": "Class 5",
  "preferredLanguage": "English"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "age": 10,
    "grade": "Class 5",
    "preferredLanguage": "English",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as register

#### Social Login
```http
POST /api/auth/social
Content-Type: application/json

{
  "provider": "google",
  "token": "social_token",
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:** Same as register

---

### Quiz Results

#### Save Quiz Result
```http
POST /api/quiz/results
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "Maths",
  "subtopic": "Addition & subtraction",
  "age": 10,
  "language": "English",
  "answers": [
    {
      "questionNumber": 1,
      "question": "What is 2 + 2?",
      "childAnswer": "A",
      "correctAnswer": "B",
      "explanation": "2 + 2 = 4",
      "isCorrect": false
    }
  ],
  "correct_count": 12,
  "wrong_count": 3,
  "explanation_of_mistakes": "Q1: explanation...",
  "time_taken": 540,
  "score_percentage": 80
}
```

**Response:**
```json
{
  "success": true,
  "id": "quiz_result_uuid",
  "message": "Quiz result saved successfully"
}
```

#### Get Quiz History
```http
GET /api/quiz/history/:userId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "uuid",
      "timestamp": "2024-01-01T00:00:00.000Z",
      "subject": "Maths",
      "subtopic": "Addition & subtraction",
      "score_percentage": 80,
      "answers": [...]
    }
  ]
}
```

---

### Profile

#### Get User Profile
```http
GET /api/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "age": 10,
    "grade": "Class 5",
    "preferredLanguage": "English",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update User Profile
```http
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "age": 10,
  "grade": "Class 5",
  "preferredLanguage": "English"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "age": 10,
    "grade": "Class 5",
    "preferredLanguage": "English",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Profile updated successfully"
}
```

---

### Analytics

#### Get User Analytics
```http
GET /api/analytics/:userId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "total_quizzes": 10,
  "per_subject_accuracy": {
    "Maths": 85,
    "English": 70
  },
  "per_subtopic_accuracy": {
    "Addition & subtraction": 90,
    "Multiplication": 80
  },
  "time_spent_studying": 5400,
  "improvement_trend": [60, 65, 70, 75, 80],
  "last_three_scores": [
    {
      "score": 80,
      "subject": "Maths",
      "date": "2024-01-01T00:00:00.000Z"
    }
  ],
  "strengths": ["Maths"],
  "weaknesses": ["English"],
  "recommended_topics": ["Grammar basics", "Vocabulary"]
}
```

#### Get Recommended Topics
```http
GET /api/analytics/recommendations/:userId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "topics": [
    {
      "subject": "English",
      "subtopic": "Grammar basics",
      "reason": "Your average score is 60%. Practice more to improve!"
    }
  ]
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

