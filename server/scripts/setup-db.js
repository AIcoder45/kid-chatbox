/**
 * Database setup script
 * Creates the database if it doesn't exist
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const adminPool = new Pool({
  host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '5432', 10),
  database: 'postgres', // Connect to default postgres database
  user: process.env.DATABASE_USERNAME || process.env.DB_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || 'postgres',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

const dbName = process.env.DATABASE_NAME || process.env.DB_NAME || 'kidchatbox';

async function setupDatabase() {
  try {
    console.log('🔍 Checking if database exists...');

    // Check if database exists
    const result = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.rows.length > 0) {
      console.log(`✅ Database '${dbName}' already exists`);
    } else {
      console.log(`📦 Creating database '${dbName}'...`);
      await adminPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database '${dbName}' created successfully!`);
    }

    // Close admin connection
    await adminPool.end();

    // Now initialize tables
    console.log('📋 Initializing database tables...');
    const { initializeDatabase } = require('../config/database');
    await initializeDatabase();
    console.log('✅ Database setup complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    
    if (error.code === '42P04') {
      console.log('ℹ️  Database already exists, continuing...');
    } else if (error.code === '28P01') {
      console.error('❌ Authentication failed. Please check your DATABASE_USERNAME and DATABASE_PASSWORD in .env');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('❌ Cannot connect to PostgreSQL. Please ensure PostgreSQL is running.');
      console.error('   Windows: Check Services or start PostgreSQL from Start Menu');
      console.error('   Mac/Linux: sudo service postgresql start');
    }
    
    process.exit(1);
  }
}

setupDatabase();

