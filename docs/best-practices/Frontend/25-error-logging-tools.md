# Error Logging Tools (Sentry)

## Setup Sentry

**Installation**:
```bash
npm install @sentry/react
```

**Initialization**:
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

## Error Boundaries

**Wrap App**:
```typescript
<Sentry.ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</Sentry.ErrorBoundary>
```

**Automatic Capture**: Captures unhandled errors and promise rejections.

## Manual Error Reporting

**Capture Exceptions**:
```typescript
try {
  // Risky code
} catch (error) {
  Sentry.captureException(error);
  // Handle error
}
```

**Capture Messages**:
```typescript
Sentry.captureMessage('Something went wrong', 'warning');
```

## User Context

**Set User Info**:
```typescript
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
});
```

**Benefits**: Better error tracking, user-specific debugging.

## Performance Monitoring

**Transaction Tracking**:
```typescript
const transaction = Sentry.startTransaction({
  name: 'Quiz Generation',
  op: 'quiz.generate',
});

// ... code ...

transaction.finish();
```

**Automatic**: Browser tracing integration tracks page loads and navigation.

## Filtering Errors

**Ignore Certain Errors**:
```typescript
Sentry.init({
  ignoreErrors: ['ResizeObserver loop limit exceeded'],
});
```

**Before Send**: Filter or modify errors before sending to Sentry.

