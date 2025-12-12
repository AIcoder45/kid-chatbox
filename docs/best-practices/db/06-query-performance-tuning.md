# Query Performance Tuning

## Understanding EXPLAIN ANALYZE

**Basic Usage**:
```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

**Key Metrics**:
- **Execution Time**: Total query time
- **Planning Time**: Query planning time
- **Seq Scan**: Sequential scan (slow, indicates missing index)
- **Index Scan**: Index used (good)
- **Rows**: Actual rows processed

**Look For**: Seq scans on large tables (add index), high execution times.

## Detecting Slow Queries

**Enable Logging**:
```sql
-- In postgresql.conf
log_min_duration_statement = 1000  -- Log queries > 1 second
```

**Query pg_stat_statements**:
```sql
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

**Monitor**: Set up alerts for queries > threshold (e.g., 500ms).

## Query Rewrite Strategies

**Use EXISTS Instead of COUNT**:
```sql
-- ❌ Slow
SELECT * FROM users WHERE (SELECT COUNT(*) FROM quizzes WHERE user_id = users.id) > 0;

-- ✅ Fast
SELECT * FROM users WHERE EXISTS (SELECT 1 FROM quizzes WHERE user_id = users.id);
```

**Avoid Functions in WHERE**:
```sql
-- ❌ Can't use index
WHERE UPPER(email) = 'TEST@EXAMPLE.COM';

-- ✅ Can use index
WHERE email = 'test@example.com';
```

**Use UNION ALL Instead of UNION** (if no duplicates).

## How to Identify Missing Indexes

**Check Sequential Scans**:
```sql
SELECT schemaname, tablename, seq_scan, seq_tup_read, idx_scan
FROM pg_stat_user_tables
WHERE seq_scan > 1000
ORDER BY seq_tup_read DESC;
```

**High seq_scan/low idx_scan**: Indicates missing index.

**Add Index**: Create index on columns used in WHERE/JOIN.

**Current Project**: Review `EXPLAIN ANALYZE` output for slow queries.

## Query Optimization Checklist

**Before Optimizing**:
1. Run `EXPLAIN ANALYZE`
2. Identify bottlenecks (seq scans, high execution time)
3. Add missing indexes
4. Rewrite inefficient queries
5. Verify improvement with `EXPLAIN ANALYZE` again

**Monitor**: Track query performance over time.

