# Indexing

## When to Index

**Index These Columns**:
- Foreign keys (for JOINs)
- Columns in WHERE clauses
- Columns in ORDER BY
- Columns in GROUP BY
- Unique columns (enforced with UNIQUE index)

**Don't Index**:
- Columns rarely queried
- Tables with frequent INSERT/UPDATE/DELETE (indexes slow writes)
- Very small tables (< 1000 rows)

**Current Project**: Indexes foreign keys and frequently queried columns.

## Composite Indexes

**Order Matters**: Most selective column first.

**Example**:
```sql
CREATE INDEX idx_quizzes_user_status 
ON quizzes(user_id, status);
```

**Useful For**: Queries filtering on multiple columns.

**Left-Prefix Rule**: Index `(a, b, c)` helps queries on `(a)`, `(a, b)`, `(a, b, c)`.

## Partial Indexes

**Index Subset of Rows**:
```sql
CREATE INDEX idx_active_users 
ON users(email) 
WHERE is_active = true;
```

**Benefits**: Smaller index, faster queries, less maintenance.

**Use Cases**: Index only active records, recent data, specific statuses.

## Unique Indexes

**Enforce Uniqueness**:
```sql
CREATE UNIQUE INDEX uq_users_email ON users(email);
```

**Composite Unique**:
```sql
CREATE UNIQUE INDEX uq_quiz_library_usage 
ON quiz_library_usage(quiz_library_id, user_id, used_at);
```

**Current Project**: Uses unique indexes appropriately.

## Avoiding Over-Indexing

**Problem**: Too many indexes slow INSERT/UPDATE/DELETE.

**Rule of Thumb**: 
- 3-5 indexes per table (unless read-heavy)
- Monitor index usage: `pg_stat_user_indexes`

**Remove Unused Indexes**: Check `idx_scan` in `pg_stat_user_indexes`.

## Index Health Checks

**Monitor Index Usage**:
```sql
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan;
```

**Check Index Bloat**:
```sql
SELECT * FROM pg_stat_progress_create_index;
```

**Rebuild Indexes**: `REINDEX INDEX index_name;` if bloat detected.

**Current Project**: Review index usage periodically.

