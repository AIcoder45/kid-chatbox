# Data Lifecycle Management

## Archival Strategy

**Archive Old Data**:
```sql
-- Create archive table
CREATE TABLE quiz_history_archive (LIKE quiz_history INCLUDING ALL);

-- Move old data
INSERT INTO quiz_history_archive
SELECT * FROM quiz_history
WHERE created_at < NOW() - INTERVAL '1 year';

-- Delete archived data
DELETE FROM quiz_history
WHERE created_at < NOW() - INTERVAL '1 year';
```

**Storage**: Move to cheaper storage (S3 Glacier, separate database).

**Benefits**: Smaller active tables, faster queries, lower costs.

**Current Project**: Plan archival strategy for quiz_history, analytics data.

## Purging Old Data

**Retention Policy**:
- User data: Keep per legal requirements
- Logs: 30-90 days
- Analytics: 1-2 years
- Audit trails: Per compliance requirements

**Automated Purging**:
```sql
-- Delete old records
DELETE FROM audit_logs
WHERE created_at < NOW() - INTERVAL '90 days';
```

**Schedule**: Use cron job or scheduled task.

**Backup First**: Always backup before purging.

## Time-Series Data Best Practices

**Partition by Time**:
```sql
CREATE TABLE metrics (
  id UUID,
  metric_name VARCHAR(255),
  value NUMERIC,
  recorded_at TIMESTAMP
) PARTITION BY RANGE (recorded_at);
```

**Retention**:
- Hot data (recent): Keep in main table
- Warm data (older): Move to archive partition
- Cold data (very old): Archive to external storage

**Benefits**: Faster queries on recent data, easier archival.

**Current Project**: Consider partitioning analytics/metrics tables by date.

## Data Archival Checklist

**Before Archiving**:
- [ ] Define retention policy
- [ ] Test archival process
- [ ] Verify data integrity after archival
- [ ] Set up automated archival
- [ ] Document archival process
- [ ] Plan restore procedure if needed

**Compliance**: Ensure archival meets legal/compliance requirements.

## Archival Best Practices

**Document**: Document what data is archived, where, and retention period.

**Test Restores**: Periodically test restoring archived data.

**Monitor**: Monitor archival process, alert on failures.

**Review**: Regularly review retention policies, adjust as needed.

**Current Project**: Implement archival strategy before data grows too large.

