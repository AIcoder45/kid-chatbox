-- Grant permissions to greenwood user for kidchatboxdb database
-- Run this as postgres user: psql -f grant-permissions.sql

-- Connect to the database
\c kidchatboxdb

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON DATABASE kidchatboxdb TO greenwood;

-- Grant usage and create on the public schema
GRANT USAGE ON SCHEMA public TO greenwood;
GRANT CREATE ON SCHEMA public TO greenwood;

-- Grant all privileges on all tables in public schema (for existing tables)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO greenwood;

-- Grant all privileges on all sequences in public schema
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO greenwood;

-- Set default privileges for future tables and sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO greenwood;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO greenwood;

-- Verify permissions
\du greenwood

