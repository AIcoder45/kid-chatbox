# ✅ Quick Deployment Checklist

Use this checklist when deploying KidChatbox to your existing VPS.

## 🔍 Pre-Deployment Checks

- [ ] **SSH into VPS:** `ssh root@31.97.232.51`
- [ ] **Check existing apps:** `pm2 list`
- [ ] **Check ports in use:** `sudo netstat -tlnp | grep node`
- [ ] **Check Nginx configs:** `sudo ls -la /etc/nginx/sites-enabled/`
- [ ] **Note existing app port:** ___________ (e.g., 3000)

## 📦 Application Setup

- [ ] **Navigate to app directory:** `cd /var/www/kidchatbox` (or your path)
- [ ] **Install dependencies:** `npm install`
- [ ] **Create `.env` file** with all required variables
- [ ] **Set PORT=3001** in `.env` (or different if 3001 is taken)
- [ ] **Set VITE_FRONTEND_URL=https://guru-ai.cloud**
- [ ] **Set VITE_API_BASE_URL=https://guru-ai.cloud/api**
- [ ] **Generate JWT_SECRET:** `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- [ ] **Setup database:** `npm run db:setup`
- [ ] **Build frontend:** `npm run build`
- [ ] **Start with PM2:** `npm run start:pm2`
- [ ] **Verify running:** `pm2 status` (should show `kidchatbox-api`)
- [ ] **Check logs:** `pm2 logs kidchatbox-api` (no errors)

## 🌐 DNS Configuration

- [ ] **Go to domain registrar** (where you manage `guru-ai.cloud`)
- [ ] **Find DNS Management**
- [ ] **Update A Record:**
  - Type: `A`
  - Name: `@`
  - Value: `31.97.232.51` ← Change from `84.32.84.32`
  - TTL: `3600`
- [ ] **Save DNS changes**
- [ ] **Wait 5-10 minutes** for DNS propagation
- [ ] **Test DNS:** `nslookup guru-ai.cloud` (should show `31.97.232.51`)

## 🔧 Nginx Configuration

- [ ] **Create config file:** `sudo nano /etc/nginx/sites-available/kidchatbox`
- [ ] **Copy config** from `nginx.kidchatbox.conf`
- [ ] **Update server_name** to `guru-ai.cloud www.guru-ai.cloud`
- [ ] **Update proxy_pass port** to match your `.env` PORT (default: 3001)
- [ ] **Enable site:** `sudo ln -s /etc/nginx/sites-available/kidchatbox /etc/nginx/sites-enabled/`
- [ ] **Test config:** `sudo nginx -t` (should say "syntax is ok")
- [ ] **Restart Nginx:** `sudo systemctl restart nginx`
- [ ] **Check status:** `sudo systemctl status nginx` (should be active)

## 🔒 SSL Certificate

- [ ] **Install Certbot:** `sudo apt install -y certbot python3-certbot-nginx`
- [ ] **Get certificate:** `sudo certbot --nginx -d guru-ai.cloud -d www.guru-ai.cloud`
- [ ] **Test renewal:** `sudo certbot renew --dry-run`
- [ ] **Verify HTTPS works:** Visit `https://guru-ai.cloud`

## 🔥 Firewall

- [ ] **Allow HTTP:** `sudo ufw allow 80/tcp`
- [ ] **Allow HTTPS:** `sudo ufw allow 443/tcp`
- [ ] **Check status:** `sudo ufw status`
- [ ] **Enable if needed:** `sudo ufw enable`

## ✅ Final Verification

- [ ] **Visit domain:** `https://guru-ai.cloud` (should load KidChatbox)
- [ ] **Check API:** `https://guru-ai.cloud/api/health` (should return `{"status":"ok"}`)
- [ ] **Test login/register** functionality
- [ ] **Check browser console** (no CORS errors)
- [ ] **Check PM2 logs:** `pm2 logs kidchatbox-api` (no errors)
- [ ] **Check Nginx logs:** `sudo tail -f /var/log/nginx/error.log` (no errors)

## 🐛 If Something Goes Wrong

### Port Conflict
```bash
# Check what's using port 3001
sudo netstat -tlnp | grep 3001

# Option 1: Change KidChatbox port
# Edit .env: PORT=3002
# Edit ecosystem.config.js: PORT: 3002
# Edit Nginx: proxy_pass http://localhost:3002;
# Restart: pm2 restart kidchatbox-api && sudo systemctl restart nginx

# Option 2: Stop conflicting app
pm2 stop <app-name>
```

### 502 Bad Gateway
```bash
# Check if app is running
pm2 status

# Check app logs
pm2 logs kidchatbox-api

# Verify port matches
cat .env | grep PORT
sudo cat /etc/nginx/sites-available/kidchatbox | grep proxy_pass
```

### DNS Not Working
```bash
# Test DNS
nslookup guru-ai.cloud
dig guru-ai.cloud

# Wait longer (up to 48 hours for full propagation)
# Check DNS settings in domain registrar
```

### CORS Errors
```bash
# Verify environment variables
cat .env | grep VITE_FRONTEND_URL
cat .env | grep VITE_API_BASE_URL

# Rebuild after changing .env
npm run build
pm2 restart kidchatbox-api
```

---

**Quick Commands Reference:**

```bash
# PM2
pm2 status
pm2 logs kidchatbox-api
pm2 restart kidchatbox-api
pm2 stop kidchatbox-api

# Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log

# Ports
sudo netstat -tlnp | grep node
sudo ss -tlnp | grep 3001

# DNS
nslookup guru-ai.cloud
dig guru-ai.cloud
```

---

**Full Guide:** See `DEPLOY_TO_EXISTING_VPS.md` for detailed instructions.

