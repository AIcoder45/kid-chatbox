# Super User & Admin User Creation Guide

## Super User Created ✅

**Email:** `amithbti416@gmail.com`  
**Password:** `Shanaya@123`  
**Name:** Super Admin  
**Role:** admin  
**Status:** approved  

This super user can:
- Access the admin portal at `/admin`
- Create new users and admins
- Manage all aspects of the platform
- Assign roles to users
- Approve/reject user registrations

## Creating Users & Admins

### Method 1: Through Admin Portal UI

1. **Login** with super user credentials (`amithbti416@gmail.com` / `Shanaya@123`)
2. Navigate to **Admin Portal** → **User Management** (`/admin/users`)
3. Click **"+ Create User"** button
4. Fill in the form:
   - **Email** (required)
   - **Password** (optional - user can set later)
   - **Name** (required)
   - **Age**, **Age Group**, **Grade** (optional)
   - **Parent Contact** (optional)
   - **Status**: Choose "Approved" or "Pending"
   - **Assign Roles**: Select roles (admin, content_manager, student, parent)
   - **Module Access**: Select which modules user can access (Study, Quiz)
5. Click **"Create User"**

### Method 2: Using Scripts

#### Create Super User
```bash
node server/scripts/create-super-user.js <email> <password> [name]
```

Example:
```bash
node server/scripts/create-super-user.js admin@example.com "SecurePass123" "Admin User"
```

#### Add Admin Role to Existing User
```bash
node server/scripts/add-admin-user.js amithbti416@gmail.com
```

Example:
```bash
node server/scripts/add-admin-user.js user@example.com
```

#### Check User Roles
```bash
node server/scripts/check-user-roles.js <email>
```

## API Endpoint

Admins can also create users via API:

**POST** `/api/admin/users/create`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body:**
```json
{
  "email": "newuser@example.com",
  "password": "optional_password",
  "name": "User Name",
  "age": 10,
  "ageGroup": "9-11",
  "grade": "5th",
  "parentContact": "parent@example.com",
  "roles": ["role_id_1", "role_id_2"],
  "moduleAccess": ["study", "quiz"],
  "status": "approved"
}
```

## Roles Available

1. **admin** - Full platform control
   - Can manage users, topics, quizzes, analytics
   - Can assign roles
   - Can approve/reject users

2. **content_manager** - Content management
   - Can manage topics, subtopics, study materials, quizzes
   - Can view analytics
   - Cannot manage users or assign roles

3. **student** - Standard user (default)
   - Can access Study and Quiz modules (if approved)
   - Can view own analytics

4. **parent** - Parent role (future feature)
   - Can view child progress

## Creating Admin Users

To create a new admin user:

1. **Through UI:**
   - Create user as normal
   - In "Assign Roles" section, check the "admin" role
   - Set status to "Approved"
   - Grant access to all modules

2. **Through Script:**
   ```bash
   # Create user first (if doesn't exist)
   node server/scripts/create-super-user.js admin2@example.com "Password123" "Admin 2"
   
   # Or add admin role to existing user
   node server/scripts/add-admin-user.js existing@example.com
   ```

## Security Notes

- Only users with `manage_users` permission can create users
- Admin role grants all permissions automatically
- Passwords are hashed using bcrypt
- Users created with "pending" status need admin approval
- Users created with "approved" status can immediately access modules

## Troubleshooting Admin Access

If you see "Access denied. Admin privileges required":

1. **Verify you're logged in:**
   - Make sure you've logged in with the super user credentials
   - Check browser console for errors

2. **Check user roles:**
   ```bash
   node server/scripts/test-admin-login.js amithbti416@gmail.com "Shanaya@123"
   ```

3. **Verify admin role is assigned:**
   ```bash
   node server/scripts/check-user-roles.js amithbti416@gmail.com
   ```

4. **Re-assign admin role if needed:**
   ```bash
   node server/scripts/add-admin-user.js amithbti416@gmail.com
   ```

5. **Clear browser cache and localStorage:**
   - Open browser DevTools (F12)
   - Go to Application/Storage tab
   - Clear localStorage
   - Refresh page and login again

6. **Check API response:**
   - Open browser DevTools → Network tab
   - Navigate to `/admin`
   - Check `/api/auth/me` request
   - Verify `roles` array includes `"admin"`

## Quick Reference

### Super User Credentials
- **Email:** `amithbti416@gmail.com`
- **Password:** `Shanaya@123`
- **Access:** Full admin portal

### Login Steps
1. Go to `http://localhost:5173/login`
2. Enter email: `amithbti416@gmail.com`
3. Enter password: `Shanaya@123`
4. Click Login
5. Navigate to `/admin` or click admin link

### Admin Portal Routes
- `/admin` - Dashboard
- `/admin/users` - User Management (create, edit, approve users)
- `/admin/topics` - Topic Management
- `/admin/quizzes` - Quiz Builder
- `/admin/analytics` - Analytics & Reports

### Scripts Location
- `server/scripts/create-super-user.js` - Create super user
- `server/scripts/add-admin-user.js` - Add admin role
- `server/scripts/check-user-roles.js` - Check user roles

