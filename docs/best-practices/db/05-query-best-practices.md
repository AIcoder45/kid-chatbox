# Query Best Practices

## Using Parameterised Queries

**Always Use Parameters**:
```javascript
// ✅ Safe
await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

// ❌ Vulnerable to SQL injection
await pool.query(`SELECT * FROM users WHERE id = ${userId}`);
```

**Benefits**: Prevents SQL injection, allows query plan caching.

**Current Project**: Uses parameterized queries correctly.

## Avoiding SELECT *

**Problem**: `SELECT *` fetches unnecessary columns, wastes bandwidth.

**Better**:
```sql
-- ✅ Good
SELECT id, name, email FROM users;

-- ❌ Bad
SELECT * FROM users;
```

**Exception**: Small tables, development queries.

**Current Project**: Review queries, use specific columns.

## Writing Efficient JOINs

**Use Appropriate JOIN Type**:
- `INNER JOIN`: Both tables must match
- `LEFT JOIN`: Include all left table rows
- `RIGHT JOIN`: Include all right table rows (rare)
- `FULL OUTER JOIN`: Include all rows from both (rare)

**Join Order**: PostgreSQL optimizer handles this, but smaller tables first can help.

**Index Foreign Keys**: Always index JOIN columns.

**Example**:
```sql
SELECT u.*, q.title
FROM users u
INNER JOIN quizzes q ON q.user_id = u.id
WHERE u.is_active = true;
```

## Using LIMIT to Control Result Size

**Always Limit Large Queries**:
```sql
SELECT * FROM quizzes ORDER BY created_at DESC LIMIT 20;
```

**With Pagination**:
```sql
SELECT * FROM quizzes 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 40;
```

**Prevent Accidental Large Results**: Set default LIMIT in application code.

**Current Project**: Uses LIMIT in pagination queries.

## Avoiding Unnecessary Subqueries

**Prefer JOINs Over Subqueries**:
```sql
-- ❌ Subquery (often slower)
SELECT * FROM users 
WHERE id IN (SELECT user_id FROM quizzes);

-- ✅ JOIN (usually faster)
SELECT DISTINCT u.* FROM users u
INNER JOIN quizzes q ON q.user_id = u.id;
```

**Use Subqueries When**: Result is independent or simpler logic.

**EXISTS vs IN**: Use `EXISTS` for better performance with large datasets.

