# Table & Column Naming

## Snake Case Rules

**Always Use Snake_Case**:
- Tables: `quiz_library`, `scheduled_tests`
- Columns: `user_id`, `created_at`, `is_active`
- Functions: `get_user_by_id`

**Avoid**: camelCase, PascalCase, kebab-case in database.

**Reason**: PostgreSQL is case-insensitive but converts to lowercase, snake_case is standard.

## Singular vs Plural Tables

**Use Plural** (Recommended):
- `users`, `quizzes`, `questions`, `topics`

**Consistency**: Pick one convention and stick with it.

**Current Project**: Uses plural (`users`, `quizzes`, `quiz_library`).

## Timestamp Column Standards

**Standard Columns**:
- `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
- `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

**Update Trigger** (if needed):
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';
```

**Time Zones**: Use `TIMESTAMPTZ` for timezone-aware timestamps.

**Current Project**: Uses `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`.

## Consistent Foreign Key Names

**Naming Pattern**: `{referenced_table}_id`

**Examples**:
- `user_id` references `users(id)`
- `quiz_id` references `quizzes(id)`
- `created_by` references `users(id)` (for creator)

**Be Consistent**: Always use same pattern across all tables.

**Current Project**: Follows this pattern (`user_id`, `quiz_id`, `created_by`).

## Naming Best Practices

**Be Descriptive**: `is_email_verified` not `verified`

**Avoid Abbreviations**: `user_id` not `uid` (unless universally understood)

**Boolean Prefixes**: Use `is_`, `has_`, `can_` for booleans (`is_active`, `has_permission`)

**Avoid Reserved Words**: Don't use SQL keywords (`order`, `user`, `group` - use `orders`, `users`, `groups`)

