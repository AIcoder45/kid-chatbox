# Schema Design

## Naming Conventions

**Tables**: Use plural nouns (`users`, `quizzes`, `questions`)

**Columns**: Use snake_case (`user_id`, `created_at`, `is_active`)

**Indexes**: `idx_tablename_columnname` or `idx_tablename_purpose`

**Constraints**: `pk_tablename`, `fk_tablename_column`, `uq_tablename_column`

**Current Project**: Follows these conventions.

## Keys and Constraints

**Primary Keys**:
- Use UUID for distributed systems or SERIAL/BIGSERIAL for single-server
- Always define explicitly: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`

**Foreign Keys**:
- Always define with `REFERENCES` clause
- Use `ON DELETE CASCADE` or `ON DELETE SET NULL` appropriately
- Example: `user_id UUID REFERENCES users(id) ON DELETE CASCADE`

**Unique Constraints**: Use for business rules (email, username).

## Normalisation Rules

**First Normal Form (1NF)**: Each column contains atomic values, no repeating groups.

**Second Normal Form (2NF)**: 1NF + all non-key columns depend on entire primary key.

**Third Normal Form (3NF)**: 2NF + no transitive dependencies.

**Goal**: Eliminate data redundancy, prevent update anomalies.

## When to Denormalise

**Denormalise For**:
- Read-heavy workloads (add computed columns)
- Performance-critical queries (duplicate frequently accessed data)
- Reporting/analytics (materialized views)

**Trade-off**: Faster reads vs. more complex updates and storage.

**Example**: Store `user_name` in `quizzes` table to avoid JOINs.

## Avoiding Large Text Blobs

**Store Large Content Separately**:
- Use file storage (S3, GCS) for large files
- Store only file references in database
- Use `TEXT` type only for moderate content (< 1MB)

**Current Project**: Study library content stored as files, references in DB.

## Using JSONB Wisely

**When to Use JSONB**:
- Flexible schema (user preferences, metadata)
- Document-like data (quiz questions, configurations)
- Not for frequently queried relational data

**Benefits**: Flexible, queryable, indexable.

**Limitations**: Harder to query than normalized tables, no foreign keys.

**Current Project**: Uses JSONB for quiz questions - appropriate use case.

