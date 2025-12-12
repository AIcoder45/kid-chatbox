# Tracking and Analytics Best Practices

## Privacy-First Approach

**User Consent**: Always get user consent before tracking.

**GDPR Compliance**: Respect user privacy preferences.

**Opt-Out**: Provide option to disable tracking.

## Event Tracking

**Structured Events**:
```typescript
trackEvent({
  category: 'Quiz',
  action: 'Start',
  label: 'Math Quiz',
  value: quizId,
});
```

**Consistent Naming**: Use consistent event names across app.

## Page View Tracking

**Route Changes**:
```typescript
useEffect(() => {
  trackPageView(window.location.pathname);
}, [location]);
```

**React Router**: Track on route changes.

## User Properties

**Set User Properties**:
```typescript
setUserProperties({
  userId: user.id,
  role: user.role,
  plan: user.plan,
});
```

**Don't Track**: Sensitive data (passwords, PII unless necessary).

## Performance Tracking

**Custom Metrics**:
- Time to interactive
- API response times
- Component render times

**Use**: Performance API, custom timing events.

## Error Tracking Integration

**Track Errors**: Integrate with error logging (Sentry).

**User Actions**: Track user actions that lead to errors.

**Context**: Include user context, route, and action in error events.

