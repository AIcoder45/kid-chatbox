# Migration Safety Checklist

## Adding Columns Without Downtime

**Safe Column Addition**:
```sql
-- Step 1: Add column as nullable
ALTER TABLE users ADD COLUMN new_field VARCHAR(255);

-- Step 2: Backfill data (in application code)
UPDATE users SET new_field = 'default_value' WHERE new_field IS NULL;

-- Step 3: Add NOT NULL constraint (if needed)
ALTER TABLE users ALTER COLUMN new_field SET NOT NULL;
```

**Benefits**: No table lock, no downtime.

**Avoid**: Adding NOT NULL column without default in single step (locks table).

**Current Project**: Follow this pattern for adding columns.

## Migrating Large Tables

**Chunked Migration**:
```sql
-- Migrate in batches
DO $$
DECLARE
  batch_size INTEGER := 10000;
  offset_val INTEGER := 0;
BEGIN
  LOOP
    UPDATE large_table
    SET new_column = compute_value(old_column)
    WHERE id IN (
      SELECT id FROM large_table
      WHERE new_column IS NULL
      LIMIT batch_size
    );
    
    EXIT WHEN NOT FOUND;
    offset_val := offset_val + batch_size;
  END LOOP;
END $$;
```

**Benefits**: Avoids long locks, can be interrupted, less impact.

**Monitor**: Monitor progress, adjust batch size if needed.

## Index Creation Without Locks

**CONCURRENTLY Option**:
```sql
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
```

**Benefits**: Doesn't lock table, allows reads/writes during creation.

**Limitations**: Takes longer, can't use in transaction.

**Use For**: Production indexes on large tables.

**Current Project**: Use CONCURRENTLY for production index creation.

## Rolling Schema Changes Backward-Compatible

**Backward Compatibility**:
- Add columns (nullable) before removing old columns
- Support both old and new formats during transition
- Remove old columns only after all code updated

**Example**:
```sql
-- Step 1: Add new column
ALTER TABLE users ADD COLUMN email_new VARCHAR(255);

-- Step 2: Backfill
UPDATE users SET email_new = email_old;

-- Step 3: Deploy code that uses email_new

-- Step 4: Remove old column (after verification)
ALTER TABLE users DROP COLUMN email_old;
```

**Benefits**: Zero-downtime deployments, safe rollback.

## Migration Safety Checklist

**Before Running Migration**:
- [ ] Backup database
- [ ] Test on staging environment
- [ ] Review migration script
- [ ] Plan rollback strategy
- [ ] Schedule during low-traffic period
- [ ] Notify team
- [ ] Monitor during migration

**During Migration**:
- [ ] Monitor database performance
- [ ] Check for errors
- [ ] Verify data integrity
- [ ] Test critical queries

**After Migration**:
- [ ] Verify application works correctly
- [ ] Monitor for issues
- [ ] Document any problems
- [ ] Update documentation

**Current Project**: Follow this checklist for all migrations.

