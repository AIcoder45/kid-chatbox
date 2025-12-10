# Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (or select existing)
   - Click "Select a project" → "New Project"
   - Name: "KidChatbox"
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure OAuth consent screen:
     - User Type: External
     - App name: KidChatbox
     - User support email: your email
     - Developer contact: your email
     - Click "Save and Continue"
     - Scopes: Add `email`, `profile`, `openid`
     - Click "Save and Continue"
     - Test users: Add your email (for testing)
     - Click "Save and Continue"

5. **Create OAuth Client ID**
   - Application type: **Web application**
   - Name: KidChatbox Web Client
   - Authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://localhost:3000`
     - Your production domain (when deployed)
   - Authorized redirect URIs:
     - `http://localhost:5173`
     - Your production domain (when deployed)
   - Click "Create"
   - **Copy the Client ID** (you'll need this)

## Step 2: Configure Frontend

1. **Update `.env` file:**
   ```env
   VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   ```

2. **Update `index.html`** (already done):
   ```html
   <script src="https://accounts.google.com/gsi/client" async defer></script>
   ```

## Step 3: Update Login Component

The Login component is already set up to use Google Sign-In. It will:
- Load Google Sign-In script automatically
- Show "Continue with Google" button
- Handle the OAuth flow
- Send token to backend

## Step 4: Backend Verification (Optional - For Production)

For production, verify Google tokens on the backend:

```bash
npm install google-auth-library
```

Then update `server/routes/auth.js`:

```javascript
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// In /google route:
const ticket = await client.verifyIdToken({
  idToken: googleToken,
  audience: process.env.GOOGLE_CLIENT_ID,
});
const payload = ticket.getPayload();
```

## Testing

1. Start the application:
   ```bash
   npm run dev:all
   ```

2. Go to login page
3. Click "Continue with Google"
4. Select your Google account
5. You should be logged in!

## Troubleshooting

### "Google Sign-In script failed to load"
- Check internet connection
- Verify script tag in `index.html`
- Check browser console for errors

### "Invalid client ID"
- Verify `VITE_GOOGLE_CLIENT_ID` in `.env`
- Make sure authorized origins include `http://localhost:5173`
- Restart dev server after changing `.env`

### "Access blocked"
- Add your email as a test user in OAuth consent screen
- Or publish the app (for production)

## Production Deployment

When deploying:
1. Add production domain to authorized origins
2. Update `VITE_GOOGLE_CLIENT_ID` in production `.env`
3. Enable backend token verification
4. Update OAuth consent screen with production URLs

