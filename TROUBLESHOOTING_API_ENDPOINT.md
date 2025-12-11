# 🔧 Troubleshooting: API Endpoint Not Found

## Issue: `/api/health` Returns 404

If you're seeing `{"success":false,"message":"API endpoint not found"}` when accessing `/api/health`, here's how to fix it.

## ✅ Solution 1: Use Correct Endpoint

The health endpoint is available at:
- ✅ `/health` (works)
- ✅ `/api/health` (now added - see fix below)

**Try accessing:** `https://guru-ai.cloud/health`

## ✅ Solution 2: Check Application Status

### On Your VPS, check if the app is running:

```bash
# SSH into VPS
ssh root@31.97.232.51

# Check PM2 status
pm2 status

# Should show: kidchatbox-api (or your app name)
# Status should be: online
```

### Check if app is listening on the correct port:

```bash
# Check what port your app uses
cat .env | grep PORT
# Should show: PORT=3001 (or your port)

# Check if app is listening
sudo netstat -tlnp | grep 3001
# Should show: tcp 0 0 0.0.0.0:3001 LISTEN
```

### Check app logs:

```bash
pm2 logs kidchatbox-api
# Look for errors or startup messages
```

## ✅ Solution 3: Check Nginx Configuration

### Verify Nginx is proxying correctly:

```bash
# Check Nginx config
sudo cat /etc/nginx/sites-available/kidchatbox

# Should have:
# proxy_pass http://localhost:3001;  (or your PORT)
```

### Test Nginx configuration:

```bash
sudo nginx -t
# Should say: "syntax is ok" and "test is successful"
```

### Check Nginx status:

```bash
sudo systemctl status nginx
# Should be: active (running)
```

### Check Nginx error logs:

```bash
sudo tail -f /var/log/nginx/error.log
# Look for any errors when accessing the domain
```

## ✅ Solution 4: Verify Route Order

The issue might be that the catch-all route is intercepting API requests. I've updated the code to add `/api/health` endpoint explicitly.

**After updating the code:**

1. **Pull/update code on VPS:**
   ```bash
   cd /var/www/kidchatbox  # or your app directory
   git pull  # if using git
   # Or upload updated server/index.js
   ```

2. **Restart the app:**
   ```bash
   pm2 restart kidchatbox-api
   ```

3. **Test again:**
   - `https://guru-ai.cloud/health`
   - `https://guru-ai.cloud/api/health`

## ✅ Solution 5: Test Direct Connection

Test if the app responds directly (bypassing Nginx):

```bash
# On your VPS
curl http://localhost:3001/health
# Should return: {"status":"ok","message":"KidChatbox API is running"}

curl http://localhost:3001/api/health
# Should also work after the fix
```

If this works but the domain doesn't, the issue is with Nginx configuration.

## ✅ Solution 6: Check Environment Variables

Make sure your `.env` file has correct values:

```bash
cat .env | grep -E "PORT|NODE_ENV|VITE_FRONTEND_URL|VITE_API_BASE_URL"
```

Should show:
```
PORT=3001
NODE_ENV=production
VITE_FRONTEND_URL=https://guru-ai.cloud
VITE_API_BASE_URL=https://guru-ai.cloud/api
```

**After changing `.env`:**
```bash
# Rebuild frontend
npm run build

# Restart app
pm2 restart kidchatbox-api
```

## 🔍 Common Issues

### Issue 1: App Not Running
**Symptoms:** 502 Bad Gateway or connection refused
**Fix:**
```bash
pm2 start kidchatbox-api
# or
npm run start:pm2
```

### Issue 2: Wrong Port in Nginx
**Symptoms:** 502 Bad Gateway
**Fix:**
```bash
# Check actual port
cat .env | grep PORT

# Update Nginx config
sudo nano /etc/nginx/sites-available/kidchatbox
# Update: proxy_pass http://localhost:ACTUAL_PORT;

# Restart Nginx
sudo systemctl restart nginx
```

### Issue 3: DNS Not Updated
**Symptoms:** Can't access domain at all
**Fix:**
- Update DNS A record to `31.97.232.51`
- Wait 5-30 minutes for propagation
- Test: `nslookup guru-ai.cloud`

### Issue 4: Firewall Blocking
**Symptoms:** Connection timeout
**Fix:**
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw status
```

## 📋 Quick Diagnostic Checklist

Run these commands on your VPS:

```bash
# 1. Check app status
pm2 status

# 2. Check app logs
pm2 logs kidchatbox-api --lines 50

# 3. Check port
sudo netstat -tlnp | grep node

# 4. Test direct connection
curl http://localhost:3001/health

# 5. Check Nginx config
sudo nginx -t

# 6. Check Nginx status
sudo systemctl status nginx

# 7. Check Nginx error log
sudo tail -20 /var/log/nginx/error.log

# 8. Check environment
cat .env | grep PORT
```

## 🎯 Expected Results

After everything is configured correctly:

1. **PM2 Status:** `kidchatbox-api` should be `online`
2. **Port Check:** Should show `0.0.0.0:3001` listening
3. **Direct Test:** `curl http://localhost:3001/health` should return JSON
4. **Domain Test:** `https://guru-ai.cloud/health` should return JSON
5. **API Test:** `https://guru-ai.cloud/api/health` should return JSON

## 📞 Still Having Issues?

1. Check all logs: `pm2 logs` and `sudo tail -f /var/log/nginx/error.log`
2. Verify DNS: `nslookup guru-ai.cloud`
3. Test direct connection: `curl http://localhost:PORT/health`
4. Check firewall: `sudo ufw status`
5. Verify Nginx config: `sudo nginx -t`

---

**Quick Fix:** The code has been updated to support both `/health` and `/api/health` endpoints. After deploying the update and restarting, both should work.

