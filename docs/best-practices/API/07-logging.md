# Logging

## Request Logs

**Request Logging Middleware**:
```javascript
const morgan = require('morgan');

// Development: detailed logs
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Production: concise logs
app.use(morgan('combined'));
```

**Log Information**:
- Method, URL, status code
- Response time
- IP address
- User agent (optional)

## Error Logs

**Log All Errors**:
```javascript
console.error('Error:', {
  message: err.message,
  stack: err.stack,
  url: req.url,
  method: req.method,
  userId: req.user?.id,
});
```

**Use Logging Library**: Consider `winston` or `pino` for production.

**Log Levels**: `error`, `warn`, `info`, `debug`.

## Correlation IDs

**Generate Correlation ID**:
```javascript
const { v4: uuidv4 } = require('uuid');

app.use((req, res, next) => {
  req.correlationId = uuidv4();
  res.setHeader('X-Correlation-ID', req.correlationId);
  next();
});
```

**Include in Logs**: Add correlation ID to all log entries for tracing.

**Benefits**: Track requests across services, debug issues easier.

## Log Rotation

**Use Log Rotation Tools**:
- `winston-daily-rotate-file`
- `rotating-file-stream`
- System log rotation (logrotate)

**Prevent Disk Full**: Rotate logs daily/weekly, keep only recent logs.

## Logging Format (JSON Preferred)

**Structured Logging**:
```javascript
logger.info({
  correlationId: req.correlationId,
  userId: req.user?.id,
  action: 'quiz.created',
  quizId: quiz.id,
  timestamp: new Date().toISOString(),
});
```

**Benefits**: Easy parsing, searching, analysis with log aggregation tools.

**Production**: Always use JSON format for structured logging.

