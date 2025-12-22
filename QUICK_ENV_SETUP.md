# Quick .env Setup Guide

## Step 1: Create `.env` File

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Or create manually:
```bash
# Windows PowerShell
Copy-Item .env.example .env

# Mac/Linux
cp .env.example .env
```

## Step 2: Fill in Required Values

Open `.env` and update these values:

### 🔴 REQUIRED (Must Fill):

```env
# 1. Database Password (from PostgreSQL installation)
DB_PASSWORD=your_postgres_password_here

# 2. JWT Secret (generate random string - see below)
JWT_SECRET=generate-random-string-here

# 3. OpenAI API Key (get from https://platform.openai.com/api-keys)
VITE_OPENAI_API_KEY=sk-your_key_here
```

### 🟡 OPTIONAL (Can Skip for Now):

```env
# Google OAuth (optional - can add later)
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

## Step 3: Generate JWT_SECRET

**Quick Method** (any of these):

```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online
# Visit: https://randomkeygen.com/
# Copy a "CodeIgniter Encryption Keys" (256-bit)
```

**Simple Method** (if above don't work):
Just use any long random string:
```
my-super-secret-jwt-key-12345-change-in-production-xyz789
```

## Step 4: Verify Setup

Your `.env` should look like:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kidchatbox
DB_USER=postgres
DB_PASSWORD=MyPassword123!          # ⚠️ Your actual password

PORT=3000
JWT_SECRET=aB3xK9mP2qR7tY5vW8zA1cD4fG6hJ0lN3oQ6sU9wX2yZ5bE8dH1jK4mP7rT0uV3  # ⚠️ Generated secret

VITE_OPENAI_API_KEY=sk-proj-abc123xyz789...  # ⚠️ Your OpenAI key
VITE_API_BASE_URL=http://localhost:3000/api

VITE_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com  # Optional
```

## Step 5: Test

Start the application:
```bash
npm run dev:all
```

If you see errors about missing environment variables, check your `.env` file.

## ⚠️ Important Security Notes

1. ✅ `.env` is already in `.gitignore` - **NEVER commit it**
2. ✅ Use different secrets for development and production
3. ✅ Never share your `.env` file
4. ✅ Keep secrets private

## 🆘 Troubleshooting

**"Cannot find .env file"**
- Make sure `.env` exists in the root directory
- Check spelling: `.env` not `env` or `.env.txt`

**"Database connection failed"**
- Check `DB_PASSWORD` matches your PostgreSQL password
- Verify PostgreSQL is running

**"JWT_SECRET not set"**
- Make sure `JWT_SECRET` has a value
- Restart server after changing `.env`

**"OpenAI API error"**
- Verify `VITE_OPENAI_API_KEY` starts with `sk-`
- Check API key is valid at https://platform.openai.com/api-keys


