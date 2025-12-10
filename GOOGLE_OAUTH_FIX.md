# Fixing Google OAuth Errors

## Common Errors and Solutions

### Error 1: "ERR_FAILED" / Network Error

**Cause**: CORS configuration issue or Google Client ID not properly configured.

**Solution**:
1. Verify Google Client ID in `.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   ```

2. Check authorized origins in Google Cloud Console:
   - Must include: `http://localhost:5173`
   - Must include: `http://localhost:3000`

3. Restart dev server after changing `.env`

### Error 2: "Server did not send the correct CORS headers"

**Cause**: Backend CORS configuration.

**Solution**: Already fixed in `server/index.js` - CORS now allows:
- `http://localhost:5173`
- `http://localhost:3000`
- Credentials enabled

### Error 3: "FedCM get() rejects" / IdentityCredentialError

**Cause**: Google Sign-In configuration or browser compatibility issue.

**Solutions**:

#### Option A: Use Standard OAuth Flow (Recommended)

Instead of Google One Tap, use the standard OAuth redirect flow:

1. **Update Google OAuth Settings**:
   - In Google Cloud Console → Credentials
   - Edit your OAuth Client
   - Add to **Authorized redirect URIs**:
     - `http://localhost:5173/auth/google/callback`

2. **Create OAuth Redirect Handler** (simpler approach):
   - Use `window.location.href` to redirect to Google
   - Handle callback on your backend
   - Redirect back to frontend with token

#### Option B: Fix Current Implementation

1. **Verify OAuth Consent Screen**:
   - Go to Google Cloud Console
   - APIs & Services → OAuth consent screen
   - Ensure it's published (or add test users)
   - Scopes: `email`, `profile`, `openid`

2. **Check Browser**:
   - Use Chrome/Edge (best compatibility)
   - Clear browser cache
   - Try incognito mode

3. **Verify Client ID Format**:
   - Should be: `123456789-abc123.apps.googleusercontent.com`
   - No spaces or extra characters

## Quick Fix: Simplified Google Login

If errors persist, use this simplified approach:

1. **Remove Google Sign-In script from `index.html`** (temporarily)
2. **Use email/password login** (works without Google)
3. **Add Google OAuth later** once basic setup works

## Testing Google OAuth

1. **Check if Google script loads**:
   - Open browser console
   - Type: `window.google`
   - Should show Google object

2. **Verify Client ID**:
   - Check `.env` file
   - Restart server: `npm run dev:all`

3. **Test in Incognito**:
   - Sometimes browser extensions block OAuth
   - Try incognito/private window

## Alternative: Skip Google OAuth for Now

The application works perfectly with email/password login. You can:

1. Use email/password registration and login
2. Add Google OAuth later when needed
3. All other features work without Google OAuth

## Still Having Issues?

1. Check browser console for detailed errors
2. Verify `.env` file has correct `VITE_GOOGLE_CLIENT_ID`
3. Ensure Google Cloud Console settings match
4. Try a different browser
5. Check if any browser extensions are blocking OAuth

