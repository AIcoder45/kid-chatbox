# Loading States

## Skeleton vs Spinner

**Skeleton Loaders**:
- Use for content that will appear in place
- Better UX (shows layout structure)
- Examples: Cards, lists, forms

**Spinners**:
- Use for actions (button clicks, form submissions)
- Use for full-page loads
- Examples: API calls, route transitions

**Rule**: Prefer skeletons for content, spinners for actions.

## Page Loading Pattern

**Full-Page Skeleton**:
```typescript
{loading ? (
  <Skeleton height="100vh" />
) : (
  <PageContent />
)}
```

**Progressive Loading**: Show header/nav immediately, load content progressively.

## Button Loading Prevention

**Disable button** during action:
```typescript
<Button
  isLoading={isSubmitting}
  loadingText="Submitting..."
  disabled={isSubmitting}
  onClick={handleSubmit}
>
  Submit
</Button>
```

**Prevent double-clicks**: Disable immediately on click.

## Handling Empty States

**Empty State Component**:
```typescript
{data.length === 0 ? (
  <EmptyState
    icon={<EmptyIcon />}
    title="No items found"
    description="Try adjusting your filters"
    action={<Button>Clear Filters</Button>}
  />
) : (
  <DataList data={data} />
)}
```

**Provide Context**: Explain why it's empty and what user can do.

**Actionable**: Include button to add/create content.

