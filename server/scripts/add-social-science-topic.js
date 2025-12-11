/**
 * Script to add Social Science topic with Transport and Communication subtopics
 * Usage: node server/scripts/add-social-science-topic.js [admin-email]
 * 
 * This script creates:
 * - Topic: Social Science
 * - Subtopic: Transport
 * - Subtopic: Communication
 * 
 * All with detailed descriptions for OpenAI quiz generation
 */

const { pool } = require('../config/database');
const dotenv = require('dotenv');

dotenv.config();

const addSocialScienceTopic = async (adminEmail) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get admin user ID (optional - if not provided, use first admin or system)
    let adminUserId = null;
    if (adminEmail) {
      const userResult = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
      if (userResult.rows.length > 0) {
        adminUserId = userResult.rows[0].id;
        console.log(`✅ Found admin user: ${adminEmail}`);
      } else {
        console.log(`⚠️  Admin user ${adminEmail} not found. Using system user.`);
      }
    }

    // If no admin user found, try to get any admin user
    if (!adminUserId) {
      const adminRoleResult = await client.query(
        `SELECT u.id FROM users u 
         INNER JOIN user_roles ur ON u.id = ur.user_id 
         INNER JOIN roles r ON ur.role_id = r.id 
         WHERE r.name = 'admin' 
         LIMIT 1`
      );
      if (adminRoleResult.rows.length > 0) {
        adminUserId = adminRoleResult.rows[0].id;
        console.log(`✅ Using existing admin user`);
      }
    }

    // Check if Social Science topic already exists
    const existingTopic = await client.query(
      "SELECT id FROM topics WHERE title ILIKE '%social science%' OR category = 'Social Science'"
    );

    let topicId;

    if (existingTopic.rows.length > 0) {
      topicId = existingTopic.rows[0].id;
      console.log(`⚠️  Social Science topic already exists. Updating...`);
      
      // Update existing topic
      await client.query(
        `UPDATE topics 
         SET title = $1, 
             description = $2, 
             category = $3,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $4`,
        [
          'Social Science',
          'Social Science explores how people interact with each other and their environment. It includes understanding communities, cultures, history, geography, economics, and civic responsibilities. This subject helps children understand the world around them and their place in society.',
          'Social Science',
          topicId
        ]
      );
      console.log(`✅ Updated Social Science topic`);
    } else {
      // Create Social Science topic
      const topicResult = await client.query(
        `INSERT INTO topics (
          title, description, age_group, difficulty_level, category, created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id`,
        [
          'Social Science',
          'Social Science explores how people interact with each other and their environment. It includes understanding communities, cultures, history, geography, economics, and civic responsibilities. This subject helps children understand the world around them and their place in society.',
          '6-14', // All age groups
          'medium',
          'Social Science',
          adminUserId
        ]
      );
      topicId = topicResult.rows[0].id;
      console.log(`✅ Created Social Science topic (ID: ${topicId})`);
    }

    // Add Transport subtopic
    const transportDescription = `Transport refers to the movement of people, animals, and goods from one place to another. It includes various modes like road transport (cars, buses, bicycles), rail transport (trains), water transport (ships, boats), and air transport (airplanes, helicopters). Understanding transport helps children learn about connectivity, infrastructure, environmental impact, and how societies function. Key concepts include different types of vehicles, their uses, safety rules, and how transport has evolved over time.`;

    const existingTransport = await client.query(
        'SELECT id FROM subtopics WHERE topic_id = $1 AND title ILIKE $2',
        [topicId, '%transport%']
      );

    if (existingTransport.rows.length > 0) {
      await client.query(
        `UPDATE subtopics 
         SET title = $1, 
             description = $2, 
             difficulty_level = $3,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $4`,
        ['Transport', transportDescription, 'medium', existingTransport.rows[0].id]
      );
      console.log(`✅ Updated Transport subtopic`);
    } else {
      await client.query(
        `INSERT INTO subtopics (
          topic_id, title, description, difficulty_level, order_index, created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [topicId, 'Transport', transportDescription, 'medium', 1, adminUserId]
      );
      console.log(`✅ Created Transport subtopic`);
    }

    // Add Communication subtopic
    const communicationDescription = `Communication is the process of exchanging information, ideas, thoughts, and feelings between people. It includes verbal communication (speaking, listening), written communication (letters, emails, messages), non-verbal communication (body language, gestures), and modern digital communication (phones, internet, social media). Understanding communication helps children learn about expressing themselves clearly, understanding others, different communication methods, and how technology has changed how we connect. Key concepts include effective listening, clear speaking, writing skills, and respectful communication.`;

    const existingCommunication = await client.query(
        'SELECT id FROM subtopics WHERE topic_id = $1 AND title ILIKE $2',
        [topicId, '%communication%']
      );

    if (existingCommunication.rows.length > 0) {
      await client.query(
        `UPDATE subtopics 
         SET title = $1, 
             description = $2, 
             difficulty_level = $3,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $4`,
        ['Communication', communicationDescription, 'medium', existingCommunication.rows[0].id]
      );
      console.log(`✅ Updated Communication subtopic`);
    } else {
      await client.query(
        `INSERT INTO subtopics (
          topic_id, title, description, difficulty_level, order_index, created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [topicId, 'Communication', communicationDescription, 'medium', 2, adminUserId]
      );
      console.log(`✅ Created Communication subtopic`);
    }

    await client.query('COMMIT');
    
    console.log(`\n🎉 Social Science topic and subtopics added successfully!`);
    console.log(`\n📚 Topic: Social Science`);
    console.log(`   ├─ Transport (with description for AI quiz generation)`);
    console.log(`   └─ Communication (with description for AI quiz generation)`);
    console.log(`\n✅ These descriptions will be used by OpenAI to generate tailored quiz questions.`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error adding Social Science topic:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Get admin email from command line argument (optional)
const adminEmail = process.argv[2] || null;

addSocialScienceTopic(adminEmail)
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error.message);
    process.exit(1);
  });

