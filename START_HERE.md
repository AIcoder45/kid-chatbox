# 🚀 Start Here - Complete Setup Guide

## Quick Start (3 Steps)

### Step 1: Install PostgreSQL

**Windows:**
1. Download: https://www.postgresql.org/download/windows/
2. Run installer
3. Remember the password you set for `postgres` user

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

### Step 2: Setup Environment

1. Create `.env` file in root directory:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=kidchatbox
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password_here

   # Server
   PORT=3000
   JWT_SECRET=your-secret-key-change-this

   # OpenAI
   VITE_OPENAI_API_KEY=your_openai_api_key_here

   # Frontend API
   VITE_API_BASE_URL=http://localhost:3000/api

   # Google OAuth (Optional - see below)
   VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   ```

2. Create database:
   ```bash
   npm run db:setup
   ```
   
   Or manually using pgAdmin (Windows):
   - Open pgAdmin → Right-click "Databases" → Create → Database
   - Name: `kidchatbox`

### Step 3: Run Application

```bash
npm run dev:all
```

This starts both frontend and backend!

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

---

## Google OAuth Setup (Optional)

### 1. Get Google Client ID

1. Go to: https://console.cloud.google.com/
2. Create project: "KidChatbox"
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Configure OAuth consent screen:
   - User Type: External
   - App name: KidChatbox
   - Add your email as test user
6. Create OAuth Client:
   - Type: Web application
   - Authorized origins: `http://localhost:5173`
   - Authorized redirects: `http://localhost:5173`
7. Copy the Client ID

### 2. Add to .env

```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
```

### 3. Restart Application

```bash
npm run dev:all
```

Google login button will now work!

---

## Troubleshooting

### "Cannot connect to PostgreSQL"
- Check if PostgreSQL service is running
- Verify password in `.env` matches PostgreSQL password
- Try: `npm run db:setup`

### "Database does not exist"
- Run: `npm run db:setup`
- Or create manually in pgAdmin

### "Port 3000 already in use"
- Change `PORT=3001` in `.env`
- Update `VITE_API_BASE_URL=http://localhost:3001/api`

### Google Login Not Working
- Verify `VITE_GOOGLE_CLIENT_ID` in `.env`
- Check authorized origins include `http://localhost:5173`
- Restart dev server after changing `.env`

---

## First Time User Flow

1. **Register**: Create account with email/password or Google
2. **Dashboard**: See Study and Quiz options
3. **Study Mode**: Learn topics with interactive lessons
4. **Quiz Mode**: Take 15-question quizzes
5. **Results**: View scores, explanations, and improvement tips

---

## Need Help?

- **Database Setup**: See `DATABASE_SETUP.md`
- **Google OAuth**: See `GOOGLE_AUTH_SETUP.md`
- **API Docs**: See `API_DOCUMENTATION.md`
- **Backend Setup**: See `BACKEND_SETUP.md`


