# Relationship Best Practices

## One-to-One Patterns

**Pattern**: One record in Table A relates to one record in Table B.

**Implementation**:
```sql
-- Option 1: Foreign key with UNIQUE constraint
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT
);

-- Option 2: Share primary key
CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT
);
```

**Use Cases**: User profiles, settings, extended user data.

**Current Project**: Consider if any one-to-one relationships exist.

## One-to-Many Keys

**Pattern**: One record in Table A relates to many records in Table B.

**Implementation**:
```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255)
);
```

**Foreign Key**: Goes on the "many" side (quizzes table).

**Index**: Always index foreign keys for JOIN performance.

**Current Project**: Uses one-to-many relationships (users → quizzes).

## Many-to-Many Join Tables

**Pattern**: Many records in Table A relate to many records in Table B.

**Implementation**:
```sql
CREATE TABLE quiz_tags (
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (quiz_id, tag_id)
);

CREATE INDEX idx_quiz_tags_quiz ON quiz_tags(quiz_id);
CREATE INDEX idx_quiz_tags_tag ON quiz_tags(tag_id);
```

**Composite Primary Key**: Use both foreign keys as primary key.

**Indexes**: Index both foreign keys for efficient queries in both directions.

**Current Project**: Uses join tables (e.g., `quiz_library_usage`).

## Cascading Rules

**CASCADE**: Delete/update propagates to related records.

**SET NULL**: Set foreign key to NULL when parent deleted.

**RESTRICT**: Prevent deletion if references exist.

**NO ACTION**: Similar to RESTRICT, checked at end of transaction.

**Choose Based on Business Logic**:
- User deleted → Delete their quizzes? Use CASCADE
- User deleted → Keep quizzes but anonymize? Use SET NULL
- User deleted → Prevent if has active quizzes? Use RESTRICT

**Current Project**: Uses CASCADE appropriately.

## Relationship Design Tips

**Normalize First**: Design normalized schema, then denormalize if needed for performance.

**Document Relationships**: Document relationships and cascade rules.

**Test Cascades**: Test DELETE/UPDATE behavior to ensure correct cascading.

**Consider Performance**: Deep cascades can be slow, monitor performance.

