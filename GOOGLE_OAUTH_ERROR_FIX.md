# Fixing "Can't continue with google.com" Error

## 🔴 Error You're Seeing

When clicking "Continue with Google", you see a Google popup with:
- **"Can't continue with google.com"**
- **"Something went wrong"**

This error comes from Google's OAuth system, not from our application.

## ✅ Step-by-Step Fix

### Step 1: Verify Google Cloud Console Configuration

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project (or create one if needed)

2. **Check OAuth Consent Screen**
   - Go to: **APIs & Services** → **OAuth consent screen**
   - **CRITICAL**: If status shows "Testing", you MUST add test users:
     - Scroll to "Test users" section
     - Click "+ ADD USERS"
     - Add your email address (the one you're trying to sign in with)
     - Click "ADD"
   - Verify these settings:
     - **User Type**: External (or Internal if using Google Workspace)
     - **App name**: Your app name (e.g., "KidChatbox" or "GuruAI")
     - **User support email**: Your email
     - **Developer contact**: Your email
     - **Scopes**: Should include `email`, `profile`, `openid`

3. **Check OAuth Client ID**
   - Go to: **APIs & Services** → **Credentials**
   - Click on your OAuth 2.0 Client ID
   - Verify **Authorized JavaScript origins** includes:
     ```
     http://localhost:5173
     http://localhost:3000
     ```
   - Verify **Authorized redirect URIs** includes:
     ```
     http://localhost:5173
     ```
   - **Copy the Client ID** (should end with `.apps.googleusercontent.com`)

### Step 2: Verify .env File

1. **Check your `.env` file** (in project root):
   ```env
   VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   ```

2. **Important**:
   - No quotes around the value
   - No spaces before/after
   - Must end with `.apps.googleusercontent.com`
   - Example: `VITE_GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com`

### Step 3: Restart Development Server

After changing `.env` or Google Cloud Console settings:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev:all
```

**Important**: Environment variables are loaded when the server starts. You MUST restart after changing `.env`.

### Step 4: Clear Browser Cache

1. **Clear browser cache**:
   - Chrome/Edge: Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
   - Select "Cached images and files"
   - Click "Clear data"

2. **Or try incognito/private mode**:
   - This bypasses cache and extensions
   - If it works in incognito, it's a cache/extension issue

### Step 5: Verify Browser Console

1. **Open browser console** (F12)
2. **Check for errors**:
   - Look for red error messages
   - Check Network tab for failed requests
   - Look for CORS errors

3. **Check Google Client ID**:
   - In console, type: `import.meta.env.VITE_GOOGLE_CLIENT_ID`
   - Should show your Client ID (not undefined)

## 🔍 Common Issues & Solutions

### Issue 1: "Testing" Mode Without Test Users

**Symptom**: Error appears only for some users

**Solution**:
- Go to OAuth consent screen
- Add your email to "Test users"
- Wait 5-10 minutes for changes to propagate

### Issue 2: Wrong Client ID Format

**Symptom**: Google Sign-In doesn't initialize

**Solution**:
- Verify Client ID ends with `.apps.googleusercontent.com`
- Check `.env` file has no quotes or spaces
- Restart dev server after changes

### Issue 3: Authorized Origins Mismatch

**Symptom**: CORS errors in console

**Solution**:
- Verify `http://localhost:5173` is in Authorized JavaScript origins
- Check you're accessing the app at `http://localhost:5173` (not `https://` or different port)

### Issue 4: OAuth Consent Screen Not Published

**Symptom**: Error for all users

**Solution**:
- If in "Testing" mode: Add test users
- If you want public access: Click "PUBLISH APP" (requires verification)
- For development: Keep in "Testing" mode and add test users

## 🧪 Testing Checklist

- [ ] Google Cloud Console project created
- [ ] OAuth consent screen configured
- [ ] Your email added as test user (if in Testing mode)
- [ ] OAuth Client ID created (Web application type)
- [ ] Authorized origins include `http://localhost:5173`
- [ ] `.env` file has `VITE_GOOGLE_CLIENT_ID` set correctly
- [ ] Dev server restarted after `.env` changes
- [ ] Browser cache cleared
- [ ] No browser extensions blocking OAuth (try incognito)

## 🚨 Still Not Working?

### Option 1: Use Email/Password Login

The app works perfectly without Google OAuth:
- Remove `VITE_GOOGLE_CLIENT_ID` from `.env` (or leave empty)
- Google button will automatically hide
- Use email/password login instead

### Option 2: Check Google Cloud Console Status

1. Go to: https://console.cloud.google.com/apis/credentials
2. Check if there are any warnings or errors
3. Verify the OAuth client is enabled (not deleted)

### Option 3: Create New OAuth Client

1. Delete the old OAuth Client ID
2. Create a new one:
   - Type: Web application
   - Name: KidChatbox Web Client
   - Authorized origins: `http://localhost:5173`
   - Authorized redirects: `http://localhost:5173`
3. Copy the new Client ID to `.env`
4. Restart dev server

## 📝 Quick Reference

**Google Cloud Console**: https://console.cloud.google.com/

**OAuth Consent Screen**: APIs & Services → OAuth consent screen

**Credentials**: APIs & Services → Credentials

**Required Settings**:
- Authorized JavaScript origins: `http://localhost:5173`
- Authorized redirect URIs: `http://localhost:5173`
- Scopes: `email`, `profile`, `openid`
- Test users: Add your email (if in Testing mode)


