# Error Handling

## Centralized Error Handler

**Global Error Handler**:
```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  // Validation errors
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: err.details[0].message,
    });
  }

  // Database errors
  if (err.code === '23505') { // Unique violation
    return res.status(409).json({
      success: false,
      message: 'Resource already exists',
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

// Use in app
app.use(errorHandler);
```

## Typed Error Classes

**Custom Error Classes**:
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

// Usage
throw new ValidationError('Invalid input');
```

## Operational vs Programmer Errors

**Operational Errors** (Expected):
- Invalid user input
- Resource not found
- Authentication failures
- Handle gracefully, return user-friendly messages

**Programmer Errors** (Unexpected):
- Bugs in code
- Missing environment variables
- Database connection failures
- Log details, return generic message to user

**Handle Differently**: Operational errors are expected, programmer errors need fixing.

## Graceful Shutdown on Failures

**Database Connection Errors**:
```javascript
pool.on('error', (err) => {
  console.error('Database error:', err);
  // Don't exit immediately, try to reconnect
});
```

**Unhandled Rejections**:
```javascript
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  // Log and gracefully shutdown
  server.close(() => process.exit(1));
});
```

**Graceful Shutdown**: Close connections, finish ongoing requests, then exit.

