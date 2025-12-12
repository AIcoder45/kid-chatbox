# Testing (React)

## Component Tests with RTL

**React Testing Library** (RTL):
```typescript
import { render, screen } from '@testing-library/react';
import { QuizCard } from './QuizCard';

test('renders quiz title', () => {
  render(<QuizCard title="Math Quiz" />);
  expect(screen.getByText('Math Quiz')).toBeInTheDocument();
});
```

**Best Practices**:
- Test user behavior, not implementation
- Use `getByRole`, `getByLabelText` (accessible queries)
- Avoid `getByTestId` unless necessary

## Hook Tests

**Testing Custom Hooks**:
```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('increments counter', () => {
  const { result } = renderHook(() => useCounter());
  act(() => {
    result.current.increment();
  });
  expect(result.current.count).toBe(1);
});
```

**Wrapper**: Provide required context providers.

## Snapshot Rules

**When to Use**:
- UI components with stable output
- Regression testing

**When NOT to Use**:
- Frequently changing components
- Components with dates/random data

**Update Carefully**: Review changes before updating snapshots.

## Accessibility Testing

**Automated**:
- Use `@testing-library/jest-dom` matchers
- Use `jest-axe` for accessibility violations

**Manual**:
- Keyboard navigation
- Screen reader testing
- Color contrast checks

**Example**:
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('has no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Test Coverage

**Target**: ≥80% coverage for critical paths.

**Focus**: Test user flows, not implementation details.

**CI/CD**: Run tests before merge.

