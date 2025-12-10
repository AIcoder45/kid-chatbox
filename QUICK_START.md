# Quick Start Guide

## Step 1: Install PostgreSQL

### Windows
1. Download from: https://www.postgresql.org/download/windows/
2. Run the installer
3. Remember the password you set for `postgres` user
4. PostgreSQL service should start automatically

### Mac
```bash
brew install postgresql@16
brew services start postgresql@16
```

### Linux
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

## Step 2: Configure Environment

1. Copy `.env.example` to `.env`
2. Update database password:
   ```env
   DB_PASSWORD=your_postgres_password_here
   ```

## Step 3: Setup Database (Choose ONE method)

### Method 1: Automated Script (Easiest) ⭐
```bash
npm run db:setup
```

### Method 2: Using pgAdmin (Windows GUI)
1. Open **pgAdmin** from Start Menu
2. Right-click **Databases** → **Create** → **Database**
3. Name: `kidchatbox`
4. Click **Save**

### Method 3: Command Line
```bash
# Windows (PowerShell)
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE kidchatbox;"

# Mac/Linux
psql -U postgres -c "CREATE DATABASE kidchatbox;"
```

**If psql command not found:**
- Windows: Use full path or add PostgreSQL bin to PATH
- Mac/Linux: Make sure PostgreSQL is installed and running

## Step 4: Start the Application

```bash
# Start both frontend and backend
npm run dev:all
```

Or separately:
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend  
npm run dev
```

## Step 5: Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## Troubleshooting

### "psql: command not found"
- **Windows**: Use pgAdmin GUI instead (Method 2)
- Or find psql.exe in: `C:\Program Files\PostgreSQL\<version>\bin\`
- Add that folder to your System PATH

### "Connection refused" or "Cannot connect"
1. Check if PostgreSQL is running:
   - Windows: Services → PostgreSQL → Start
   - Mac: `brew services list`
   - Linux: `sudo service postgresql status`

2. Verify credentials in `.env` match your PostgreSQL setup

### "Database already exists"
- This is fine! Just proceed to start the server
- The tables will be created automatically

### Still having issues?
See `DATABASE_SETUP.md` for detailed troubleshooting.

