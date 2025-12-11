/**
 * Migration script for Study Library Content table
 * Supports file uploads (PPT, PDF, Text) with publish dates
 */

const { pool } = require('../config/database');

const migrateStudyLibraryContent = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create study_library_content table
    await client.query(`
      CREATE TABLE IF NOT EXISTS study_library_content (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('ppt', 'pdf', 'text')),
        file_url TEXT,
        file_name VARCHAR(255),
        file_size INTEGER,
        text_content TEXT,
        subject VARCHAR(100),
        age_group VARCHAR(50),
        difficulty VARCHAR(50),
        language VARCHAR(50) DEFAULT 'English',
        publish_date TIMESTAMP,
        is_published BOOLEAN DEFAULT false,
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        view_count INTEGER DEFAULT 0
      )
    `);

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_study_library_content_content_type 
      ON study_library_content(content_type)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_study_library_content_publish_date 
      ON study_library_content(publish_date)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_study_library_content_is_published 
      ON study_library_content(is_published)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_study_library_content_subject 
      ON study_library_content(subject)
    `);

    await client.query('COMMIT');
    console.log('✅ Study Library Content table created successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating Study Library Content table:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run migration if called directly
if (require.main === module) {
  migrateStudyLibraryContent()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateStudyLibraryContent };

