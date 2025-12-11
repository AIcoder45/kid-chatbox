/**
 * Database migration for Scheduled Tests system
 * Creates scheduled_tests table for quiz scheduling with users based on plans
 */

const { pool } = require('../config/database');

const migrateScheduledTests = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Scheduled tests table
    await client.query(`
      CREATE TABLE IF NOT EXISTS scheduled_tests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
        scheduled_by UUID NOT NULL REFERENCES users(id),
        scheduled_for TIMESTAMP NOT NULL,
        visible_from TIMESTAMP NOT NULL,
        visible_until TIMESTAMP,
        duration_minutes INTEGER,
        plan_ids UUID[] DEFAULT ARRAY[]::UUID[],
        user_ids UUID[] DEFAULT ARRAY[]::UUID[],
        status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
        instructions TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add new columns to existing table if migration is run again
    await client.query(`
      ALTER TABLE scheduled_tests
      ADD COLUMN IF NOT EXISTS visible_from TIMESTAMP,
      ADD COLUMN IF NOT EXISTS visible_until TIMESTAMP,
      ADD COLUMN IF NOT EXISTS duration_minutes INTEGER
    `);

    // Update existing records: set visible_from = scheduled_for if null
    await client.query(`
      UPDATE scheduled_tests
      SET visible_from = scheduled_for
      WHERE visible_from IS NULL
    `);

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_scheduled_tests_quiz_id ON scheduled_tests(quiz_id);
      CREATE INDEX IF NOT EXISTS idx_scheduled_tests_scheduled_by ON scheduled_tests(scheduled_by);
      CREATE INDEX IF NOT EXISTS idx_scheduled_tests_scheduled_for ON scheduled_tests(scheduled_for);
      CREATE INDEX IF NOT EXISTS idx_scheduled_tests_status ON scheduled_tests(status);
    `);

    await client.query('COMMIT');
    console.log('✅ Scheduled tests table created successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating scheduled tests table:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run migration if called directly
if (require.main === module) {
  migrateScheduledTests()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateScheduledTests };

