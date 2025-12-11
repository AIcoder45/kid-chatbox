# 🚀 Deploy KidChatbox to Existing VPS with Node.js App

This guide helps you deploy KidChatbox on your Hostinger VPS (`31.97.232.51`) where you already have a Node.js app running.

## 📋 Current Situation

- **VPS IP:** `31.97.232.51`
- **Domain:** `guru-ai.cloud`
- **Current DNS A Record:** `84.32.84.32` ❌ (needs update)
- **KidChatbox Port:** `3001` (default)
- **Existing App:** Unknown port (need to check)

## 🔍 Step 1: Check Existing App Configuration

SSH into your VPS and check what's currently running:

```bash
ssh root@31.97.232.51
# or
ssh username@31.97.232.51
```

### Check Running Node.js Apps

```bash
# Check PM2 processes
pm2 list

# Check what ports are in use
sudo netstat -tlnp | grep node
# or
sudo ss -tlnp | grep node

# Check Nginx configuration
sudo ls -la /etc/nginx/sites-enabled/
sudo cat /etc/nginx/sites-enabled/*

# Check environment variables of existing app
pm2 env <existing-app-name>
```

**Important:** Note down:
- What port your existing app uses (e.g., 3000, 3001, 8080)
- What domain/subdomain it's configured for
- PM2 process name

## 🎯 Step 2: Decide Deployment Strategy

### Option A: Replace Existing App (Recommended if domain is free)

If `guru-ai.cloud` is not being used by the existing app:

1. **Stop existing app:**
   ```bash
   pm2 stop <existing-app-name>
   # Or stop all
   pm2 stop all
   ```

2. **Deploy KidChatbox on port 3001** (default)

3. **Update Nginx to point to KidChatbox**

### Option B: Run Both Apps (Different Ports/Domains)

If you need both apps running:

1. **Keep existing app on its current port** (e.g., 3000)
2. **Deploy KidChatbox on port 3001**
3. **Configure Nginx to route:**
   - `guru-ai.cloud` → KidChatbox (port 3001)
   - `existing-domain.com` → Existing app (its port)

## 📦 Step 3: Deploy KidChatbox Application

### 3.1 Clone/Upload Application

```bash
# Navigate to your preferred directory
cd /var/www  # or /home/username or wherever you keep apps
mkdir -p kidchatbox
cd kidchatbox

# If using Git:
git clone <your-repo-url> .

# Or upload files via SFTP/SCP
```

### 3.2 Install Dependencies

```bash
cd /var/www/kidchatbox  # or your app directory
npm install
```

### 3.3 Create Environment File

```bash
nano .env
```

**Copy this template and update with your values:**

```env
# Database Configuration
DATABASE_CLIENT=postgres
DATABASE_HOST=your-remote-postgres-host.com  # or IP
DATABASE_PORT=5432
DATABASE_NAME=kidchatbox
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_SSL=false  # Set to 'true' for remote connections with SSL

# Server Configuration
PORT=3001  # ← KidChatbox uses 3001 by default
NODE_ENV=production

# Security - Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
JWT_SECRET=your-production-jwt-secret-minimum-32-characters-long

# OpenAI API Key
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here

# Frontend Configuration - UPDATE WITH YOUR DOMAIN
VITE_FRONTEND_URL=https://guru-ai.cloud
VITE_API_BASE_URL=https://guru-ai.cloud/api

# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3.4 Setup Database

```bash
# Create database tables
npm run db:setup
```

### 3.5 Build Frontend

```bash
npm run build
```

### 3.6 Start with PM2

```bash
# Start KidChatbox
npm run start:pm2

# Check status
pm2 status

# View logs
pm2 logs kidchatbox-api

# Save PM2 config (auto-start on reboot)
pm2 save
pm2 startup  # Follow instructions shown
```

## 🌐 Step 4: Update DNS Record

**CRITICAL:** Update your DNS A record to point to your VPS IP.

1. **Go to your domain registrar** (where you manage `guru-ai.cloud`)
2. **Find DNS Management** for `guru-ai.cloud`
3. **Update A Record:**
   ```
   Type: A
   Name/Host: @
   Value/Data: 31.97.232.51  ← Change from 84.32.84.32
   TTL: 3600
   ```
4. **Save changes**

**Verify DNS:**
```bash
# Wait 5-10 minutes, then test
nslookup guru-ai.cloud
# Should show: 31.97.232.51
```

## 🔧 Step 5: Configure Nginx

### 5.1 Check Current Nginx Config

```bash
# List enabled sites
sudo ls -la /etc/nginx/sites-enabled/

