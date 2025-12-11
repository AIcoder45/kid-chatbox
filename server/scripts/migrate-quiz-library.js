/**
 * Quiz Library Migration
 * Creates quiz_library table for storing reusable quiz sets with tags
 */

const { pool } = require('../config/database');

const migrateQuizLibrary = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create quiz_library table
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_library (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        subject VARCHAR(100) NOT NULL,
        subtopics TEXT[] DEFAULT '{}',
        difficulty VARCHAR(50) NOT NULL,
        age_group INTEGER,
        language VARCHAR(50),
        question_count INTEGER NOT NULL,
        time_limit INTEGER,
        grade_level VARCHAR(50),
        exam_style VARCHAR(100),
        tags TEXT[] DEFAULT '{}',
        questions JSONB NOT NULL,
        created_by UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        usage_count INTEGER DEFAULT 0,
        last_used_at TIMESTAMP
      )
    `);

    // Create index on tags for faster search
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_quiz_library_tags ON quiz_library USING GIN(tags)
    `);

    // Create index on subject for faster filtering
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_quiz_library_subject ON quiz_library(subject)
    `);

    // Create index on difficulty
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_quiz_library_difficulty ON quiz_library(difficulty)
    `);

    // Create index on is_active for filtering active quizzes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_quiz_library_active ON quiz_library(is_active)
    `);

    // Create quiz_library_usage table to track which users used which quizzes
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_library_usage (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        quiz_library_id UUID NOT NULL REFERENCES quiz_library(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        score_percentage DECIMAL(5,2),
        time_taken INTEGER,
        UNIQUE(quiz_library_id, user_id, used_at)
      )
    `);

    // Create index on quiz_library_usage for faster queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_quiz_library_usage_quiz ON quiz_library_usage(quiz_library_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_quiz_library_usage_user ON quiz_library_usage(user_id)
    `);

    await client.query('COMMIT');
    console.log('✅ Quiz Library migration completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Quiz Library migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run migration if called directly
if (require.main === module) {
  migrateQuizLibrary()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateQuizLibrary };

