/**
 * Create PostgreSQL Database
 * Usage: node create-database.js
 * 
 * This script creates the database if it doesn't exist.
 * It connects to the default 'postgres' database first, then creates the target database.
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Get database configuration
const dbConfig = {
  host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '5432', 10),
  user: process.env.DATABASE_USERNAME || process.env.DB_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || 'postgres',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

const dbName = process.env.DATABASE_NAME || process.env.DB_NAME || 'kidchatboxdb';

async function createDatabase() {
  console.log('🔍 Creating PostgreSQL Database...\n');
  console.log('Configuration:');
  console.log(`  Host: ${dbConfig.host}`);
  console.log(`  Port: ${dbConfig.port}`);
  console.log(`  User: ${dbConfig.user}`);
  console.log(`  Database to create: ${dbName}`);
  console.log('');

  // Connect to default 'postgres' database to create new database
  const adminPool = new Pool({
    ...dbConfig,
    database: 'postgres', // Connect to default postgres database
  });

  let client;
  try {
    client = await adminPool.connect();
    console.log('✅ Connected to PostgreSQL server\n');

    // Check if database already exists
    const checkResult = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (checkResult.rows.length > 0) {
      console.log(`ℹ️  Database '${dbName}' already exists`);
      console.log('   No action needed.\n');
      
      // Verify we can connect to it
      client.release();
      await adminPool.end();
      
      const testPool = new Pool({
        ...dbConfig,
        database: dbName,
      });
      
      try {
        const testClient = await testPool.connect();
        console.log(`✅ Successfully connected to database '${dbName}'`);
        testClient.release();
        await testPool.end();
        process.exit(0);
      } catch (err) {
        console.error(`❌ Cannot connect to existing database: ${err.message}`);
        process.exit(1);
      }
    } else {
      // Create the database
      console.log(`📦 Creating database '${dbName}'...`);
      
      // Note: CREATE DATABASE cannot be run in a transaction
      await client.query(`CREATE DATABASE ${dbName}`);
      
      console.log(`✅ Database '${dbName}' created successfully!\n`);
      
      client.release();
      await adminPool.end();
      
      // Test connection to the new database
      console.log('🔍 Testing connection to new database...');
      const testPool = new Pool({
        ...dbConfig,
        database: dbName,
      });
      
      try {
        const testClient = await testPool.connect();
        console.log(`✅ Successfully connected to database '${dbName}'`);
        
        // Get database info
        const dbInfo = await testClient.query('SELECT current_database(), current_user, version();');
        console.log('\n📊 Database Information:');
        console.log(`  Database: ${dbInfo.rows[0].current_database}`);
        console.log(`  User: ${dbInfo.rows[0].current_user}`);
        console.log(`  PostgreSQL Version: ${dbInfo.rows[0].version.split(',')[0]}`);
        
        testClient.release();
        await testPool.end();
        
        console.log('\n✅ Database creation completed successfully!');
        console.log(`\n💡 Next step: Run 'npm run db:setup' to create tables in the database.`);
        process.exit(0);
      } catch (err) {
        console.error(`❌ Cannot connect to new database: ${err.message}`);
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('\n❌ Error creating database:');
    console.error(`   ${error.message}\n`);

    // Provide helpful error messages
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Suggestions:');
      console.log('   - Check if PostgreSQL is running');
      console.log('   - Verify DATABASE_HOST is correct in .env file');
      console.log('   - Check if port is correct (default: 5432)');
    } else if (error.code === '28P01') {
      console.log('💡 Suggestions:');
      console.log('   - Check DATABASE_USERNAME and DATABASE_PASSWORD in .env file');
      console.log('   - Verify user has permission to create databases');
      console.log('   - Try: psql -U postgres -c "\\du" to list users');
    } else if (error.code === '42501') {
      console.log('💡 Suggestions:');
      console.log('   - User does not have permission to create databases');
      console.log('   - Connect as superuser (postgres) to create database');
      console.log('   - Or grant CREATEDB privilege: ALTER USER username CREATEDB;');
    } else {
      console.log('💡 Check your .env file configuration');
      console.log('   Required: DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD');
    }

    if (client) {
      client.release();
    }
    await adminPool.end();
    process.exit(1);
  }
}

createDatabase();

