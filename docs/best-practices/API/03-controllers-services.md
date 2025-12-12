# Controllers & Services

## Keep Controllers Thin

**Controllers Should**:
- Extract request data (`req.body`, `req.params`, `req.query`)
- Call service functions
- Format and send responses
- Handle errors

**Controllers Should NOT**:
- Contain business logic
- Directly query database
- Perform complex calculations

**Example**:
```javascript
router.post('/quizzes', async (req, res, next) => {
  try {
    const quiz = await quizService.createQuiz(req.body, req.user.id);
    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
});
```

## Business Logic Goes in Services

**Service Layer** (`server/services/` or `server/utils/`):
- All business logic
- Database operations
- Data validation and transformation
- External API calls

**Benefits**: Reusability, testability, separation of concerns.

## Return Structured Responses

**Success Response**:
```javascript
res.json({
  success: true,
  data: result,
  message: 'Operation successful'
});
```

**Error Response**:
```javascript
res.status(400).json({
  success: false,
  message: 'Error message',
  error: 'ERROR_CODE'
});
```

**Consistent Format**: Always use same structure across all endpoints.

## Avoiding Deeply Nested Logic

**Use Early Returns**:
```javascript
if (!user) {
  return res.status(404).json({ success: false, message: 'User not found' });
}
```

**Extract Functions**: Break complex logic into smaller functions.

**Use Promises/Async-Await**: Avoid callback hell.

**Example**:
```javascript
// ❌ Bad: Deeply nested
if (user) {
  if (user.role === 'admin') {
    if (permission) {
      // logic
    }
  }
}

// ✅ Good: Early returns
if (!user) return error('User not found');
if (user.role !== 'admin') return error('Unauthorized');
if (!permission) return error('No permission');
// logic
```