# View existing configs
sudo cat /etc/nginx/sites-enabled/default
sudo cat /etc/nginx/sites-enabled/* 2>/dev/null
```

### 5.2 Create KidChatbox Nginx Config

```bash
sudo nano /etc/nginx/sites-available/kidchatbox
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    server_name guru-ai.cloud www.guru-ai.cloud;

    # Redirect HTTP to HTTPS (uncomment after SSL setup)
    # return 301 https://$server_name$request_uri;

    # Forward all requests to KidChatbox
    location / {
        proxy_pass http://localhost:3001;  # ← KidChatbox port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3001/health;
        proxy_set_header Host $host;
    }
}
```

### 5.3 Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/kidchatbox /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# If test passes, restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
```

### 5.4 Handle Multiple Apps (If Needed)

If you're running both apps, you can:

**Option 1: Different Domains**
- Create separate Nginx configs for each domain
- Each points to different port

**Option 2: Subdomain**
- `guru-ai.cloud` → KidChatbox (port 3001)
- `app.guru-ai.cloud` → Existing app (its port)

Example for subdomain:
```nginx
# /etc/nginx/sites-available/kidchatbox
server {
    listen 80;
    server_name guru-ai.cloud www.guru-ai.cloud;
    # ... KidChatbox config ...
}

# /etc/nginx/sites-available/existing-app
server {
    listen 80;
    server_name app.guru-ai.cloud;
    location / {
        proxy_pass http://localhost:3000;  # Existing app port
        # ... proxy settings ...
    }
}
```

## 🔒 Step 6: Setup SSL Certificate

```bash
# Install Certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate for guru-ai.cloud
sudo certbot --nginx -d guru-ai.cloud -d www.guru-ai.cloud

# Test auto-renewal
sudo certbot renew --dry-run
```

After SSL setup, Certbot will automatically:
- Update Nginx config to use HTTPS
- Add redirect from HTTP to HTTPS

## ✅ Step 7: Verify Deployment

### Check Application

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs kidchatbox-api

# Check if app is listening
sudo netstat -tlnp | grep 3001
# Should show: tcp 0 0 0.0.0.0:3001 LISTEN
```

### Test Domain

1. **Wait for DNS propagation** (5-30 minutes)
2. **Visit:** `http://guru-ai.cloud` (should load KidChatbox)
3. **Check API:** `http://guru-ai.cloud/api/health` (should return `{"status":"ok"}`)
4. **After SSL:** `https://guru-ai.cloud`

### Check Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

## 🔥 Step 8: Configure Firewall

```bash
# Allow HTTP, HTTPS (SSH should already be allowed)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status

# Enable if not already enabled
sudo ufw enable
```

## 🔍 Troubleshooting

### Port Conflict

If port 3001 is already in use:

**Option 1:** Change KidChatbox port
```bash
# Edit .env
nano .env
# Change: PORT=3002  # or any free port

# Update ecosystem.config.js
nano ecosystem.config.js
# Change PORT: 3002

# Update Nginx proxy_pass
sudo nano /etc/nginx/sites-available/kidchatbox
# Change: proxy_pass http://localhost:3002;

# Restart everything
pm2 restart kidchatbox-api
sudo systemctl restart nginx
```

**Option 2:** Stop conflicting app
```bash
pm2 stop <conflicting-app-name>
```

### DNS Not Updating

```bash
# Check DNS resolution
nslookup guru-ai.cloud
dig guru-ai.cloud

# Clear local DNS cache (on your computer)
# Windows: ipconfig /flushdns
# Mac/Linux: sudo dscacheutil -flushcache
```

### 502 Bad Gateway

```bash
# Check if app is running
pm2 status

# Check app logs
pm2 logs kidchatbox-api

# Check Nginx error log
sudo tail -f /var/log/nginx/error.log

# Verify port matches
# Nginx proxy_pass port = .env PORT = ecosystem.config.js PORT
```

### CORS Errors

```bash
# Verify VITE_FRONTEND_URL in .env matches your domain
cat .env | grep VITE_FRONTEND_URL

# Should be: VITE_FRONTEND_URL=https://guru-ai.cloud

# Rebuild after changing .env
npm run build
pm2 restart kidchatbox-api
```

## 📝 Summary Checklist

- [ ] Checked existing app port and configuration
- [ ] Decided deployment strategy (replace or run alongside)
- [ ] Cloned/uploaded KidChatbox to VPS
- [ ] Installed dependencies (`npm install`)
- [ ] Created `.env` file with correct values
- [ ] Updated DNS A record to `31.97.232.51`
- [ ] Setup database (`npm run db:setup`)
- [ ] Built frontend (`npm run build`)
- [ ] Started app with PM2 (`npm run start:pm2`)
- [ ] Created Nginx config for `guru-ai.cloud`
- [ ] Enabled Nginx site
- [ ] Tested Nginx config (`sudo nginx -t`)
- [ ] Restarted Nginx
- [ ] Setup SSL certificate
- [ ] Configured firewall
- [ ] Tested domain access
- [ ] Verified API endpoints

## 🎯 Quick Reference

**VPS Details:**
- IP: `31.97.232.51`
- Hostname: `srv1132778.hstgr.cloud`

**KidChatbox:**
- Port: `3001`
- PM2 Name: `kidchatbox-api`
- Domain: `guru-ai.cloud`

**Important Commands:**
```bash
# View logs
pm2 logs kidchatbox-api

# Restart app
pm2 restart kidchatbox-api

# Check status
pm2 status

# Nginx test
sudo nginx -t

# Nginx restart
sudo systemctl restart nginx

# Check ports
sudo netstat -tlnp | grep node
```

---

**Need Help?** Check:
- `DOMAIN_ROUTING_EXPLAINED.md` - How domain routing works
- `HOSTINGER_DEPLOYMENT.md` - Full deployment guide
- `DOMAIN_MIGRATION_GUIDE.md` - Domain migration steps

