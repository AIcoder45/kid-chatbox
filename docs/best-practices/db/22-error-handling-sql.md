# Error Handling in SQL

## Catching Constraint Violations

**Handle Unique Violations**:
```javascript
try {
  await pool.query('INSERT INTO users (email) VALUES ($1)', [email]);
} catch (error) {
  if (error.code === '23505') { // Unique violation
    // Handle duplicate email
    return { error: 'Email already exists' };
  }
  throw error;
}
```

**PostgreSQL Error Codes**:
- `23505`: Unique violation
- `23503`: Foreign key violation
- `23502`: NOT NULL violation
- `23514`: Check constraint violation

**Current Project**: Handle constraint violations in application code.

## Retry Logic in Code

**Exponential Backoff**:
```javascript
async function executeWithRetry(queryFn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await queryFn();
    } catch (error) {
      if (error.code === '40P01' && i < maxRetries - 1) { // Deadlock
        await sleep(100 * Math.pow(2, i)); // Exponential backoff
        continue;
      }
      if (error.code === '57P01' && i < maxRetries - 1) { // Admin shutdown
        await sleep(1000);
        continue;
      }
      throw error;
    }
  }
}
```

**Retry For**: Transient errors (deadlocks, connection issues).

**Don't Retry For**: Constraint violations, syntax errors.

## Avoiding Silent Failures

**Always Check Results**:
```javascript
const result = await pool.query('UPDATE users SET status = $1 WHERE id = $2', [status, userId]);
if (result.rowCount === 0) {
  throw new Error('User not found');
}
```

**Verify Expectations**:
- Check `rowCount` for UPDATE/DELETE
- Verify returned data matches expectations
- Log unexpected results

**Current Project**: Check query results, handle errors appropriately.

## Error Handling Patterns

**Use Try-Catch**:
```javascript
try {
  const result = await pool.query('...');
  return result.rows;
} catch (error) {
  logger.error('Database error:', error);
  throw new Error('Database operation failed');
}
```

**Log Errors**: Always log errors with context (query, parameters, user).

**User-Friendly Messages**: Don't expose database errors to users, return generic messages.

**Current Project**: Implement comprehensive error handling.

## Error Handling Checklist

**Before Production**:
- [ ] Handle all constraint violations
- [ ] Implement retry logic for transient errors
- [ ] Check query results
- [ ] Log errors with context
- [ ] Return user-friendly error messages
- [ ] Test error scenarios

**Current Project**: Review error handling, ensure all cases covered.

