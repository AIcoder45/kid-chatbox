# Maintainability Standards

## DRY and Small Functions

**Don't Repeat Yourself**:
- Extract repeated code to functions
- Create utility modules
- Use shared middleware

**Small Functions**:
- Single responsibility
- Easy to test
- Easy to understand
- Max 50-100 lines per function

**Example**:
```javascript
// ❌ Bad: Long function doing multiple things
async function processUser(userData) {
  // validation
  // hashing
  // database insert
  // email sending
  // logging
}

// ✅ Good: Small, focused functions
async function processUser(userData) {
  validateUserData(userData);
  const hashedPassword = await hashPassword(userData.password);
  const user = await createUser({ ...userData, password: hashedPassword });
  await sendWelcomeEmail(user.email);
  logUserCreation(user.id);
}
```

## Commenting Guidelines

**Document Why, Not What**:
```javascript
// ❌ Bad: Obvious comment
// Increment counter
counter++;

// ✅ Good: Explains why
// Increment counter to track retry attempts for rate limiting
counter++;
```

**JSDoc for Functions**:
```javascript
/**
 * Creates a new quiz with questions
 * @param {Object} quizData - Quiz configuration
 * @param {number} userId - User creating the quiz
 * @returns {Promise<Object>} Created quiz with questions
 * @throws {Error} If validation fails or database error
 */
async function createQuiz(quizData, userId) {
  // ...
}
```

**Complex Logic**: Comment complex algorithms or business rules.

## Dependency Cleanup

**Regular Audits**:
- Remove unused dependencies
- Update outdated packages
- Check for security vulnerabilities

**Tools**:
```bash
npm audit
npm outdated
depcheck  # Find unused dependencies
```

**Keep Updated**: Regular dependency updates (monthly/quarterly).

## Regular Linting

**ESLint Configuration**:
```json
{
  "extends": ["eslint:recommended"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

**Pre-commit Hooks**: Run linter before commit.

**CI/CD**: Fail build on linting errors.

**Current Project**: Has ESLint. Ensure it's configured and enforced.

## Code Review Standards

**Review For**:
- Code quality
- Security issues
- Performance
- Maintainability
- Documentation

**Standards**: Consistent style, clear naming, proper error handling.

