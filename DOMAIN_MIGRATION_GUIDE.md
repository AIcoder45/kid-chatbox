# 🌐 Domain Migration Guide - Moving from guru-ai.cloud

This guide will help you migrate your KidChatbox application from `guru-ai.cloud` to your new domain on Hostinger.

## ✅ Step 1: Update Environment Variables

### On Your Hostinger Server

1. **SSH into your Hostinger server** and navigate to your application directory:
   ```bash
   cd /path/to/your/kidchatbox/app
   ```

2. **Edit your `.env` file**:
   ```bash
   nano .env
   ```

3. **Update the following environment variables** with your new domain:

   ```env
   # Replace 'yourdomain.com' with your actual Hostinger domain
   VITE_FRONTEND_URL=https://guru-ai.cloud
   VITE_API_BASE_URL=https://api.guru-ai.cloud/api
   ```

   **Example:**
   ```env
   VITE_FRONTEND_URL=https://kidchatbox.com
   VITE_API_BASE_URL=https://kidchatbox.com/api
   ```

4. **Save and exit** (Ctrl+X, then Y, then Enter)

### Important Notes:
- ✅ **No hardcoded URLs found**: Your application uses environment variables, which is the correct approach!
- ✅ **CORS is configured**: The server automatically adds `VITE_FRONTEND_URL` to allowed origins
- ✅ **API endpoints**: All API calls use `VITE_API_BASE_URL` from environment variables

## ✅ Step 2: Update Google OAuth Configuration

If you're using Google OAuth, you need to update your Google Cloud Console settings:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Navigate to**: APIs & Services → Credentials
3. **Edit your OAuth 2.0 Client ID**
4. **Update Authorized JavaScript origins**:
   - Remove: `https://guru-ai.cloud`
   - Add: `https://yourdomain.com` (your new domain)
5. **Update Authorized redirect URIs**:
   - Remove: `https://guru-ai.cloud`
   - Add: `https://yourdomain.com` (your new domain)
6. **Save changes**

## ✅ Step 3: Rebuild and Restart Application

After updating environment variables:

```bash
# Stop the current application
pm2 stop kidchatbox || npm run stop:pm2

# Rebuild the frontend with new environment variables
npm run build

# Restart the application
pm2 restart kidchatbox || npm run start:pm2
```

## ✅ Step 4: Verify Domain Configuration

### Check Frontend:
1. Visit `https://yourdomain.com` - should load the application
2. Check browser console for any CORS errors
3. Verify API calls are going to `https://yourdomain.com/api`

### Check Backend:
1. Visit `https://yourdomain.com/api/health` - should return `{"status":"ok"}`
2. Check server logs for any errors:
   ```bash
   pm2 logs kidchatbox
   ```

## ✅ Step 5: Update DNS Records (if needed)

If you haven't already configured DNS:

1. **In Hostinger Control Panel**:
   - Go to DNS Management
   - Ensure A record points to your server IP
   - Ensure CNAME records are correct

2. **SSL Certificate**:
   - Hostinger usually provides free SSL certificates
   - Ensure HTTPS is enabled in your hosting settings

## ✅ Step 6: Test All Features

After migration, test the following:

- [ ] User registration
- [ ] User login
- [ ] Google OAuth (if enabled)
- [ ] API endpoints
- [ ] Quiz functionality
- [ ] Study mode
- [ ] Admin portal (if applicable)

## 🔍 Troubleshooting

### CORS Errors
If you see CORS errors:
1. Verify `VITE_FRONTEND_URL` matches your actual domain (no trailing slash)
2. Check server logs: `pm2 logs kidchatbox`
3. Restart the server after updating `.env`

### API Not Working
1. Verify `VITE_API_BASE_URL` is set correctly
2. Check that the API route `/api` is accessible
3. Verify server is running: `pm2 status`

### Environment Variables Not Updating
1. Make sure to rebuild after changing `.env`:
   ```bash
   npm run build
   ```
2. Restart PM2:
   ```bash
   pm2 restart kidchatbox
   ```

## 📝 Summary of Changes Made

✅ **Branding Updated**:
- Changed "GuruAI" to "KidChatbox" in all constants
- Updated `APP_CONSTANTS.BRAND_NAME`
- Updated `LOGIN_CONSTANTS.BRAND_NAME`
- Updated `REGISTER_CONSTANTS.BRAND_NAME`
- Updated Header and Footer components

✅ **No Hardcoded URLs Found**:
- All URLs use environment variables (`VITE_API_BASE_URL`, `VITE_FRONTEND_URL`)
- CORS configuration automatically includes your domain

## 🎯 Next Steps

1. Update `.env` file on Hostinger with your new domain
2. Update Google OAuth settings (if applicable)
3. Rebuild and restart the application
4. Test all functionality
5. Update any external services that reference the old domain

---

**Need Help?** Check the main deployment guide: `HOSTINGER_DEPLOYMENT.md`

