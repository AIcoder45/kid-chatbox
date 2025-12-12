# Database Version Control

## Migration Folder Structure

**Recommended Structure**:
```
server/
  migrations/
    up/
      001_create_users.sql
      002_create_quizzes.sql
    down/
      001_drop_users.sql
      002_drop_quizzes.sql
  scripts/
    migrate-schema.js
    migrate-plans-schema.js
```

**Current Project**: Uses `server/scripts/` with migration functions.

**Alternative**: Separate `migrations/` folder with SQL files.

## Migration Naming

**Conventions**:
- Sequential: `001_`, `002_`, `003_`
- Timestamp: `20240101120000_`
- Descriptive: Include action and table name

**Examples**:
- `001_create_users_table.sql`
- `002_add_email_index_to_users.sql`
- `003_migrate_user_status_enum.sql`

**Current Project**: Uses descriptive function names.

## Keeping Schema and Code in Sync

**Documentation**: Keep schema docs updated with code changes.

**Type Definitions**: Generate TypeScript types from schema (Prisma, TypeORM).

**Schema Validation**: Validate schema matches expectations in tests.

**Migration Tests**: Test migrations don't break existing code.

**Current Project**: Consider adding schema validation.

## Version Tracking

**Migration Table**: Track which migrations have run.

**Example**:
```sql
CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Tools**: Migration tools handle this automatically.

**Current Project**: Consider adding migration tracking table.

## Schema Diff Tools

**Generate Migrations**: Use tools to compare schema and generate migrations.

**Tools**:
- Prisma: `prisma migrate dev`
- TypeORM: `typeorm migration:generate`
- Manual: Compare schema files

**Benefits**: Reduces human error, ensures consistency.

## Best Practices

**Commit Migrations**: Always commit migration files to version control.

**Review Migrations**: Review migrations in PRs like code changes.

**Test Migrations**: Test on staging before production.

**Document Breaking Changes**: Document schema changes that affect API.

