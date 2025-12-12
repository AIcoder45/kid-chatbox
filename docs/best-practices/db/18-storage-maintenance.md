# Storage & Maintenance

## Vacuum Strategies

**Regular Vacuum**:
```sql
VACUUM ANALYZE;  -- Vacuum all tables
VACUUM ANALYZE users;  -- Specific table
```

**Full Vacuum** (locks table):
```sql
VACUUM FULL users;  -- Reclaim space, requires exclusive lock
```

**When to Vacuum**:
- After large DELETE operations
- When table bloat detected
- Regularly (autovacuum handles this)

**Autovacuum**: Usually sufficient, monitor and tune if needed.

## Analyse Schedule

**Update Statistics**:
```sql
ANALYZE;  -- All tables
ANALYZE users;  -- Specific table
```

**Why**: Helps query planner choose optimal execution plans.

**Frequency**: Autovacuum runs ANALYZE automatically, or run after bulk loads.

**Current Project**: Relies on autovacuum, consider manual ANALYZE after migrations.

## Index Maintenance

**Rebuild Indexes**:
```sql
REINDEX INDEX idx_users_email;  -- Single index
REINDEX TABLE users;  -- All indexes on table
REINDEX DATABASE kidchatbox;  -- All indexes
```

**When**: Index bloat detected, after VACUUM FULL.

**Monitor**: Check index usage and bloat regularly.

**Current Project**: Review indexes periodically, rebuild if bloat detected.

## Table Bloat Removal

**Check Bloat**:
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  n_dead_tup,
  n_live_tup,
  round(n_dead_tup * 100.0 / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS dead_pct
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY dead_pct DESC;
```

**Remove Bloat**:
```sql
VACUUM FULL tablename;  -- Requires exclusive lock
```

**Alternative**: Use `pg_repack` for online bloat removal (no lock).

## Disk Usage Monitoring

**Check Database Size**:
```sql
SELECT pg_size_pretty(pg_database_size('kidchatbox'));
```

**Check Table Sizes**:
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Set Up Alerts**: Alert if disk usage > 80%.

**Cleanup**: Archive/delete old data, compress tables.

**Current Project**: Monitor disk usage, plan for growth.

## Maintenance Schedule

**Daily**: Autovacuum runs automatically.

**Weekly**: Review slow queries, check bloat.

**Monthly**: Review index usage, analyze large tables.

**Quarterly**: Full database maintenance, review and optimize.

