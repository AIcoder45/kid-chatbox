# Migration Strategy

## Using Tools (Knex, Prisma, Sequelize, Flyway, Liquibase)

**Current Project**: Uses custom migration scripts in `server/scripts/`.

**Recommended Tools**:
- **Knex**: JavaScript migrations, good for Node.js
- **Prisma**: Type-safe, excellent DX
- **Flyway**: Java-based, version-controlled SQL files
- **Liquibase**: XML/YAML/SQL migrations

**Benefits**: Version control, rollback support, team collaboration.

## Forward-Only Migrations

**Principle**: Migrations should only move forward.

**Structure**:
```
migrations/
  001_create_users.sql
  002_create_quizzes.sql
  003_add_user_status.sql
```

**Never**: Edit existing migrations after they've been run in production.

**Fix Mistakes**: Create new migration to correct issues.

## Never Editing Old Migrations

**Why**: Other environments may have already run the migration.

**If Migration Has Error**:
1. Create new migration to fix it
2. Document the issue
3. Test thoroughly

**Example**:
```sql
-- Migration 003_add_column.sql (has typo)
ALTER TABLE users ADD COLUMN emial VARCHAR(255);

-- Migration 004_fix_typo.sql (fix)
ALTER TABLE users RENAME COLUMN emial TO email;
```

**Current Project**: Follows this pattern correctly.

## Rollback Strategy (Controlled)

**Write Down Migrations**:
```sql
-- Up migration
CREATE TABLE users (...);

-- Down migration
DROP TABLE users;
```

**Test Rollbacks**: Always test rollback in development first.

**Production Rollbacks**: Plan carefully, may require data migration.

**Current Project**: Migrations include rollback logic.

## Versioning Rules

**Naming Convention**:
- `001_description.sql`
- `20240101_description.sql` (date-based)
- `migration_timestamp_description.sql`

**Sequential Numbers**: Easier to track order.

**Descriptive Names**: Include what the migration does.

**Current Project**: Uses descriptive function names, consider adding version numbers.

## Migration Best Practices

**Keep Migrations Small**: One logical change per migration.

**Test Thoroughly**: Test on copy of production data.

**Backup First**: Always backup before running migrations in production.

**Run in Transaction**: Use transactions when possible (PostgreSQL supports DDL in transactions).

