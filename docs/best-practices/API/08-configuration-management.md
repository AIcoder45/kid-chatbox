# Configuration Management

## Environment-Specific Configs

**Separate Config Files**:
```javascript
// config/development.js
module.exports = {
  database: {
    host: 'localhost',
    port: 5432,
  },
  jwt: {
    secret: 'dev-secret',
    expiresIn: '24h',
  },
};

// config/production.js
module.exports = {
  database: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h',
  },
};
```

**Load Based on NODE_ENV**: Use environment variable to select config.

## 12-Factor Config Rules

**Store Config in Environment**:
- Use `.env` files (never commit)
- Use environment variables in production
- Different configs for different environments

**Current Project**: Uses `dotenv` for environment variables.

## Avoiding Secrets in Code

**Never Commit**:
- API keys
- Database passwords
- JWT secrets
- Third-party service credentials

**Use `.env` Files**:
```bash
# .env (not committed)
JWT_SECRET=your-secret-key
DATABASE_PASSWORD=your-password
```

**Add to `.gitignore`**: Ensure `.env` files are ignored.

**Template File**: Commit `.env.example` with placeholder values.

## Safe Handling of Environment Variables

**Validate Required Variables**:
```javascript
const requiredEnvVars = ['JWT_SECRET', 'DATABASE_HOST'];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
```

**Default Values**: Provide sensible defaults for non-critical variables.

**Type Conversion**: Convert string env vars to appropriate types (numbers, booleans).

**Documentation**: Document all environment variables in README.

