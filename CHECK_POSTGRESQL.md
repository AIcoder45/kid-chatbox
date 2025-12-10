# 🔍 How to Check Existing PostgreSQL Database

Guide to verify and check your PostgreSQL database connection and status.

## 📋 Quick Checks

### 1. Check if PostgreSQL is Running

**On Linux/Ubuntu:**
```bash
# Check PostgreSQL service status
sudo systemctl status postgresql

# Or check if it's running
sudo systemctl is-active postgresql
```

**On Windows:**
```bash
# Check PostgreSQL service
sc query postgresql-x64-14  # Replace with your version
```

**On Mac:**
```bash
brew services list | grep postgresql
```

### 2. Test Database Connection

**From command line:**
```bash
# Basic connection test
psql -U postgres -h localhost -d postgres

# Or with specific database
psql -U your_username -h your_host -d your_database_name

# Test connection without entering interactive mode
psql -U postgres -h localhost -d postgres -c "SELECT version();"
```

**If connection succeeds, you'll see PostgreSQL prompt:**
```
postgres=#
```

**Exit:** Type `\q` and press Enter

### 3. List All Databases

```bash
# Connect to PostgreSQL
psql -U postgres -h localhost

# Then run:
\l

# Or from command line:
psql -U postgres -h localhost -c "\l"
```

### 4. Check if Specific Database Exists

```bash
# Connect and check
psql -U postgres -h localhost -c "SELECT datname FROM pg_database WHERE datname = 'kidchatbox';"
```

### 5. List All Tables in a Database

```bash
# Connect to your database
psql -U postgres -h localhost -d kidchatbox

# Then run:
\dt

# Or from command line:
psql -U postgres -h localhost -d kidchatbox -c "\dt"
```

### 6. Check Database Connection from Node.js

Create a test file `test-db.js`:

```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'kidchatbox',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    
    // Get database version
    const versionResult = await client.query('SELECT version();');
    console.log('📊 PostgreSQL Version:', versionResult.rows[0].version);
    
    // Check if database exists
    const dbResult = await client.query(
      "SELECT datname FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'kidchatbox']
    );
    
    if (dbResult.rows.length > 0) {
      console.log('✅ Database exists:', dbResult.rows[0].datname);
    } else {
      console.log('❌ Database does not exist');
    }
    
    // List tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Tables in database:');
    if (tablesResult.rows.length > 0) {
      tablesResult.rows.forEach(row => {
        console.log('  -', row.table_name);
      });
    } else {
      console.log('  (No tables found)');
    }
    
    client.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
}

testConnection();
```

**Run it:**
```bash
node test-db.js
```

## 🔧 Common Connection Issues

### Issue 1: Connection Refused

**Error:** `connection refused` or `could not connect to server`

**Solutions:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL if not running
sudo systemctl start postgresql

# Check if PostgreSQL is listening on port 5432
sudo netstat -tulpn | grep 5432
# Or
sudo ss -tulpn | grep 5432
```

### Issue 2: Authentication Failed

**Error:** `password authentication failed`

**Solutions:**
```bash
# Reset PostgreSQL password
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD 'new_password';
\q

# Or create a new user
sudo -u postgres createuser --interactive your_username
```

### Issue 3: Database Does Not Exist

**Error:** `database "kidchatbox" does not exist`

**Solution:**
```bash
# Create database
sudo -u postgres psql
CREATE DATABASE kidchatbox;
\q
```

### Issue 4: Permission Denied

**Error:** `permission denied for schema public`

**Solution:**
```bash
sudo -u postgres psql -d kidchatbox
GRANT ALL ON SCHEMA public TO your_username;
GRANT ALL PRIVILEGES ON DATABASE kidchatbox TO your_username;
\q
```

## 📊 Useful PostgreSQL Commands

### Connect to Database
```bash
psql -U username -h hostname -d database_name
```

### Inside psql (Interactive Mode):

```sql
-- List all databases
\l

-- Connect to a database
\c database_name

-- List all tables
\dt

-- Describe a table structure
\d table_name

-- List all users
\du

-- Show current database
SELECT current_database();

-- Show current user
SELECT current_user;

-- Show all tables with row counts
SELECT 
  schemaname,
  tablename,
  n_live_tup as row_count
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;

-- Exit psql
\q
```

## 🧪 Test Connection with Your .env Settings

**Create test script `check-db-connection.sh`:**

```bash
#!/bin/bash

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

echo "🔍 Testing PostgreSQL Connection..."
echo "Host: $DB_HOST"
echo "Port: $DB_PORT"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo ""

# Test connection
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT version();" 2>&1

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Connection successful!"
  
  # List tables
  echo ""
  echo "📋 Tables in database:"
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\dt"
else
  echo ""
  echo "❌ Connection failed!"
  echo "Check your .env file settings and PostgreSQL server status."
fi
```

**Make it executable and run:**
```bash
chmod +x check-db-connection.sh
./check-db-connection.sh
```

## 🔐 Check Remote PostgreSQL Connection

**If using remote PostgreSQL:**

```bash
# Test connection to remote server
psql -h your-remote-host.com -p 5432 -U your_username -d kidchatbox

# Test if port is accessible
telnet your-remote-host.com 5432
# Or
nc -zv your-remote-host.com 5432

# Test with timeout
timeout 5 bash -c "</dev/tcp/your-remote-host.com/5432" && echo "Port is open" || echo "Port is closed"
```

## ✅ Quick Verification Checklist

Run these commands to verify everything:

```bash
# 1. Check PostgreSQL is running
sudo systemctl status postgresql

# 2. Test connection
psql -U postgres -h localhost -c "SELECT version();"

# 3. Check if database exists
psql -U postgres -h localhost -c "SELECT datname FROM pg_database WHERE datname = 'kidchatbox';"

# 4. Check tables (if database exists)
psql -U postgres -h localhost -d kidchatbox -c "\dt"

# 5. Test with your .env credentials
# (Update with your actual values)
psql -h YOUR_DB_HOST -p YOUR_DB_PORT -U YOUR_DB_USER -d YOUR_DB_NAME -c "SELECT 1;"
```

## 🎯 For Your Application

**Test connection using your application's database config:**

```bash
cd /var/www/kidchatbox

# Make sure .env file exists with correct values
cat .env | grep DB_

# Test connection using Node.js script (create test-db.js from above)
node test-db.js

# Or use the database setup script
npm run db:setup
```

## 📝 Common Questions

**Q: How do I find my PostgreSQL password?**
- Check your `.env` file: `cat .env | grep DB_PASSWORD`
- If forgotten, reset it: `sudo -u postgres psql` then `ALTER USER username WITH PASSWORD 'newpass';`

**Q: How do I find PostgreSQL port?**
- Default is 5432
- Check: `sudo netstat -tulpn | grep postgres`
- Or check config: `sudo grep port /etc/postgresql/*/main/postgresql.conf`

**Q: How do I check PostgreSQL version?**
```bash
psql --version
# Or
psql -U postgres -c "SELECT version();"
```

**Q: How do I see all users?**
```bash
psql -U postgres -c "\du"
```

