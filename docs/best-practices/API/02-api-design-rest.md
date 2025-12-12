# API Design (REST)

## Resource Naming Rules

**Use Nouns, Not Verbs**:
- ✅ `/api/users`, `/api/quizzes`, `/api/topics`
- ❌ `/api/getUsers`, `/api/createQuiz`

**Use Plural Nouns**: `/api/users` not `/api/user`

**Nested Resources**:
- `/api/users/:userId/quizzes` (user's quizzes)
- `/api/quizzes/:quizId/questions` (quiz questions)

**Keep URLs Simple**: Avoid deep nesting (>3 levels).

## Versioning Strategy

**URL Versioning** (Recommended):
```
/api/v1/users
/api/v2/users
```

**Header Versioning**:
```
Accept: application/vnd.api+json;version=1
```

**Current Project**: Use `/api/` prefix, add versioning when needed.

## Pagination Rules

**Query Parameters**:
```
GET /api/quizzes?page=1&limit=20&offset=0
```

**Response Format**:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**Default Limits**: Always set max limit (e.g., 100 items).

## Error Response Format

**Consistent Structure**:
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "details": {}
}
```

**Status Codes**: Use appropriate HTTP status codes (400, 401, 403, 404, 500).

## Consistent Status Codes

**Success**:
- `200 OK`: Successful GET, PUT, PATCH
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE

**Client Errors**:
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing/invalid auth
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource doesn't exist
- `409 Conflict`: Resource conflict

**Server Errors**:
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: Service down

