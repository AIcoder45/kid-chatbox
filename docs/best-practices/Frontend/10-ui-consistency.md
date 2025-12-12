# UI Consistency

## Design System Usage

**Mandatory**: ALL UI components MUST come from `@/shared/design-system`.

**Never import directly** from Chakra UI or other libraries.

**Benefits**:
- Consistent styling
- Centralized theme updates
- Easier maintenance

## Common UI Elements Library

**Create reusable components**:
- `Button`, `Input`, `Card`, `Modal`
- `LoadingSpinner`, `ErrorState`, `EmptyState`
- `Toast`, `Dialog`, `Tooltip`

**Location**: `@/shared/design-system/components/`

**Usage**: Import from design system, not individual files.

## Typography Scale

**Consistent font sizes**:
```typescript
const typography = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
};
```

**Use theme tokens**, not hardcoded sizes.

## Spacing Rules

**8px Grid System**:
- Use multiples of 8px for spacing
- `gap={2}` = 8px, `gap={4}` = 16px, etc.

**Consistent margins/padding**:
- Same spacing scale across components
- Use theme spacing tokens

## Color Palette Rules

**Theme-based colors**:
- Primary, secondary, accent colors
- Semantic colors (success, error, warning, info)
- Neutral grays for text/backgrounds

**Never hardcode colors**: Always use theme tokens.

**Accessibility**: Ensure sufficient contrast ratios.

