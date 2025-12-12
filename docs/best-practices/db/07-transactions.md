# Transactions

## When to Use Transactions

**Use Transactions For**:
- Multiple related operations that must succeed together
- Data consistency requirements
- Financial operations
- Complex updates affecting multiple tables

**Example**:
```javascript
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('INSERT INTO users ...');
  await client.query('INSERT INTO profiles ...');
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

**Current Project**: Uses transactions in migrations correctly.

## Savepoints

**Nested Transactions**:
```sql
BEGIN;
  INSERT INTO users ...;
  SAVEPOINT sp1;
    INSERT INTO profiles ...;
    -- If error, rollback to savepoint
    ROLLBACK TO SAVEPOINT sp1;
  -- Continue with other operations
COMMIT;
```

**Use Cases**: Partial rollback within larger transaction.

## Handling Deadlocks

**Deadlock Detection**: PostgreSQL automatically detects and resolves.

**Retry Logic**:
```javascript
async function executeWithRetry(queryFn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await queryFn();
    } catch (error) {
      if (error.code === '40P01' && i < maxRetries - 1) {
        // Deadlock detected, retry
        await sleep(100 * (i + 1)); // Exponential backoff
        continue;
      }
      throw error;
    }
  }
}
```

**Prevent Deadlocks**: Always acquire locks in same order.

## Isolation Levels

**PostgreSQL Levels**:
- `READ UNCOMMITTED`: Not available (treated as READ COMMITTED)
- `READ COMMITTED`: Default, sees committed data
- `REPEATABLE READ`: Consistent snapshot
- `SERIALIZABLE`: Strictest, prevents anomalies

**Set Level**:
```sql
BEGIN ISOLATION LEVEL SERIALIZABLE;
```

**Default (READ COMMITTED)**: Usually sufficient, best performance.

## Designing for Idempotency

**Idempotent Operations**: Same operation multiple times = same result.

**Techniques**:
- Use `INSERT ... ON CONFLICT DO NOTHING`
- Check existence before insert
- Use unique constraints
- Include idempotency keys

**Example**:
```sql
INSERT INTO users (id, email, name)
VALUES ($1, $2, $3)
ON CONFLICT (id) DO NOTHING;
```

**Benefits**: Safe to retry, prevents duplicates.

