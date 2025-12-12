# Testing with PostgreSQL

## Local Test DB Setup

**Separate Test Database**:
```sql
CREATE DATABASE kidchatbox_test;
```

**Environment Variables**:
```bash
# .env.test
DATABASE_NAME=kidchatbox_test
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

**Isolation**: Use separate database for tests, never test on production.

**Current Project**: Set up test database for testing.

## Using Docker for Tests

**Docker Compose**:
```yaml
services:
  postgres-test:
    image: postgres:15
    environment:
      POSTGRES_DB: kidchatbox_test
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
    ports:
      - "5433:5432"
```

**Benefits**: Consistent environment, easy cleanup, isolated.

**Use For**: CI/CD pipelines, local development.

**Current Project**: Consider Docker for test database.

## Seeding Strategy

**Seed Test Data**:
```javascript
async function seedTestData() {
  await pool.query(`
    INSERT INTO users (id, email, name) VALUES
    ('00000000-0000-0000-0000-000000000001', 'test@example.com', 'Test User')
  `);
}
```

**Fixtures**: Create reusable seed functions for common test data.

**Before Each Test**: Seed required data, clean up after.

## Cleaning Between Tests

**Transaction Rollback**:
```javascript
beforeEach(async () => {
  await pool.query('BEGIN');
});

afterEach(async () => {
  await pool.query('ROLLBACK');
});
```

**Truncate Tables**:
```javascript
afterEach(async () => {
  await pool.query('TRUNCATE TABLE users, quizzes CASCADE');
});
```

**Benefits**: Clean state for each test, no test interference.

**Current Project**: Implement test cleanup strategy.

## Testing Best Practices

**Test Structure**:
- Set up test database
- Seed test data
- Run tests
- Clean up

**Isolation**: Each test should be independent, no shared state.

**Performance**: Use transactions for fast cleanup.

**Fixtures**: Create reusable test data fixtures.

**Current Project**: Set up comprehensive test infrastructure.

## Test Database Checklist

**Before Writing Tests**:
- [ ] Create separate test database
- [ ] Set up test environment variables
- [ ] Create seed functions
- [ ] Implement cleanup strategy
- [ ] Document test setup process
- [ ] Add to CI/CD pipeline

**Current Project**: Implement test database setup and procedures.

