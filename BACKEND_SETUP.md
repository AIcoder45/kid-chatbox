# Backend Setup Guide

## Quick Start

1. **Install PostgreSQL** (if not already installed)
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Create Database**
   ```bash
   # Start PostgreSQL service
   # Windows: Start PostgreSQL service from Services
   # Mac/Linux: sudo service postgresql start

   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE kidchatbox;

   # Exit
   \q
   ```

3. **Install Backend Dependencies**
   ```bash
   npm install
   ```

4. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Update database credentials in `.env`

5. **Start Backend Server**
   ```bash
   npm run dev:server
   ```

6. **Start Frontend** (in another terminal)
   ```bash
   npm run dev
   ```

   Or run both together:
   ```bash
   npm run dev:all
   ```

## Database Connection

The backend will automatically create all required tables on first startup.

If you need to reset the database:

```sql
-- Connect to PostgreSQL
psql -U postgres -d kidchatbox

-- Drop all tables (WARNING: This deletes all data!)
DROP TABLE IF EXISTS quiz_answers CASCADE;
DROP TABLE IF EXISTS quiz_results CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Exit and restart server to recreate tables
\q
```

## Environment Variables

Required environment variables in `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kidchatbox
DB_USER=postgres
DB_PASSWORD=your_password

# Server
PORT=3000
NODE_ENV=development

# Security
JWT_SECRET=your-secret-key-change-in-production

# Frontend API URL
VITE_API_BASE_URL=http://localhost:3000/api
```

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database `kidchatbox` exists

### Port Already in Use
- Change `PORT` in `.env` to a different port (e.g., 3001)
- Update `VITE_API_BASE_URL` in frontend `.env` accordingly

### Tables Not Created
- Check database connection logs
- Manually run table creation SQL from `server/config/database.js`


