# Rate Limiting & Throttling

## Per IP

**Basic IP Rate Limiting**:
```javascript
const rateLimit = require('express-rate-limit');

const ipLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  keyGenerator: (req) => req.ip,
});

app.use('/api/', ipLimiter);
```

**Benefits**: Prevents abuse, DDoS protection.

## Per User

**User-Based Rate Limiting**:
```javascript
const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => req.user?.id || req.ip,
  skip: (req) => !req.user, // Skip if not authenticated
});

router.use('/quizzes', authenticateToken, userLimiter);
```

**Different Limits**: Apply stricter limits to authenticated users for sensitive operations.

## Per Token

**API Key Rate Limiting**:
```javascript
const tokenLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  keyGenerator: (req) => {
    const token = req.headers['authorization']?.split(' ')[1];
    return token || req.ip;
  },
});
```

**Use Cases**: Third-party API access, different tiers (free vs paid).

## Burst Control

**Allow Bursts, Limit Sustained**:
```javascript
const burstLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Allow 20 requests
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter sustained limit
const sustainedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
});
```

**Strategy**: Allow short bursts, limit long-term usage.

## Rate Limit Headers

**Include Rate Limit Info**:
```javascript
res.setHeader('X-RateLimit-Limit', '100');
res.setHeader('X-RateLimit-Remaining', '95');
res.setHeader('X-RateLimit-Reset', resetTime);
```

**Benefits**: Clients can adjust behavior, better UX.

## Stricter Limits for Auth Endpoints

**Login/Register Limits**:
```javascript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 attempts per 15 minutes
  message: 'Too many login attempts, please try again later',
});

router.post('/login', authLimiter, loginHandler);
router.post('/register', authLimiter, registerHandler);
```

**Prevents**: Brute-force attacks, account enumeration.

