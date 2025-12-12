# JSONB Guidelines

## When JSONB is Appropriate

**Good Use Cases**:
- Flexible schema (user preferences, settings)
- Document-like data (quiz questions, configurations)
- Metadata that varies by record
- Semi-structured data

**Not Appropriate**:
- Frequently queried relational data
- Data that needs foreign keys
- Data with fixed schema (use normal columns)

**Current Project**: Uses JSONB for quiz questions - appropriate for flexible question structure.

## Indexing JSONB

**GIN Index** (General Inverted Index):
```sql
CREATE INDEX idx_quiz_questions ON quizzes USING GIN (questions);
```

**Query Operators**:
```sql
-- Contains operator
SELECT * FROM quizzes WHERE questions @> '{"type": "multiple_choice"}';

-- Key exists
SELECT * FROM quizzes WHERE questions ? 'answers';

-- Path query
SELECT * FROM quizzes WHERE questions->>'type' = 'multiple_choice';
```

**Benefits**: Fast queries on JSONB data.

**Current Project**: Consider adding GIN index on questions column if frequently queried.

## Avoid Using it as a NoSQL Dump

**Don't Store Everything in JSONB**:
```sql
-- ❌ Bad: Everything in JSONB
CREATE TABLE users (
  id UUID PRIMARY KEY,
  data JSONB  -- Contains email, name, password, etc.
);

-- ✅ Good: Use JSONB for flexible parts only
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255),
  name VARCHAR(255),
  preferences JSONB  -- Only flexible data
);
```

**Rule**: Use JSONB for truly variable/flexible data, not as replacement for proper schema.

## Querying JSONB Efficiently

**Use Indexes**:
```sql
-- GIN index for containment queries
CREATE INDEX idx_questions_type ON quizzes USING GIN ((questions->>'type'));
```

**Extract to Columns** (if frequently queried):
```sql
-- Add computed column
ALTER TABLE quizzes ADD COLUMN question_type VARCHAR(50)
GENERATED ALWAYS AS (questions->>'type') STORED;

CREATE INDEX idx_question_type ON quizzes(question_type);
```

**Performance**: JSONB queries can be slower than column queries, extract if needed.

## JSONB Best Practices

**Schema Validation**: Validate JSONB structure in application code.

**Size Limits**: JSONB can be large, monitor size.

**Query Patterns**: Use appropriate operators (`@>`, `?`, `->`, `->>`).

**Index Strategically**: Index frequently queried JSONB paths.

**Current Project**: Review JSONB usage, add indexes if needed, consider extracting frequently queried fields.

