# Database Access (PostgreSQL)

## Using knex / Prisma / Sequelize / pg

**Current Project**: Uses `pg` (node-postgres) with connection pooling.

**Options**:
- **pg**: Low-level, full control (current)
- **knex**: Query builder, migrations
- **Prisma**: Type-safe ORM, migrations
- **Sequelize**: Full ORM

**Recommendation**: Consider Prisma for type safety and better DX.

## Connection Pooling

**Current Implementation** (`server/config/database.js`):
```javascript
const pool = new Pool({
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

**Best Practices**:
- Set appropriate `max` connections (default: 20)
- Monitor pool usage
- Handle pool errors gracefully

**Benefits**: Reuse connections, better performance.

## Avoiding N+1 Queries

**Problem**: Making multiple queries in a loop.

**Example**:
```javascript
// ❌ Bad: N+1 queries
const quizzes = await pool.query('SELECT * FROM quizzes');
for (const quiz of quizzes.rows) {
  const questions = await pool.query(
    'SELECT * FROM questions WHERE quiz_id = $1',
    [quiz.id]
  );
}

// ✅ Good: Single query with JOIN
const result = await pool.query(`
  SELECT q.*, json_agg(qu.*) as questions
  FROM quizzes q
  LEFT JOIN questions qu ON qu.quiz_id = q.id
  GROUP BY q.id
`);
```

**Solution**: Use JOINs, batch queries, or data loaders.

## Transactions and Error Handling

**Transactions**:
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

**Always**: Use transactions for multi-step operations that must succeed together.

## Query Abstraction Layer

**Create Service Layer**:
```javascript
// services/userService.js
async function getUserById(id) {
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
}
```

**Benefits**: Reusability, easier testing, centralized query logic.

**Current Pattern**: Routes contain queries directly. Consider extracting to services.

