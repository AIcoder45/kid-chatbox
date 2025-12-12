# Auth UI Flow

## Protected Routes

**Implementation**:
```typescript
<Route
  path="/dashboard"
  element={
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  }
/>
```

**AuthGuard Component**:
- Check authentication status
- Redirect to login if not authenticated
- Show loading state during check

## Public Routes

**Public Routes** (no auth required):
- `/` (Home/Login)
- `/register`
- `/forgot-password`

**Redirect Logic**: If authenticated user visits login, redirect to dashboard.

## Role-Based UI

**Role Checks**:
```typescript
const { user } = useAuth();
const isAdmin = user?.role === 'admin';

{isAdmin && <AdminButton />}
```

**Component Guards**:
```typescript
<AdminGuard>
  <AdminDashboard />
</AdminGuard>
```

**Module Access**: Use `ModuleAccessGuard` for feature-based access.

## Handling Token Expiry in UI

**Token Refresh**:
- Intercept 401 responses
- Attempt token refresh
- Retry original request

**Expiry Handling**:
- Show warning before expiry (e.g., 5 minutes)
- Auto-logout on expiry
- Clear user data and redirect to login

**User Experience**:
- Show "Session expired" message
- Save user's work/state if possible
- Smooth transition to login

