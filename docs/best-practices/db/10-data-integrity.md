# Data Integrity

## Foreign Keys

**Always Define Foreign Keys**:
```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ...
);
```

**Benefits**: Prevents orphaned records, ensures referential integrity.

**ON DELETE Options**:
- `CASCADE`: Delete related records
- `SET NULL`: Set foreign key to NULL
- `RESTRICT`: Prevent deletion if references exist

**Current Project**: Uses foreign keys correctly.

## NOT NULL Usage

**Use NOT NULL For**:
- Required fields (email, password)
- Business-critical columns
- Columns that shouldn't be NULL

**Benefits**: Prevents invalid data, simplifies queries (no NULL checks needed).

**Example**:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INTEGER  -- Optional, can be NULL
);
```

**Current Project**: Uses NOT NULL appropriately.

## Check Constraints

**Validate Data at DB Level**:
```sql
CREATE TABLE users (
  age INTEGER CHECK (age >= 7 AND age <= 14),
  email VARCHAR(255) CHECK (email LIKE '%@%'),
  status VARCHAR(50) CHECK (status IN ('pending', 'active', 'suspended'))
);
```

**Benefits**: Data validation even if application code has bugs.

**Use For**: Business rules, data ranges, allowed values.

**Current Project**: Consider adding CHECK constraints for data validation.

## Preventing Orphaned Records

**Foreign Keys**: Primary defense against orphaned records.

**Cascade Rules**: Choose appropriate ON DELETE behavior.

**Example**:
```sql
-- If user deleted, delete their quizzes
user_id UUID REFERENCES users(id) ON DELETE CASCADE

-- If user deleted, keep quiz but set user_id to NULL
user_id UUID REFERENCES users(id) ON DELETE SET NULL
```

**Audit Queries**: Periodically check for orphaned records:
```sql
SELECT * FROM quizzes q
LEFT JOIN users u ON q.user_id = u.id
WHERE u.id IS NULL;
```

## Data Integrity Checklist

**Before Creating Table**:
- [ ] Define primary key
- [ ] Define foreign keys with appropriate ON DELETE
- [ ] Add NOT NULL constraints
- [ ] Add CHECK constraints for business rules
- [ ] Add unique constraints where needed

**Current Project**: Follows most practices, consider adding CHECK constraints.

