# State Management

## Local vs Global State Guidelines

**Local State** (`useState`, `useReducer`):
- Component-specific UI state (toggles, form inputs)
- Temporary calculations
- Component-scoped data

**Global State** (`Context`, `Redux`):
- User authentication
- Theme preferences
- App-wide settings
- Shared data across routes

## When to Use Context

**Use Context For**:
- Theme (light/dark mode)
- User authentication state
- Language preferences
- Feature flags

**Avoid Context For**:
- Frequently updating data (causes re-renders)
- Server state (use React Query instead)
- Form state (use React Hook Form)

## When to Use Redux Toolkit

**Use Redux Toolkit When**:
- Complex state logic with multiple reducers
- Time-travel debugging needed
- Large team with shared state patterns
- Middleware requirements (logging, async)

**Current Project**: Prefer Context for simple global state.

## When to Use React Query for Server State

**Use React Query For**:
- API data fetching
- Caching server responses
- Background refetching
- Optimistic updates
- Pagination and infinite queries

**Benefits**:
- Automatic caching
- Request deduplication
- Background updates
- Loading/error states

## Cache Invalidation Patterns

**Time-based**: Refetch after X seconds
**Event-based**: Invalidate on mutations
**Manual**: `queryClient.invalidateQueries(['key'])`
**Optimistic**: Update cache immediately, rollback on error

