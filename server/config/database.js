/**
 * PostgreSQL database configuration and connection
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'kidchatbox',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
  process.exit(-1);
});

// Initialize database tables
const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        age INTEGER,
        grade VARCHAR(50),
        preferred_language VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create quiz_results table
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        subject VARCHAR(100) NOT NULL,
        subtopic TEXT NOT NULL,
        age INTEGER NOT NULL,
        language VARCHAR(50) NOT NULL,
        correct_count INTEGER NOT NULL,
        wrong_count INTEGER NOT NULL,
        explanation_of_mistakes TEXT,
        time_taken INTEGER NOT NULL,
        score_percentage DECIMAL(5,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create quiz_answers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_answers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        quiz_result_id UUID NOT NULL REFERENCES quiz_results(id) ON DELETE CASCADE,
        question_number INTEGER NOT NULL,
        question TEXT NOT NULL,
        child_answer VARCHAR(1),
        correct_answer VARCHAR(1) NOT NULL,
        explanation TEXT NOT NULL,
        is_correct BOOLEAN NOT NULL,
        options JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add options column if it doesn't exist (for existing databases)
    await client.query(`
      ALTER TABLE quiz_answers 
      ADD COLUMN IF NOT EXISTS options JSONB
    `);

    // Create study_sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS study_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        subject VARCHAR(100) NOT NULL,
        topic TEXT NOT NULL,
        age INTEGER NOT NULL,
        language VARCHAR(50) NOT NULL,
        difficulty VARCHAR(50) NOT NULL,
        lesson_title TEXT NOT NULL,
        lesson_introduction TEXT NOT NULL,
        lesson_explanation JSONB NOT NULL,
        lesson_key_points JSONB NOT NULL,
        lesson_examples JSONB NOT NULL,
        lesson_summary TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
      CREATE INDEX IF NOT EXISTS idx_quiz_results_timestamp ON quiz_results(timestamp);
      CREATE INDEX IF NOT EXISTS idx_quiz_answers_quiz_result_id ON quiz_answers(quiz_result_id);
      CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_study_sessions_timestamp ON study_sessions(timestamp);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  initializeDatabase,
};

