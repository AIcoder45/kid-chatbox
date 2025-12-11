/**
 * Script to check user roles
 * Usage: node server/scripts/check-user-roles.js <email>
 */

const { pool } = require('../config/database');
const dotenv = require('dotenv');

dotenv.config();

const checkUserRoles = async (email) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT 
        u.id,
        u.email,
        u.name,
        u.status,
        COALESCE(
          json_agg(jsonb_build_object('name', r.name, 'id', r.id)) 
          FILTER (WHERE r.name IS NOT NULL),
          '[]'::json
        ) as roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.email = $1
      GROUP BY u.id, u.email, u.name, u.status`,
      [email]
    );

    if (result.rows.length === 0) {
      console.log(`❌ User with email ${email} not found.`);
      return;
    }

    const user = result.rows[0];
    console.log(`\n📧 Email: ${user.email}`);
    console.log(`👤 Name: ${user.name}`);
    console.log(`📊 Status: ${user.status}`);
    console.log(`🔐 Roles: ${user.roles.map((r) => r.name).join(', ') || 'None'}`);
  } catch (error) {
    console.error('❌ Error checking user roles:', error);
    throw error;
  } finally {
    client.release();
  }
};

const email = process.argv[2] || 'shanaya@gmail.com';

checkUserRoles(email)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });

