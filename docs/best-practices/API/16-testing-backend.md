# Testing (Backend)

## Unit Tests for Services

**Test Business Logic**:
```javascript
const { describe, it, expect } = require('jest');

describe('UserService', () => {
  it('should create user with hashed password', async () => {
    const user = await userService.createUser({
      email: 'test@example.com',
      password: 'password123',
    });
    
    expect(user.email).toBe('test@example.com');
    expect(user.password).not.toBe('password123');
  });
});
```

**Mock Dependencies**: Mock database, external APIs.

**Focus**: Test business logic, not implementation details.

## Integration Tests for Routes

**Test API Endpoints**:
```javascript
const request = require('supertest');
const app = require('../index');

describe('POST /api/auth/register', () => {
  it('should register new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

**Test**: Request/response, status codes, response structure.

## Database Test Strategy

**Test Database**:
- Use separate test database
- Reset database before each test
- Use transactions that rollback

**Setup**:
```javascript
beforeEach(async () => {
  await pool.query('BEGIN');
});

afterEach(async () => {
  await pool.query('ROLLBACK');
});
```

**Fixtures**: Use seed data for consistent tests.

## Mocking External Dependencies

**Mock External APIs**:
```javascript
jest.mock('../utils/openai', () => ({
  generateQuizQuestions: jest.fn().mockResolvedValue([
    { question: 'Test question', answers: [] },
  ]),
}));
```

**Mock Database**: Use in-memory database or mocks for unit tests.

**Benefits**: Faster tests, no external dependencies, predictable results.

## Test Coverage

**Target**: ≥80% coverage for critical paths.

**Focus Areas**:
- Business logic
- Error handling
- Authentication/authorization
- Data validation

**Tools**: Jest coverage, Istanbul.

**CI/CD**: Run tests before merge, fail if coverage drops.

