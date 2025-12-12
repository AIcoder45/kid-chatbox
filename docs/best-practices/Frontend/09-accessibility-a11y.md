# Accessibility (A11y)

## ARIA Support

**Semantic HTML First**: Use native elements (`<button>`, `<nav>`) before ARIA.

**When ARIA is Needed**:
- Custom components (use `role` attribute)
- Complex widgets (use `aria-*` attributes)
- Live regions (`aria-live`, `aria-atomic`)

**Examples**:
```typescript
<button aria-label="Close dialog" aria-expanded={isOpen}>
<nav aria-label="Main navigation">
<div role="alert" aria-live="polite">
```

## Focus Management

**Keyboard Navigation**:
- All interactive elements must be focusable
- Visible focus indicators (outline)
- Logical tab order

**Focus Trapping**: In modals, trap focus within the modal.

**Focus Restoration**: Return focus to trigger element when modal closes.

## Keyboard Navigation

**Standard Keys**:
- `Tab`: Next element
- `Shift+Tab`: Previous element
- `Enter/Space`: Activate button
- `Escape`: Close modals/dialogs
- `Arrow keys`: Navigate lists/menus

**Custom Components**: Implement keyboard handlers for custom widgets.

## Form Labels

**Always associate labels**:
```typescript
<FormControl>
  <FormLabel htmlFor="email">Email</FormLabel>
  <Input id="email" />
</FormControl>
```

**Hidden labels** (if visual label exists):
```typescript
<FormLabel srOnly>Search</FormLabel>
```

## Color Contrast Guidelines

**WCAG AA Standards**:
- Normal text: 4.5:1 contrast
- Large text (18px+): 3:1 contrast
- UI components: 3:1 contrast

**Don't rely on color alone**: Use icons, text, or patterns.

**Test**: Use browser DevTools or axe DevTools.

**Both themes**: Ensure contrast in light and dark modes.

