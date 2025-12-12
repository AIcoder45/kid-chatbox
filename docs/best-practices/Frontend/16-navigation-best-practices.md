# Navigation Best Practices

## Route Naming Rules

**Consistent Patterns**:
- Use kebab-case: `/quiz-library`, `/study-history`
- Use plural for lists: `/quizzes`, `/users`
- Use singular for detail: `/quiz/:id`, `/user/:id`
- Use verbs for actions: `/quiz/:id/take`, `/user/:id/edit`

**Avoid**: Inconsistent naming, deep nesting (>3 levels).

## Lazy Route Loading

**Code Splitting**:
```typescript
const AdminDashboard = lazy(() => import('@/components/admin/AdminDashboard'));

<Route
  path="/admin"
  element={
    <Suspense fallback={<Loading />}>
      <AdminDashboard />
    </Suspense>
  }
/>
```

**Benefits**: Smaller initial bundle, faster load time.

## Back Button Handling

**Browser History**:
- Use `useNavigate(-1)` for programmatic back
- Preserve state when navigating back
- Handle browser back button gracefully

**Prevent Navigation**: Use `useBlocker` to warn before leaving unsaved changes.

## Deep Linking

**Support Direct URLs**:
- All routes should work when accessed directly
- Handle authentication state
- Load required data for route

**Query Parameters**: Use for filters, search, pagination.

**Example**: `/quiz-library?subject=math&grade=5`

## Route Guards

**Multiple Guards**:
```typescript
<Route
  path="/admin"
  element={
    <AuthGuard>
      <AdminGuard>
        <ModuleAccessGuard module="admin">
          <AdminDashboard />
        </ModuleAccessGuard>
      </AdminGuard>
    </AuthGuard>
  }
/>
```

**Order**: Auth → Role → Module Access.

