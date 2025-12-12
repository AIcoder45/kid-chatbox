# Layout Patterns for Dashboards

## Grid Layout System

**Responsive Grid**:
```typescript
<Grid
  templateColumns={{
    base: '1fr',
    md: 'repeat(2, 1fr)',
    lg: 'repeat(3, 1fr)',
  }}
  gap={4}
>
  <GridItem><Card /></GridItem>
  <GridItem><Card /></GridItem>
</Grid>
```

**Flexible**: Adapts to screen size automatically.

## Sidebar Navigation

**Collapsible Sidebar**:
- Collapse on mobile
- Expand on desktop
- Show active route highlight
- Icon-only when collapsed

**Implementation**: Use `Drawer` on mobile, `Box` on desktop.

## Header Bar

**Fixed Header**:
- User menu
- Notifications
- Search (if applicable)
- Theme toggle

**Sticky**: Use `position: sticky` or `fixed`.

## Card-Based Layout

**Dashboard Cards**:
- Consistent card component
- Hover effects
- Clickable cards for navigation
- Loading skeletons

**Spacing**: Use consistent gap between cards.

## Responsive Breakpoints

**Mobile**: Single column, stacked cards
**Tablet**: 2 columns
**Desktop**: 3-4 columns

**Test**: Verify on all breakpoints.

## Data Visualization

**Charts**: Use `recharts` or similar library.

**Loading States**: Show skeleton while loading data.

**Empty States**: Show helpful message when no data.

**Error States**: Show error message with retry option.

