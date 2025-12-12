# Authentication & Authorization

## JWT Best Practices

**Token Structure**:
- Include minimal user data (id, role)
- Set appropriate expiration (15min-1hr for access tokens)
- Use strong secret key (store in env)

**Security**:
```javascript
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);
```

**Never Include**: Passwords, sensitive data, large payloads.

## Token Refresh Flow

**Access Token**: Short-lived (15min-1hr), used for API calls.

**Refresh Token**: Long-lived (7-30 days), stored securely (httpOnly cookie).

**Flow**:
1. User logs in → receives access + refresh tokens
2. Access token expires → use refresh token to get new access token
3. Refresh token expires → user must login again

**Implementation**: Separate `/auth/refresh` endpoint.

## Role-Based and Permission-Based Access

**Role-Based** (`server/middleware/rbac.js`):
- Check user role (admin, student, teacher)
- Use `checkRole('admin')` middleware

**Permission-Based**:
- Check specific permissions
- Use `checkPermission('quiz:create')` middleware

**Current Project**: Uses RBAC middleware for role and permission checks.

## Securing Routes

**Apply Authentication Middleware**:
```javascript
const { authenticateToken } = require('../middleware/auth');

// All routes require auth
router.use(authenticateToken);

// Or specific routes
router.get('/profile', authenticateToken, getProfile);
```

**Order Matters**: Apply auth middleware before route handlers.

## Protecting Sensitive Endpoints

**Admin Routes**: Require admin role:
```javascript
router.use(authenticateToken);
router.use(checkRole('admin'));
```

**Sensitive Operations**: Add additional checks (rate limiting, IP whitelist).

**Audit Logging**: Log access to sensitive endpoints.

