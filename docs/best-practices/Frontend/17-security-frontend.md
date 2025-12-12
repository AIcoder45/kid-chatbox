# Security in Frontend

## Avoid Exposing Secrets

**Never commit**:
- API keys
- Secret tokens
- Passwords
- Private keys

**Use Environment Variables**:
```typescript
const apiKey = import.meta.env.VITE_API_KEY;
```

**Prefix**: Only `VITE_*` variables are exposed to client.

**Note**: Client-side code is public. Don't store sensitive secrets.

## Input Sanitisation

**Use Existing Framework**: Project has sanitization in `@/shared/services`.

**Don't create new utilities**: Use the existing sanitization framework.

**Sanitize**:
- User inputs before display
- Form submissions
- URL parameters
- Search queries

**Libraries**: DOMPurify for HTML sanitization.

## XSS Protection

**Prevent XSS**:
- Sanitize user input
- Use React's built-in escaping (automatic)
- Avoid `dangerouslySetInnerHTML` unless necessary
- Validate and sanitize if using `dangerouslySetInnerHTML`

**Content Security Policy**: Set CSP headers (backend).

## Secure Local Storage Usage

**What NOT to Store**:
- Passwords
- Credit card numbers
- Sensitive tokens (if possible)

**What's OK**:
- Theme preferences
- UI settings
- Non-sensitive user preferences

**If storing tokens**:
- Use httpOnly cookies when possible (backend)
- Encrypt sensitive data
- Set expiration
- Clear on logout

## API Security

**HTTPS Only**: Always use HTTPS in production.

**Token Storage**: Prefer httpOnly cookies over localStorage.

**CORS**: Configure properly on backend.

**Rate Limiting**: Handle rate limit errors gracefully.

