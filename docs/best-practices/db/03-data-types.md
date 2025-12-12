# Data Types

## Choosing Correct Types

**Numeric Types**:
- `SMALLINT`: -32,768 to 32,767 (age, count)
- `INTEGER`: -2 billion to 2 billion (IDs, counts)
- `BIGINT`: Very large numbers (timestamps, large counts)
- `DECIMAL(p,s)`: Exact numeric (money, percentages)
- `REAL/DOUBLE PRECISION`: Approximate numeric (scientific)

**String Types**:
- `VARCHAR(n)`: Variable length with limit
- `TEXT`: Unlimited length (preferred for most text)
- `CHAR(n)`: Fixed length (rarely used)

**Boolean**: `BOOLEAN` (not `INTEGER` with 0/1)

**Date/Time**: `TIMESTAMP`, `TIMESTAMPTZ`, `DATE`, `TIME`

## Avoiding VARCHAR(255) Everywhere

**Problem**: `VARCHAR(255)` is arbitrary limit, often wasteful.

**Better Approach**:
- Use `TEXT` for variable-length strings
- Use `VARCHAR(n)` only when you have specific length requirements
- Use appropriate limits: `VARCHAR(50)` for short codes, `VARCHAR(255)` for emails

**Current Project**: Uses `VARCHAR(255)` and `TEXT` appropriately.

## Using UUID vs Serial

**UUID** (`gen_random_uuid()`):
- Distributed systems
- No sequence conflicts
- Harder to guess
- Larger storage (16 bytes vs 4-8 bytes)

**SERIAL/BIGSERIAL**:
- Single-server applications
- Smaller storage
- Easier to read/debug
- Sequential (can reveal information)

**Current Project**: Uses UUID - good for distributed systems.

## Using Enums Safely

**PostgreSQL ENUMs**:
```sql
CREATE TYPE user_status AS ENUM ('pending', 'active', 'suspended');

CREATE TABLE users (
  status user_status DEFAULT 'pending'
);
```

**Benefits**: Type safety, validation at DB level.

**Drawbacks**: Hard to modify (requires migration), can't remove values easily.

**Alternative**: Use `VARCHAR` with CHECK constraint for flexibility.

## Using Arrays and JSONB with Caution

**Arrays** (`TEXT[]`, `INTEGER[]`):
- Good for tags, categories
- Can be indexed with GIN index
- Harder to query than normalized tables

**JSONB**:
- Flexible schema
- Queryable with operators (`->`, `->>`, `@>`)
- Can be indexed with GIN index
- Use for truly variable data

**Current Project**: Uses arrays for tags (`TEXT[]`), JSONB for questions - appropriate.

