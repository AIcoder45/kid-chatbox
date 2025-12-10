# 🌐 Remote PostgreSQL Database Setup Guide

This guide helps you configure your application to use a remote PostgreSQL database server instead of installing PostgreSQL locally on Hostinger.

## 📋 Prerequisites

- Remote PostgreSQL server (already running)
- Database credentials (host, port, username, password)
- Network access from Hostinger server to remote PostgreSQL server

## 🔧 Step 1: Configure Remote PostgreSQL Server

### Allow Remote Connections

On your **remote PostgreSQL server**, you need to allow connections from your Hostinger server:

1. **Edit PostgreSQL configuration file:**
   ```bash
   # Find postgresql.conf location
   sudo find / -name postgresql.conf
   
   # Usually located at:
   # Ubuntu/Debian: /etc/postgresql/[version]/main/postgresql.conf
   # CentOS/RHEL: /var/lib/pgsql/data/postgresql.conf
   
   sudo nano /etc/postgresql/14/main/postgresql.conf
   ```

2. **Update listen_addresses:**
   ```conf
   # Change from:
   listen_addresses = 'localhost'
   
   # To:
   listen_addresses = '*'  # Listen on all interfaces
   # Or specific IP: listen_addresses = 'YOUR_HOSTINGER_IP'
   ```

3. **Edit pg_hba.conf (Host-Based Authentication):**
   ```bash
   sudo nano /etc/postgresql/14/main/pg_hba.conf
   ```

4. **Add entry to allow Hostinger server:**
   ```conf
   # Add this line (replace YOUR_HOSTINGER_IP with actual IP)
   host    all    all    YOUR_HOSTINGER_IP/32    md5
   
   # Or allow from any IP (less secure):
   host    all    all    0.0.0.0/0    md5
   ```

5. **Restart PostgreSQL:**
   ```bash
   sudo systemctl restart postgresql
   ```

### Configure Firewall

On your **remote PostgreSQL server**, allow port 5432:

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow from YOUR_HOSTINGER_IP to any port 5432

# Or allow from any IP (less secure)
sudo ufw allow 5432/tcp

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="YOUR_HOSTINGER_IP" port port="5432" protocol="tcp" accept'
sudo firewall-cmd --reload
```

## 🗄️ Step 2: Create Database and User (on Remote Server)

Connect to your remote PostgreSQL server and create the database:

```bash
# SSH to remote PostgreSQL server
ssh user@your-remote-postgres-server

# Connect to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE kidchatbox;

# Create user (or use existing user)
CREATE USER kidchatbox_user WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE kidchatbox TO kidchatbox_user;

# Grant schema privileges (PostgreSQL 15+)
\c kidchatbox
GRANT ALL ON SCHEMA public TO kidchatbox_user;

# Exit
\q
```

## ✅ Step 3: Test Connection from Hostinger Server

On your **Hostinger server**, test the connection:

```bash
# Install PostgreSQL client (for testing)
sudo apt install -y postgresql-client

# Test connection
psql -h YOUR_REMOTE_DB_HOST -p 5432 -U kidchatbox_user -d kidchatbox

# If successful, you'll see:
# kidchatbox=>
# Type \q to exit
```

**If connection fails, check:**
- Firewall rules on remote server
- PostgreSQL is listening on correct interface
- pg_hba.conf allows your Hostinger IP
- Credentials are correct

## 🔐 Step 4: Configure Application Environment

On your **Hostinger server**, update `.env` file:

```bash
cd /var/www/kidchatbox
nano .env
```

Set these values:

```env
# Remote Database Configuration
DB_HOST=your-remote-postgres-host.com  # or IP address
DB_PORT=5432
DB_NAME=kidchatbox
DB_USER=kidchatbox_user
DB_PASSWORD=your_secure_password
```

## 🚀 Step 5: Initialize Database Tables

On your **Hostinger server**, run:

```bash
cd /var/www/kidchatbox
npm run db:setup
```

This will create all required tables on your remote database.

## 🔍 Troubleshooting

### Connection Timeout

**Problem:** Can't connect to remote PostgreSQL

**Solutions:**
1. Check if PostgreSQL is listening:
   ```bash
   # On remote PostgreSQL server
   sudo netstat -tulpn | grep 5432
   ```

2. Verify firewall allows connection:
   ```bash
   # Test from Hostinger server
   telnet YOUR_REMOTE_DB_HOST 5432
   ```

3. Check PostgreSQL logs:
   ```bash
   # On remote PostgreSQL server
   sudo tail -f /var/log/postgresql/postgresql-*.log
   ```

### Authentication Failed

**Problem:** Wrong username/password

**Solutions:**
1. Verify credentials:
   ```bash
   psql -h YOUR_REMOTE_DB_HOST -U kidchatbox_user -d kidchatbox
   ```

2. Reset password (on remote server):
   ```sql
   ALTER USER kidchatbox_user WITH PASSWORD 'new_password';
   ```

### Permission Denied

**Problem:** User doesn't have CREATE TABLE permission

**Solutions:**
```sql
-- On remote PostgreSQL server
GRANT ALL PRIVILEGES ON DATABASE kidchatbox TO kidchatbox_user;
\c kidchatbox
GRANT ALL ON SCHEMA public TO kidchatbox_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO kidchatbox_user;
```

## 🔒 Security Best Practices

1. **Use strong passwords** for database users
2. **Restrict IP access** in pg_hba.conf (don't use 0.0.0.0/0)
3. **Use SSL connections** if possible:
   ```env
   DB_SSL=true
   ```
4. **Regular backups** of remote database
5. **Monitor connection logs** for suspicious activity

## 📊 Connection String Format

If you need to use a connection string instead:

```env
DATABASE_URL=postgresql://kidchatbox_user:password@your-remote-host.com:5432/kidchatbox
```

## ✅ Verification Checklist

- [ ] Remote PostgreSQL allows connections from Hostinger IP
- [ ] Firewall allows port 5432
- [ ] Database `kidchatbox` exists on remote server
- [ ] User has proper permissions
- [ ] Connection test succeeds from Hostinger server
- [ ] `.env` file has correct remote database credentials
- [ ] `npm run db:setup` completes successfully

## 🎉 Success!

Your application is now configured to use a remote PostgreSQL database!

