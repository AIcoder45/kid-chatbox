# Bulk Operations

## COPY vs INSERT

**COPY Command** (Fastest):
```sql
COPY users (email, name, age) FROM '/path/to/file.csv' WITH CSV HEADER;
```

**Benefits**: Very fast, minimal overhead, best for large imports.

**Limitations**: Requires file access, less flexible than INSERT.

**Use For**: Large data imports, ETL processes.

**Current Project**: Use COPY for bulk imports if needed.

## Batch Inserts

**Multiple VALUES**:
```sql
INSERT INTO users (email, name) VALUES
  ('user1@example.com', 'User 1'),
  ('user2@example.com', 'User 2'),
  ('user3@example.com', 'User 3');
```

**Batch Size**: 100-1000 rows per batch (test for optimal size).

**Application Code**:
```javascript
const batchSize = 500;
for (let i = 0; i < users.length; i += batchSize) {
  const batch = users.slice(i, i + batchSize);
  await pool.query(
    `INSERT INTO users (email, name) VALUES ${batch.map((_, idx) => `($${idx * 2 + 1}, $${idx * 2 + 2})`).join(', ')}`,
    batch.flatMap(u => [u.email, u.name])
  );
}
```

**Benefits**: Faster than individual INSERTs, less overhead.

## Large Delete/Update Patterns

**Delete in Batches**:
```sql
-- Delete in chunks
DELETE FROM old_logs
WHERE id IN (
  SELECT id FROM old_logs
  WHERE created_at < NOW() - INTERVAL '1 year'
  LIMIT 10000
);
```

**Repeat**: Run until no rows deleted.

**Update in Batches**:
```sql
UPDATE users
SET status = 'inactive'
WHERE id IN (
  SELECT id FROM users
  WHERE last_login < NOW() - INTERVAL '1 year'
  LIMIT 1000
);
```

**Benefits**: Avoids long locks, can be interrupted, less impact on performance.

## Bulk Operation Best Practices

**Use Transactions**: Wrap bulk operations in transactions.

**Monitor Progress**: Log progress for long-running operations.

**Limit Batch Size**: Don't process too many rows at once.

**Test First**: Test on small dataset first.

**Schedule Off-Peak**: Run bulk operations during low-traffic periods.

**Current Project**: Use batch operations for large data migrations/imports.

## Performance Tips

**Disable Indexes Temporarily** (for very large imports):
```sql
DROP INDEX idx_users_email;
-- Import data
CREATE INDEX idx_users_email ON users(email);
```

**Use UNLOGGED Tables** (for temporary data):
```sql
CREATE UNLOGGED TABLE temp_import (...);
-- Import data
INSERT INTO main_table SELECT * FROM temp_import;
DROP TABLE temp_import;
```

**Benefits**: Faster imports, but data lost on crash (acceptable for temporary data).

