# Backups & Restore

## Logical vs Physical Backups

**Logical Backups** (`pg_dump`):
- SQL format, portable
- Can restore to different PostgreSQL version
- Slower for large databases
- Can backup specific tables/schemas

**Physical Backups** (`pg_basebackup`):
- File system level, faster
- Requires same PostgreSQL version
- Full database only
- Better for large databases

**Use Cases**: Logical for small/medium DBs, physical for large DBs.

## Automated Backup Schedule

**Frequency**:
- Production: Daily full backup + hourly WAL archiving
- Development: Weekly backup
- Staging: Daily backup

**Script Example**:
```bash
#!/bin/bash
BACKUP_DIR="/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U postgres kidchatbox > "$BACKUP_DIR/kidchatbox_$DATE.sql"
# Keep last 7 days
find "$BACKUP_DIR" -name "kidchatbox_*.sql" -mtime +7 -delete
```

**Schedule**: Use cron or systemd timers.

## PITR (Point-in-Time Recovery)

**Enable WAL Archiving**:
```sql
-- In postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'cp %p /backups/wal/%f'
```

**Benefits**: Restore to any point in time, minimal data loss.

**Requirements**: Continuous WAL archiving, regular base backups.

**Use Cases**: Critical production databases, compliance requirements.

## Backup Testing

**Test Restores Regularly**:
- Restore to test environment monthly
- Verify data integrity
- Test recovery procedures
- Document recovery time

**Automated Testing**: Script restore process, verify critical tables.

**Current Project**: Set up automated backups and test restores.

## Retention Policies

**Retention Rules**:
- Daily backups: Keep 7-30 days
- Weekly backups: Keep 4-12 weeks
- Monthly backups: Keep 6-12 months

**Compliance**: Some industries require longer retention (years).

**Storage**: Move old backups to cheaper storage (S3 Glacier, tape).

**Document**: Document retention policy and procedures.

## Backup Best Practices

**Before Production**:
- [ ] Set up automated backups
- [ ] Test restore procedure
- [ ] Document backup/restore process
- [ ] Set up monitoring/alerting
- [ ] Configure retention policy
- [ ] Enable WAL archiving (for PITR)
- [ ] Store backups off-site

**Current Project**: Implement backup strategy before production deployment.

