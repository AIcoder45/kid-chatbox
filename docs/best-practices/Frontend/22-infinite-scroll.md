# Infinite Scroll

## Implementation Pattern

**React Query Infinite Query**:
```typescript
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['items'],
  queryFn: ({ pageParam = 0 }) => fetchItems(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

**Benefits**: Automatic pagination, caching, loading states.

## Intersection Observer

**Detect Scroll Position**:
```typescript
const observerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    { threshold: 1.0 }
  );
  
  if (observerRef.current) {
    observer.observe(observerRef.current);
  }
  
  return () => observer.disconnect();
}, [hasNextPage, fetchNextPage]);
```

## Loading States

**Show Loading Indicator**:
```typescript
{isFetchingNextPage && <LoadingSpinner />}
```

**Skeleton Loaders**: Show while fetching next page.

## Performance Considerations

**Virtualization**: For very long lists, use `react-window`.

**Debounce**: Avoid rapid scroll-triggered fetches.

**Cache Management**: Limit cached pages to prevent memory issues.

## User Experience

**Scroll to Top**: Provide button to scroll back to top.

**Jump to Page**: For very long lists, consider pagination option.

**Error Handling**: Show error message if loading fails, allow retry.

