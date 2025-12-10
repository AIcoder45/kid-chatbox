# Database Setup Guide

## Quick Setup (Recommended)

Use the automated setup script:

```bash
npm run db:setup
```

This will:
1. Check if PostgreSQL is running
2. Create the database if it doesn't exist
3. Create all required tables automatically

## Manual Setup

### Option 1: Using pgAdmin (Windows - GUI)

1. Open **pgAdmin** (comes with PostgreSQL installation)
2. Right-click on **Databases** → **Create** → **Database**
3. Name: `kidchatbox`
4. Click **Save**
5. The tables will be created automatically when you start the server

### Option 2: Using Command Line

#### Windows (PowerShell/CMD)

```bash
# Method 1: Using psql (if in PATH)
psql -U postgres -c "CREATE DATABASE kidchatbox;"

# Method 2: Using full path (if psql not in PATH)
# Find PostgreSQL installation (usually C:\Program Files\PostgreSQL\<version>\bin\psql.exe)
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE kidchatbox;"
```

#### Mac/Linux

```bash
# Start PostgreSQL service first
sudo service postgresql start

# Create database
psql -U postgres -c "CREATE DATABASE kidchatbox;"
```

### Option 3: Using SQL File

Create a file `create-db.sql`:

```sql
CREATE DATABASE kidchatbox;
```

Then run:
```bash
psql -U postgres -f create-db.sql
```

## Troubleshooting

### PostgreSQL Not Found

**Windows:**
1. Check if PostgreSQL is installed:
   - Look for "PostgreSQL" in Start Menu
   - Check Services (Win+R → services.msc) for "postgresql" service

2. If not installed:
   - Download from: https://www.postgresql.org/download/windows/
   - Use the installer (includes pgAdmin)
   - Remember the password you set during installation

3. Add PostgreSQL to PATH:
   - Add `C:\Program Files\PostgreSQL\<version>\bin` to System PATH
   - Restart terminal

**Mac:**
```bash
# Install via Homebrew
brew install postgresql@16
brew services start postgresql@16
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

### Connection Refused

1. **Check if PostgreSQL is running:**
   - Windows: Services → PostgreSQL service → Start
   - Mac/Linux: `sudo service postgresql status`

2. **Check port:**
   - Default is 5432
   - Verify in `.env`: `DB_PORT=5432`

### Authentication Failed

1. **Check credentials in `.env`:**
   ```env
   DB_USER=postgres
   DB_PASSWORD=your_actual_password
   ```

2. **Reset PostgreSQL password (Windows):**
   - Open pgAdmin
   - Right-click server → Properties → Change password

3. **Reset PostgreSQL password (Mac/Linux):**
   ```bash
   sudo -u postgres psql
   ALTER USER postgres PASSWORD 'newpassword';
   \q
   ```

### Database Already Exists

If you get "database already exists" error:
- This is fine! The setup script will skip creation
- Or drop and recreate:
  ```sql
  DROP DATABASE kidchatbox;
  CREATE DATABASE kidchatbox;
  ```

## Verify Setup

After setup, test the connection:

```bash
# Start the server
npm run dev:server

# You should see:
# ✅ Connected to PostgreSQL database
# ✅ Database tables initialized successfully
# 🚀 Server running on http://localhost:3000
```

## Environment Variables

Make sure your `.env` file has:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kidchatbox
DB_USER=postgres
DB_PASSWORD=your_password_here
```

## Next Steps

Once database is set up:
1. Start backend: `npm run dev:server`
2. Start frontend: `npm run dev`
3. Or both: `npm run dev:all`

The tables will be created automatically on first server start!

