# Module Access Control Guide

## Overview

Users can signup and login, but **cannot access Study and Quiz modules** until an admin grants permission.

## User Flow

### 1. Registration
- User signs up → Account created with status: `pending`
- User receives message: "Registration successful. Your account is pending approval."
- User can login but cannot access Study/Quiz modules

### 2. Login
- User can login successfully
- User can access Dashboard and Profile
- User **cannot** access Study or Quiz modules (shows access denied message)

### 3. Admin Approval
- Admin reviews user in `/admin/users`
- Admin clicks "Approve" button
- System automatically:
  - Sets user status to `approved`
  - Grants access to `study` module
  - Grants access to `quiz` module

### 4. After Approval
- User can now access Study and Quiz modules
- User can take quizzes and study lessons

## Access Control Implementation

### Backend Protection

**Study Routes:**
- `POST /api/study/sessions` - Requires `checkModuleAccess('study')`
- `GET /api/study/history/:userId` - Requires `checkModuleAccess('study')`

**Quiz Routes:**
- `POST /api/quiz/results` - Requires `checkModuleAccess('quiz')`
- `GET /api/quiz/history/:userId` - Requires `checkModuleAccess('quiz')`
- `POST /api/quizzes/:quizId/attempt` - Requires `checkModuleAccess('quiz')`
- `POST /api/quizzes/attempts/:attemptId/submit` - Requires `checkModuleAccess('quiz')`

### Frontend Protection

**ModuleAccessGuard Component:**
- Wraps Study and Quiz routes
- Checks user status and module access before rendering
- Shows friendly error message if access denied
- Redirects to dashboard if not approved

### Access Rules

1. **Pending Users:**
   - ❌ Cannot access Study module
   - ❌ Cannot access Quiz module
   - ✅ Can access Dashboard
   - ✅ Can access Profile

2. **Approved Users (with module access):**
   - ✅ Can access Study module
   - ✅ Can access Quiz module
   - ✅ Can access Dashboard
   - ✅ Can access Profile

3. **Admin Users:**
   - ✅ Can access everything (bypasses module access checks)

4. **Rejected/Suspended Users:**
   - ❌ Cannot access any modules
   - ❌ Cannot login (blocked at login)

## Admin Actions

### Approve User
```javascript
PUT /api/admin/users/:id/approve
Body: {
  status: 'approved',
  moduleAccess: ['study', 'quiz'] // Optional - defaults to both
}
```

**What happens:**
- User status → `approved`
- Module access granted → `study: true`, `quiz: true`
- User can now access modules

### Reject User
```javascript
PUT /api/admin/users/:id/approve
Body: {
  status: 'rejected',
  moduleAccess: []
}
```

**What happens:**
- User status → `rejected`
- Module access revoked → All modules set to `false`
- User cannot login (blocked at login endpoint)

### Grant Specific Module Access
```javascript
PUT /api/admin/users/:id/approve
Body: {
  status: 'approved',
  moduleAccess: ['study'] // Only study module
}
```

## Error Messages

### Frontend Messages

**Pending Approval:**
```
Access Restricted
Your account is pending approval. Please wait for admin approval before accessing this module.
```

**No Module Access:**
```
Access Restricted
Access denied to [study/quiz] module. Please contact administrator to grant access.
```

### Backend API Responses

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Account pending approval. Please wait for admin approval."
}
```

**403 Module Access Denied:**
```json
{
  "success": false,
  "message": "Access denied to study module. Please contact administrator for access."
}
```

## Database Schema

### user_module_access Table
```sql
CREATE TABLE user_module_access (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  module_name VARCHAR(50), -- 'study' or 'quiz'
  has_access BOOLEAN DEFAULT true,
  granted_at TIMESTAMP,
  granted_by UUID REFERENCES users(id),
  UNIQUE(user_id, module_name)
);
```

## Testing

### Test Pending User
1. Register new user
2. Login
3. Try to access `/study` → Should show access denied
4. Try to access `/quiz` → Should show access denied

### Test Approved User
1. Admin approves user
2. User refreshes page or logs in again
3. Try to access `/study` → Should work
4. Try to access `/quiz` → Should work

### Test Module Access Check
```bash
# Check user module access
node server/scripts/check-user-roles.js user@example.com
```

## Troubleshooting

### User can't access modules after approval
1. Check user status: `SELECT status FROM users WHERE email = 'user@example.com'`
2. Check module access: `SELECT * FROM user_module_access WHERE user_id = '...'`
3. Verify user is logged in (check localStorage for `auth_token`)
4. Check browser console for errors

### User can access modules without approval
1. Verify `checkModuleAccess` middleware is applied to routes
2. Check if user has admin role (admins bypass checks)
3. Verify middleware is checking `user_module_access` table

## Summary

✅ **Users can signup and login**  
❌ **Users cannot access Study/Quiz until admin approval**  
✅ **Admin approval automatically grants module access**  
✅ **Access is enforced at both frontend and backend levels**


