# 🔧 Fix: "relation study_library_content does not exist" Error

## Problem

You're getting this error:
```
relation "study_library_content" does not exist
```

This means the `study_library_content` database table hasn't been created yet.

## ✅ Quick Fix

### On Your VPS Server

```bash
# SSH into your VPS
ssh root@31.97.232.51

# Navigate to your app directory
cd /var/www/kidchatbox  # or your app path

# Run the migration script
node server/scripts/migrate-study-library-content.js
```

### Expected Output

```
✅ Study Library Content table created successfully
Migration completed
```

## 🔍 Verify Table Was Created

### Option 1: Check via Database

```bash
# Connect to PostgreSQL
psql -h YOUR_DB_HOST -U YOUR_DB_USER -d kidchatbox

# Check if table exists
\dt study_library_content

# Or query the table
SELECT * FROM study_library_content LIMIT 1;
```

### Option 2: Check via API

```bash
# Test the endpoint (should not error now)
curl https://guru-ai.cloud/api/admin/study-library-content \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Option 3: Check Server Logs

```bash
# Restart your app
pm2 restart kidchatbox-api

# Check logs
pm2 logs kidchatbox-api

# Should not show "relation does not exist" error anymore
```

## 📋 What This Migration Creates

The script creates the `study_library_content` table with:

- **Basic Fields:**
  - `id` (UUID, primary key)
  - `title` (required)
  - `description` (optional)
  - `content_type` (ppt, pdf, or text)
  
- **File Fields:**
  - `file_url`
  - `file_name`
  - `file_size`
  - `text_content` (for text type)
  
- **Metadata Fields:**
  - `subject`
  - `age_group`
  - `difficulty`
  - `language`
  - `publish_date`
  - `is_published`
  - `view_count`
  
- **Timestamps:**
  - `created_at`
  - `updated_at`
  - `created_by` (references users table)

- **Indexes:**
  - Content type index
  - Publish date index
  - Published status index
  - Subject index

## 🚀 Complete Database Setup

If you haven't run all migrations yet, you might want to run the full database setup:

```bash
# Run all database migrations
npm run db:setup

# This will create all required tables including:
# - users, roles, permissions
# - topics, subtopics
# - quizzes, questions
# - study_sessions, study_progress
# - study_library_content (if included)
```

## 🔄 If Migration Fails

### Error: "Cannot connect to database"

**Fix:**
```bash
# Check .env file has correct database credentials
cat .env | grep DATABASE

# Should show:
# DATABASE_HOST=your-host
# DATABASE_PORT=5432
# DATABASE_NAME=kidchatbox
# DATABASE_USERNAME=your-user
# DATABASE_PASSWORD=your-password
```

### Error: "Permission denied"

**Fix:**
```bash
# Make sure database user has CREATE TABLE permission
# Check with your database administrator
```

### Error: "Table already exists"

**Fix:**
- This is fine! The script uses `CREATE TABLE IF NOT EXISTS`
- The table already exists, so you're good to go

### Error: "gen_random_uuid() does not exist"

**Fix:**
```bash
# Enable UUID extension
psql -h YOUR_DB_HOST -U YOUR_DB_USER -d kidchatbox -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
```

## ✅ After Running Migration

1. **Restart your application:**
   ```bash
   pm2 restart kidchatbox-api
   ```

2. **Test the endpoint:**
   - Go to Admin Portal → Study Library Content
   - Or test API: `GET /api/admin/study-library-content`

3. **Verify no errors:**
   ```bash
   pm2 logs kidchatbox-api --lines 50
   ```

## 📝 Additional Setup (Optional)

### Create Uploads Directory

If you plan to upload files:

```bash
# Create uploads directory
mkdir -p uploads/study-library

# Set permissions
chmod 755 uploads/study-library

# Make sure server has write access
chown -R www-data:www-data uploads/  # or your server user
```

## 🎯 Summary

**Quick Fix Command:**
```bash
node server/scripts/migrate-study-library-content.js
```

**Then restart:**
```bash
pm2 restart kidchatbox-api
```

That's it! The error should be resolved.

---

**Need More Help?**
- Check `STUDY_LIBRARY_CONTENT_SETUP.md` for full setup guide
- Check `DEPLOY_TO_EXISTING_VPS.md` for deployment issues
- Check server logs: `pm2 logs kidchatbox-api`

