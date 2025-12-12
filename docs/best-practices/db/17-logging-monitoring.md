# Logging & Monitoring

## Logging Slow Queries

**Enable Slow Query Logging**:
```sql
-- In postgresql.conf
log_min_duration_statement = 1000  -- Log queries > 1 second
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
```

**Query pg_stat_statements**:
```sql
SELECT 
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

**Monitor**: Set up alerts for queries exceeding threshold.

**Current Project**: Enable slow query logging in production.

## Tracking Connections

**Monitor Active Connections**:
```sql
SELECT 
  datname,
  usename,
  application_name,
  state,
  query_start,
  state_change
FROM pg_stat_activity
WHERE state = 'active';
```

**Connection Limits**:
```sql
-- Check current connections
SELECT count(*) FROM pg_stat_activity;

-- Set max connections
ALTER SYSTEM SET max_connections = 100;
```

**Alert**: Alert if connections approach `max_connections`.

## Monitoring Bloat

**Check Table Bloat**:
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  n_dead_tup,
  n_live_tup
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**High Bloat**: Indicates need for VACUUM.

**Index Bloat**: Check `pg_stat_user_indexes`.

## Vacuum and Autovacuum Tuning

**Autovacuum Configuration**:
```sql
-- In postgresql.conf
autovacuum = on
autovacuum_vacuum_scale_factor = 0.1  -- Vacuum when 10% of table changed
autovacuum_analyze_scale_factor = 0.05
autovacuum_vacuum_cost_delay = 20ms
```

**Manual Vacuum**:
```sql
VACUUM ANALYZE users;  -- Regular vacuum
VACUUM FULL users;     -- Full vacuum (locks table)
```

**Monitor**: Check `pg_stat_progress_vacuum` for vacuum progress.

**Current Project**: Rely on autovacuum, monitor and tune if needed.

## Monitoring Best Practices

**Set Up Monitoring**:
- [ ] Enable slow query logging
- [ ] Monitor connection counts
- [ ] Track table/index bloat
- [ ] Monitor autovacuum activity
- [ ] Set up alerts for critical metrics
- [ ] Regular performance reviews

**Tools**: pgAdmin, Grafana with PostgreSQL exporter, Datadog, New Relic.

