# Error Handling (UI Layer)

## Global Error Boundary

**Implementation**:
```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    // Log to error reporting service
    console.error('Error caught:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

**Place**: Wrap root app or major route sections.

## Page-Level vs Component-Level Errors

**Page-Level**:
- Critical errors that break entire page
- Use Error Boundary
- Show full error page with recovery options

**Component-Level**:
- Non-critical errors (failed API call)
- Show inline error message
- Allow user to continue using app

## Graceful Fallback UI

**Error States**:
```typescript
{error ? (
  <Alert status="error">
    <AlertIcon />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{error.message}</AlertDescription>
  </Alert>
) : (
  <Content />
)}
```

**Empty States**: Show helpful message when no data.

## Retry Logic Patterns

**Automatic Retry**:
- Network errors: Retry with exponential backoff
- Max 3 attempts
- Show loading state during retry

**Manual Retry**:
- Provide "Retry" button
- Clear error state on retry
- Show loading indicator

**User-Friendly Messages**:
- Avoid technical jargon
- Provide actionable guidance
- Include support contact if needed

