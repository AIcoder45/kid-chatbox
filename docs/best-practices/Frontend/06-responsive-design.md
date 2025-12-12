# Responsive Design

## Design Breakpoints

**Chakra UI Default Breakpoints**:
- `base`: 0em (mobile)
- `sm`: 30em (480px)
- `md`: 48em (768px)
- `lg`: 62em (992px)
- `xl`: 80em (1280px)
- `2xl`: 96em (1536px)

**Usage**:
```typescript
<Box display={{ base: 'block', md: 'flex' }}>
  <Text fontSize={{ base: 'sm', md: 'lg' }}>Responsive</Text>
</Box>
```

## Mobile-First Rules

**Start with mobile**, then enhance for larger screens:
```typescript
// ✅ Good: Mobile-first
width={{ base: '100%', md: '50%', lg: '33%' }}

// ❌ Bad: Desktop-first
width={{ lg: '33%', md: '50%', base: '100%' }}
```

**Progressive Enhancement**: Add features for larger screens.

## Safe Area Guidelines

**Mobile Safe Areas**:
- Use `padding` for safe areas (notch, home indicator)
- Test on real devices
- Use `env(safe-area-inset-*)` CSS variables

**Example**:
```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

## Responsive Grid Usage

**Chakra UI Grid**:
```typescript
<Grid
  templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
  gap={4}
>
```

**Auto-fit**: Use `repeat(auto-fit, minmax(250px, 1fr))` for flexible layouts.

## Handling Images and Icons Across Sizes

**Responsive Images**:
- Use `srcSet` for different resolutions
- Lazy load images below the fold
- Use `loading="lazy"` attribute

**Icons**: Scale appropriately (16px mobile, 24px desktop).

## Touch Target Size Rules

**Minimum Size**: 44x44px (iOS) or 48x48px (Android)

**Spacing**: At least 8px between touch targets

**Test**: Verify on real devices, not just browser DevTools.

