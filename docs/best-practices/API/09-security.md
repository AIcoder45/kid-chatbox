# Security

## Securing Express/Fastify Config

**Helmet.js** (Security Headers):
```javascript
const helmet = require('helmet');
app.use(helmet());
```

**Sets Headers**:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Strict-Transport-Security

**Current Project**: Consider adding Helmet for production.

## Rate Limiting

**express-rate-limit**:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

**Stricter Limits**: Apply stricter limits to auth endpoints (login, register).

**Benefits**: Prevents brute-force attacks, DDoS protection.

## Helmet Usage

**Configure Helmet**:
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));
```

**Production**: Always use Helmet in production.

## CORS Strategy

**Current Implementation**: CORS configured in `server/index.js`.

**Best Practices**:
- Whitelist specific origins (not `*` in production)
- Use environment variables for allowed origins
- Don't allow credentials with wildcard origin

**Production**: Only allow your frontend domain(s).

## Preventing SQL Injection

**Use Parameterized Queries** (Current Project Uses):
```javascript
// ✅ Safe
pool.query('SELECT * FROM users WHERE id = $1', [userId]);

// ❌ Vulnerable
pool.query(`SELECT * FROM users WHERE id = ${userId}`);
```

**Never**: Concatenate user input into SQL queries.

**ORM Benefits**: ORMs (Prisma, Sequelize) handle parameterization automatically.

## Preventing Brute-Force Attacks

**Rate Limiting**: Limit login attempts per IP.

**Account Lockout**: Temporarily lock accounts after failed attempts.

**CAPTCHA**: Add CAPTCHA after multiple failed attempts.

**Monitoring**: Log and alert on suspicious patterns.

