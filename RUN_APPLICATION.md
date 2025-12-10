# How to Run the Entire Application

## Quick Start (All-in-One)

```bash
npm run dev:all
```

This starts both frontend and backend simultaneously.

## Step-by-Step Setup

### 1. Install PostgreSQL (if not installed)

**Windows:**
- Download: https://www.postgresql.org/download/windows/
- Run installer, remember the password you set

**Mac:**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

### 2. Create Database

**Option A: Automated (Recommended)**
```bash
npm run db:setup
```

**Option B: Using pgAdmin (Windows GUI)**
1. Open pgAdmin
2. Right-click "Databases" → "Create" → "Database"
3. Name: `kidchatbox`
4. Click "Save"

**Option C: Command Line**
```bash
# Windows
psql -U postgres -c "CREATE DATABASE kidchatbox;"

# Mac/Linux
sudo -u postgres psql -c "CREATE DATABASE kidchatbox;"
```

### 3. Configure Environment

1. Copy `.env.example` to `.env`
2. Update these values:
   ```env
   # Database (use the password you set during PostgreSQL installation)
   DB_PASSWORD=your_postgres_password

   # OpenAI (get from https://platform.openai.com/api-keys)
   VITE_OPENAI_API_KEY=your_openai_api_key

   # Google OAuth (optional - see GOOGLE_AUTH_SETUP.md)
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

### 4. Start Application

**Option 1: Run Both Together**
```bash
npm run dev:all
```

**Option 2: Run Separately**
```bash
# Terminal 1 - Backend API
npm run dev:server

# Terminal 2 - Frontend
npm run dev
```

### 5. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## First Time Setup Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `kidchatbox` created
- [ ] `.env` file configured with:
  - [ ] Database password
  - [ ] OpenAI API key
  - [ ] Google Client ID (optional)
- [ ] Dependencies installed (`npm install`)
- [ ] Backend server starts without errors
- [ ] Frontend loads in browser

## Troubleshooting

### Backend Won't Start

**Error: "Cannot connect to PostgreSQL"**
- Check if PostgreSQL service is running
- Verify database credentials in `.env`
- Try: `npm run db:setup`

**Error: "Database does not exist"**
- Run: `npm run db:setup`
- Or create manually using pgAdmin

**Error: "Port 3000 already in use"**
- Change `PORT=3001` in `.env`
- Update `VITE_API_BASE_URL=http://localhost:3001/api`

### Frontend Won't Connect to Backend

- Verify backend is running on port 3000
- Check `VITE_API_BASE_URL` in `.env`
- Restart frontend after changing `.env`

### Google Login Not Working

- See `GOOGLE_AUTH_SETUP.md` for setup instructions
- Verify `VITE_GOOGLE_CLIENT_ID` in `.env`
- Check browser console for errors

## Testing the Application

1. **Register a new account:**
   - Go to http://localhost:5173
   - Click "Sign Up"
   - Fill in details and create account

2. **Login:**
   - Use email/password or Google login
   - Should redirect to dashboard

3. **Take a Quiz:**
   - Click "Quiz Mode" on dashboard
   - Select subject and subtopic
   - Answer 15 questions
   - View results

4. **Study Mode:**
   - Click "Study Mode" on dashboard
   - Select topic
   - Read lesson
   - Optionally take quiz

## Production Build

```bash
# Build frontend
npm run build

# Start backend (production mode)
NODE_ENV=production npm run dev:server
```

Frontend build will be in `dist/` folder.

