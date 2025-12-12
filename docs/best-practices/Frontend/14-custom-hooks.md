# Custom Hooks

## Naming Convention

**Always prefix with `use`**: `useAuth`, `useQuiz`, `useLocalStorage`

**File naming**: `useCamelCase.ts` (e.g., `useAuth.ts`, `useQuizTimer.ts`)

**Location**: `src/hooks/` directory

## Reusable Logic Patterns

**Extract repeated logic**:
```typescript
// ❌ Bad: Logic duplicated in components
const Component1 = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  // ... fetch logic
};

// ✅ Good: Extract to hook
const useFetchData = (url: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  // ... fetch logic
  return { data, loading, error };
};
```

## Separation of Concerns

**Single Responsibility**: Each hook should do one thing.

**Compose hooks**: Combine simple hooks to build complex behavior.

**Examples**:
- `useAuth`: Authentication logic
- `useLocalStorage`: Local storage operations
- `useDebounce`: Debounce values
- `useMediaQuery`: Responsive breakpoints

## Avoiding Side-Effect Hooks

**Pure hooks**: Return values, don't cause side effects directly.

**Side effects in components**: Use `useEffect` in components that use hooks.

**Exception**: Hooks that manage subscriptions (cleanup required).

**Example**:
```typescript
// ✅ Good: Returns value, side effect in component
const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  // ... logic
  return size;
};

// Component uses useEffect to handle side effects
```

