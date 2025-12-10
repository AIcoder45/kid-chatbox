# Google OAuth Error Fixes

## Errors You're Seeing

1. **ERR_FAILED** - Network error
2. **CORS headers** - Server CORS configuration
3. **FedCM IdentityCredentialError** - Google Sign-In configuration issue

## ✅ Fixes Applied

### 1. Backend CORS Fixed
Updated `server/index.js` to properly allow:
- `http://localhost:5173`
- `http://localhost:3000`
- Credentials enabled

### 2. Google Script Loading
- Script now loads dynamically only if `VITE_GOOGLE_CLIENT_ID` is set
- Better error handling if script fails to load

### 3. Login Component
- Improved error messages
- Better handling of Google Sign-In initialization
- Graceful fallback if Google OAuth not configured

## 🔧 Quick Fixes

### Fix 1: Verify Google Client ID

Check your `.env` file:
```env
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

**Important**: 
- No quotes around the value
- No spaces
- Must end with `.apps.googleusercontent.com`

### Fix 2: Verify Google Cloud Console Settings

1. Go to: https://console.cloud.google.com/
2. APIs & Services → Credentials
3. Click your OAuth Client ID
4. Verify **Authorized JavaScript origins** includes:
   - `http://localhost:5173`
   - `http://localhost:3000`
5. Verify **Authorized redirect URIs** includes:
   - `http://localhost:5173`
   - `http://localhost:5173/auth/google/callback`

### Fix 3: OAuth Consent Screen

1. APIs & Services → OAuth consent screen
2. Make sure:
   - User Type: External (or Internal if using Google Workspace)
   - Scopes include: `email`, `profile`, `openid`
   - Test users include your email (if in Testing mode)

### Fix 4: Restart Everything

After changing `.env`:
```bash
# Stop the current process (Ctrl+C)
# Then restart:
npm run dev:all
```

## 🚫 If Still Not Working

### Option A: Skip Google OAuth (Temporary)

The app works perfectly with email/password login. You can:

1. Remove `VITE_GOOGLE_CLIENT_ID` from `.env` (or leave it empty)
2. Google button will automatically hide
3. Use email/password registration/login
4. Add Google OAuth later when needed

### Option B: Use Different Browser

- Try Chrome (best compatibility)
- Try Edge
- Clear browser cache
- Try incognito/private window

### Option C: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for specific error messages
4. Check Network tab for failed requests

## 📋 Checklist

- [ ] `.env` has `VITE_GOOGLE_CLIENT_ID` set correctly
- [ ] Google Cloud Console has correct authorized origins
- [ ] OAuth consent screen is configured
- [ ] Dev server restarted after changing `.env`
- [ ] Browser cache cleared
- [ ] No browser extensions blocking OAuth
- [ ] Using Chrome/Edge browser

## 🎯 Test Steps

1. **Check if Google script loads**:
   - Open browser console
   - Type: `window.google`
   - Should show Google object (not undefined)

2. **Check Client ID**:
   - In console: `import.meta.env.VITE_GOOGLE_CLIENT_ID`
   - Should show your client ID

3. **Try Google Login**:
   - Click "Continue with Google"
   - Should show Google popup
   - Select account
   - Should redirect back and login

## 💡 Alternative: Manual OAuth Flow

If One Tap doesn't work, we can implement a redirect-based OAuth flow:

1. Click "Continue with Google"
2. Redirects to Google login page
3. User logs in
4. Google redirects back with code
5. Backend exchanges code for token
6. User logged in

This is more reliable but requires additional backend setup.

## Need More Help?

Check these files:
- `GOOGLE_AUTH_SETUP.md` - Complete setup guide
- `GOOGLE_OAUTH_FIX.md` - Error troubleshooting
- Browser console for specific errors

