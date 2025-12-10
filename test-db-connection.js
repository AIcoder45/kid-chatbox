/**
 * Test PostgreSQL Database Connection
 * Usage: node test-db-connection.js
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const pool = new Pool({
  host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '5432', 10),
  database: process.env.DATABASE_NAME || process.env.DB_NAME || 'kidchatbox',
  user: process.env.DATABASE_USERNAME || process.env.DB_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || 'postgres',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 5000,
});

async function testConnection() {
  console.log('🔍 Testing PostgreSQL Connection...\n');
  console.log('Configuration:');
  console.log(`  Host: ${process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost'}`);
  console.log(`  Port: ${process.env.DATABASE_PORT || process.env.DB_PORT || '5432'}`);
  console.log(`  Database: ${process.env.DATABASE_NAME || process.env.DB_NAME || 'kidchatbox'}`);
  console.log(`  User: ${process.env.DATABASE_USERNAME || process.env.DB_USER || 'postgres'}`);
  console.log(`  SSL: ${process.env.DATABASE_SSL || 'false'}`);
  console.log('');

  let client;
  try {
    // Test connection
    client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL database\n');

    // Get PostgreSQL version
    const versionResult = await client.query('SELECT version();');
    console.log('📊 PostgreSQL Version:');
    console.log(`  ${versionResult.rows[0].version.split(',')[0]}\n`);

    // Check current database
    const dbResult = await client.query('SELECT current_database(), current_user;');
    console.log('📋 Current Connection:');
    console.log(`  Database: ${dbResult.rows[0].current_database}`);
    console.log(`  User: ${dbResult.rows[0].current_user}\n`);

    // Check if database exists
    const dbName = process.env.DATABASE_NAME || process.env.DB_NAME || 'kidchatbox';
    const dbExistsResult = await client.query(
      'SELECT datname FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (dbExistsResult.rows.length > 0) {
      console.log(`✅ Database '${dbName}' exists\n`);
    } else {
      console.log(`❌ Database '${dbName}' does NOT exist\n`);
    }

    // List all tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('📋 Tables in database:');
    if (tablesResult.rows.length > 0) {
      tablesResult.rows.forEach((row, index) => {
        console.log(`  ${index + 1}. ${row.table_name}`);
      });
    } else {
      console.log('  (No tables found - database is empty)');
    }

    // Check table row counts
    if (tablesResult.rows.length > 0) {
      console.log('\n📊 Table Row Counts:');
      for (const row of tablesResult.rows) {
        try {
          const countResult = await client.query(
            `SELECT COUNT(*) as count FROM ${row.table_name}`
          );
          console.log(`  ${row.table_name}: ${countResult.rows[0].count} rows`);
        } catch (err) {
          console.log(`  ${row.table_name}: (unable to count)`);
        }
      }
    }

    console.log('\n✅ Database connection test completed successfully!');
    client.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database connection error:');
    console.error(`   ${error.message}\n`);

    // Provide helpful error messages
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Suggestions:');
      console.log('   - Check if PostgreSQL is running: sudo systemctl status postgresql');
      console.log('   - Verify DB_HOST is correct in .env file');
      console.log('   - Check if port is correct (default: 5432)');
    } else if (error.code === '28P01') {
      console.log('💡 Suggestions:');
      console.log('   - Check DB_USER and DB_PASSWORD in .env file');
      console.log('   - Verify user exists: psql -U postgres -c "\\du"');
    } else if (error.code === '3D000') {
      console.log('💡 Suggestions:');
      console.log('   - Database does not exist');
      console.log('   - Create it: CREATE DATABASE kidchatbox;');
    } else {
      console.log('💡 Check your .env file configuration');
      console.log('   Required: DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD');
      console.log('   Or legacy: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD');
    }

    if (client) {
      client.release();
    }
    await pool.end();
    process.exit(1);
  }
}

testConnection();

