# Component & UI Structure

## Component Design Principles

**Single Responsibility**: Each component should do one thing well. If a component handles multiple concerns, split it.

**Composition Over Inheritance**: Build complex UIs by composing smaller, reusable components rather than extending base classes.

**Props Interface**: Always define explicit TypeScript interfaces for props. Use `React.FC<Props>` only when `children` is required.

## Presentational vs Container Components

**Presentational Components** (`@/components/ui/`):
- Receive data via props
- Focus on UI rendering
- No direct API calls
- Examples: `Button`, `Card`, `Input`

**Container Components** (`@/components/`):
- Manage state and data fetching
- Handle business logic
- Connect to services/APIs
- Examples: `Dashboard`, `QuizTutor`, `Profile`

## Smart Reusability Patterns

**Extract Common Patterns**:
```typescript
// ❌ Bad: Inline repeated logic
const UserCard = ({ user }) => <Box>...</Box>

// ✅ Good: Reusable components
const Card = ({ children, ...props }) => <Box {...props}>{children}</Box>
const UserCard = ({ user }) => <Card><UserInfo user={user} /></Card>
```

**Composition Pattern**:
```typescript
<Modal>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>Actions</Modal.Footer>
</Modal>
```

## Handling Props Cleanly

**Destructure Props**: Always destructure props at the function signature.

**Default Props**: Use default parameters, not `defaultProps`.

**Prop Validation**: Use TypeScript interfaces, not PropTypes.

## Avoiding Prop Drilling

**Use Context** for deeply nested props (theme, auth, user).

**Use Composition** to pass components as children.

**Lift State** only when multiple siblings need it.

