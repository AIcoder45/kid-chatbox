# Performance

## Memoization

**React.memo**: Prevent re-renders when props haven't changed:
```typescript
export const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});
```

**useMemo**: Cache expensive calculations:
```typescript
const expensiveValue = useMemo(() => compute(data), [data]);
```

**useCallback**: Memoize function references:
```typescript
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

## Avoiding Unnecessary Renders

**Common Causes**:
- Inline object/array creation in props
- Functions created in render
- Context value changes

**Solutions**:
- Memoize props
- Extract functions outside component or use `useCallback`
- Split contexts to prevent unnecessary updates

## Code Splitting

**Route-based**:
```typescript
const AdminDashboard = lazy(() => import('@/components/admin/AdminDashboard'));
<Suspense fallback={<Loading />}>
  <AdminDashboard />
</Suspense>
```

**Component-based**: Split heavy components (charts, editors).

## Lazy Loading Components

**React.lazy**:
```typescript
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

**Always wrap** with `<Suspense>` and provide fallback.

## Virtualized Lists

**For long lists** (100+ items):
- Use `react-window` or `react-virtualized`
- Render only visible items
- Improves scroll performance

**Example**: Quiz history, user lists, data tables.

## Image Optimization

**Techniques**:
- Use WebP format with fallback
- Lazy load below-the-fold images
- Use `srcSet` for responsive images
- Compress images before upload

**Lazy Loading**:
```typescript
<img src={src} loading="lazy" alt={alt} />
```

## Preloading Routes

**Prefetch on hover**:
```typescript
<Link to="/dashboard" onMouseEnter={() => import('./Dashboard')}>
```

**Critical routes**: Preload in `<head>` or on app initialization.

