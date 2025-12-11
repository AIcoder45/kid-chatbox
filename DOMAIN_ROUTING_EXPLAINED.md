# 🌐 How Domain Routes to Localhost on VPS Server

This guide explains how your domain (e.g., `guru-ai.cloud`) connects to your Node.js application running on `localhost:3001` (or any port) on your VPS server.

## 🔄 The Complete Flow

```
Internet User
    ↓
    ↓ (DNS Lookup)
    ↓
Domain (guru-ai.cloud) → Points to → Server IP (e.g., 123.45.67.89)
    ↓
    ↓ (Port 80/443 - HTTP/HTTPS)
    ↓
Nginx (Reverse Proxy) → Listens on port 80/443
    ↓
    ↓ (Forwards to localhost:3001)
    ↓
Node.js App → Running on localhost:3001 (or 0.0.0.0:3001)
```

## 📋 Step-by-Step Explanation

### Step 1: DNS Configuration
**What happens:** When someone visits `guru-ai.cloud`, DNS resolves it to your server's IP address.

**How to configure:**
1. Go to your domain registrar (where you bought `guru-ai.cloud`)
2. Set **A Record**:
   ```
   Type: A
   Name: @ (or guru-ai.cloud)
   Value: YOUR_SERVER_IP (e.g., 123.45.67.89)
   TTL: 3600
   ```
3. Optional - Add **CNAME** for `www`:
   ```
   Type: CNAME
   Name: www
   Value: guru-ai.cloud
   ```

### Step 2: Nginx Reverse Proxy (The Bridge)
**What happens:** Nginx receives requests on port 80 (HTTP) and 443 (HTTPS), then forwards them to your Node.js app.

**Why Nginx?**
- ✅ Handles SSL/HTTPS certificates
- ✅ Routes domain requests to correct port
- ✅ Can serve static files efficiently
- ✅ Provides security and load balancing

**Nginx Configuration:**

Create/edit: `/etc/nginx/sites-available/kidchatbox`

```nginx
server {
    listen 80;
    server_name guru-ai.cloud www.guru-ai.cloud;

    # Redirect HTTP to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;

    # Forward all requests to Node.js app
    location / {
        proxy_pass http://localhost:3001;  # ← This is the key!
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Key Point:** `proxy_pass http://localhost:3001;` tells Nginx to forward requests to your Node.js app running on port 3001.

### Step 3: Node.js Application Binding
**What happens:** Your Node.js app listens on `0.0.0.0:3001` (not `127.0.0.1:3001`).

**Why `0.0.0.0` instead of `localhost`?**
- `0.0.0.0` = Listen on ALL network interfaces (accepts connections from anywhere)
- `localhost`/`127.0.0.1` = Only accepts connections from the same machine

**Your server code (already configured correctly):**
```javascript
// server/index.js line 127
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

✅ **This is already correct in your code!** Your app listens on `0.0.0.0`, so Nginx can connect to it.

## 🔧 Complete Setup Instructions

### 1. Install Nginx (if not installed)
```bash
sudo apt update
sudo apt install -y nginx
```

### 2. Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/kidchatbox
```

Paste this configuration (update with your domain and port):

```nginx
server {
    listen 80;
    server_name guru-ai.cloud www.guru-ai.cloud;

    # Forward to Node.js app
    location / {
        proxy_pass http://localhost:3001;  # Change 3001 to your PORT
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Important:** Change `3001` to match your `PORT` environment variable (check your `.env` file).

### 3. Enable the Site
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/kidchatbox /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 4. Check Your Node.js Port
```bash
# Check your .env file
cat .env | grep PORT

# Or check PM2 status
pm2 status
```

Make sure Nginx `proxy_pass` port matches your Node.js `PORT`.

### 5. Setup SSL (HTTPS)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d guru-ai.cloud -d www.guru-ai.cloud

# Auto-renewal test
sudo certbot renew --dry-run
```

After SSL setup, Certbot will automatically update your Nginx config to use HTTPS.

## 🔍 Troubleshooting

### Domain Not Working?

1. **Check DNS:**
   ```bash
   # Test DNS resolution
   nslookup guru-ai.cloud
   # Should show your server IP
   ```

2. **Check Nginx Status:**
   ```bash
   sudo systemctl status nginx
   sudo nginx -t  # Test configuration
   ```

3. **Check Node.js App:**
   ```bash
   pm2 status
   pm2 logs
   # Verify app is running on correct port
   ```

4. **Check Port Binding:**
   ```bash
   # See what's listening on ports
   sudo netstat -tlnp | grep :3001
   # or
   sudo ss -tlnp | grep :3001
   ```

5. **Check Firewall:**
   ```bash
   # Allow HTTP/HTTPS
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw status
   ```

### Common Issues

**Issue:** "502 Bad Gateway"
- **Cause:** Node.js app not running or wrong port
- **Fix:** 
  ```bash
  pm2 restart kidchatbox
  # Verify port in .env matches Nginx proxy_pass
  ```

**Issue:** "Connection refused"
- **Cause:** App listening on `localhost` instead of `0.0.0.0`
- **Fix:** Already fixed! Your code uses `0.0.0.0` ✅

**Issue:** "Domain not resolving"
- **Cause:** DNS not configured or not propagated
- **Fix:** Wait 24-48 hours for DNS propagation, or check DNS settings

## 📊 Visual Summary

```
┌─────────────────────────────────────────────────────────┐
│                    INTERNET USER                        │
│              Types: guru-ai.cloud                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    DNS SERVER                           │
│         Resolves: guru-ai.cloud → 123.45.67.89         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              YOUR VPS SERVER (123.45.67.89)              │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Nginx (Port 80/443)                            │   │
│  │  - Receives: guru-ai.cloud requests             │   │
│  │  - Forwards to: localhost:3001                  │   │
│  └──────────────┬───────────────────────────────────┘   │
│                 │                                        │
│                 ▼                                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Node.js App (Port 3001)                         │   │
│  │  - Listening on: 0.0.0.0:3001                    │   │
│  │  - Accepts connections from Nginx                │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## ✅ Quick Checklist

- [ ] DNS A record points to server IP
- [ ] Nginx installed and running
- [ ] Nginx config created with correct domain and port
- [ ] Nginx site enabled
- [ ] Node.js app running on correct port (check `.env`)
- [ ] Node.js app listening on `0.0.0.0` (already done ✅)
- [ ] Firewall allows ports 80 and 443
- [ ] SSL certificate installed (for HTTPS)

## 🎯 Key Takeaways

1. **DNS** → Points domain to server IP
2. **Nginx** → Receives domain requests, forwards to `localhost:PORT`
3. **Node.js** → Listens on `0.0.0.0:PORT` to accept Nginx connections
4. **Port Mapping:** Domain (port 80/443) → Nginx → Node.js (port 3001)

**Remember:** `localhost:3001` in Nginx config means "on this server, port 3001" - it's internal to the server, not accessible from outside!

---

**Need Help?** Check:
- `HOSTINGER_DEPLOYMENT.md` - Full deployment guide
- `DOMAIN_MIGRATION_GUIDE.md` - Domain migration steps

