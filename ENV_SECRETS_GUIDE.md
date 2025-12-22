# Environment Variables & Secrets Guide

## 🔐 What Should Be in `.env`?

### ✅ YES - Put These in `.env`:

1. **Database Password** (`DB_PASSWORD`)
   - ⚠️ **SECRET** - Never commit to git
   - Your PostgreSQL password (set during installation)

2. **JWT Secret** (`JWT_SECRET`)
   - ⚠️ **SECRET** - Never commit to git
   - Used to sign authentication tokens
   - Generate a random string (see below)

3. **OpenAI API Key** (`VITE_OPENAI_API_KEY`)
   - ⚠️ **SECRET** - Never commit to git
   - Get from: https://platform.openai.com/api-keys
   - Note: Has `VITE_` prefix (exposed to frontend), but still keep secret!

4. **Google Client ID** (`VITE_GOOGLE_CLIENT_ID`)
   - ✅ **PUBLIC** - Safe to expose (OAuth Client IDs are public)
   - But keep in `.env` for organization
   - Get from: https://console.cloud.google.com/

5. **API Base URL** (`VITE_API_BASE_URL`)
   - ✅ **PUBLIC** - Not a secret
   - But keep in `.env` for easy configuration

### ❌ NO - Don't Put These in `.env`:

- Source code
- Database schema files
- Configuration files (they're already in the repo)

## 🔑 How to Generate JWT_SECRET

### Option 1: Using OpenSSL (Recommended)
```bash
openssl rand -base64 32
```

### Option 2: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Option 3: Online Generator
- Visit: https://randomkeygen.com/
- Use "CodeIgniter Encryption Keys" (256-bit)

### Option 4: Simple Random String
Any random string works, but longer is better:
```
my-super-secret-jwt-key-12345-change-in-production
```

**Minimum length**: 32 characters recommended

## 📝 Example `.env` File

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kidchatbox
DB_USER=postgres
DB_PASSWORD=MySecurePassword123!  # ⚠️ SECRET

# Server
PORT=3000
JWT_SECRET=aB3xK9mP2qR7tY5vW8zA1cD4fG6hJ0lN3oQ6sU9wX2yZ5bE8dH1jK4mP7rT0uV3  # ⚠️ SECRET

# OpenAI
VITE_OPENAI_API_KEY=sk-proj-abc123xyz789...  # ⚠️ SECRET

# Frontend
VITE_API_BASE_URL=http://localhost:3000/api  # Public

# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com  # Public
```

## 🛡️ Security Best Practices

### ✅ DO:
1. ✅ Keep `.env` in `.gitignore` (already done)
2. ✅ Use different secrets for development and production
3. ✅ Never share `.env` file via email/chat
4. ✅ Rotate secrets if accidentally exposed
5. ✅ Use strong, random JWT secrets

### ❌ DON'T:
1. ❌ Commit `.env` to git
2. ❌ Share `.env` file publicly
3. ❌ Use the same secrets in dev and production
4. ❌ Use simple passwords like "password123"
5. ❌ Hardcode secrets in source code

## 🔍 Verify `.env` is Ignored

Check `.gitignore` includes:
```
.env
.env.local
.env.production
```

Verify with:
```bash
git status
# Should NOT show .env file
```

## 🚀 Production Setup

For production, use:
1. **Environment variables** in your hosting platform:
   - Vercel: Project Settings → Environment Variables
   - Heroku: `heroku config:set KEY=value`
   - AWS: Use Secrets Manager or Parameter Store
   - Docker: Use `-e` flags or `.env` file

2. **Never** commit production secrets to git

## 📋 Checklist

- [ ] `.env` file created from `.env.example`
- [ ] `DB_PASSWORD` set (your PostgreSQL password)
- [ ] `JWT_SECRET` generated (random 32+ character string)
- [ ] `VITE_OPENAI_API_KEY` set (from OpenAI dashboard)
- [ ] `VITE_GOOGLE_CLIENT_ID` set (optional, from Google Cloud Console)
- [ ] `.env` is in `.gitignore` (already done)
- [ ] `.env` NOT committed to git

## 🆘 If Secrets Are Exposed

1. **Immediately rotate** the exposed secret
2. **Update** `.env` file with new secret
3. **Check** git history if accidentally committed
4. **Revoke** API keys if exposed
5. **Regenerate** JWT secret

## 💡 Quick Reference

| Variable | Type | Where to Get |
|----------|------|--------------|
| `DB_PASSWORD` | Secret | Set during PostgreSQL installation |
| `JWT_SECRET` | Secret | Generate random string (see above) |
| `VITE_OPENAI_API_KEY` | Secret | https://platform.openai.com/api-keys |
| `VITE_GOOGLE_CLIENT_ID` | Public | https://console.cloud.google.com/ |
| `VITE_API_BASE_URL` | Public | Your API endpoint URL |


