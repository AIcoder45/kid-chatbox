/**
 * Test script to verify admin user can login and has correct roles
 */

const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const testAdminLogin = async (email, password) => {
  const client = await pool.connect();
  try {
    console.log(`\n🔍 Testing admin login for: ${email}\n`);

    // Check if user exists
    const userResult = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      console.log('❌ User not found!');
      return;
    }

    const user = userResult.rows[0];
    console.log(`✅ User found:`);
    console.log(`   - Name: ${user.name}`);
    console.log(`   - Status: ${user.status}`);
    console.log(`   - Has password: ${user.password_hash ? 'Yes' : 'No'}`);

    // Test password if provided
    if (password && user.password_hash) {
      const isValid = await bcrypt.compare(password, user.password_hash);
      console.log(`   - Password match: ${isValid ? '✅ Yes' : '❌ No'}`);
    }

    // Check roles
    const rolesResult = await client.query(
      `SELECT r.name, r.id
       FROM roles r
       INNER JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = $1`,
      [user.id]
    );

    console.log(`\n📋 Roles:`);
    if (rolesResult.rows.length === 0) {
      console.log('   ❌ No roles assigned!');
    } else {
      rolesResult.rows.forEach((role) => {
        const isAdmin = role.name === 'admin';
        console.log(`   ${isAdmin ? '✅' : '  '} ${role.name} (${role.id})`);
      });
    }

    // Check permissions
    const permissionsResult = await client.query(
      `SELECT DISTINCT p.name 
       FROM permissions p
       INNER JOIN role_permissions rp ON p.id = rp.permission_id
       INNER JOIN user_roles ur ON rp.role_id = ur.role_id
       WHERE ur.user_id = $1`,
      [user.id]
    );

    console.log(`\n🔐 Permissions (${permissionsResult.rows.length}):`);
    permissionsResult.rows.forEach((perm) => {
      console.log(`   - ${perm.name}`);
    });

    // Check module access
    const moduleAccessResult = await client.query(
      `SELECT module_name, has_access 
       FROM user_module_access 
       WHERE user_id = $1`,
      [user.id]
    );

    console.log(`\n🚪 Module Access:`);
    if (moduleAccessResult.rows.length === 0) {
      console.log('   ⚠️  No explicit module access (may default to all)');
    } else {
      moduleAccessResult.rows.forEach((mod) => {
        console.log(`   ${mod.has_access ? '✅' : '❌'} ${mod.module_name}`);
      });
    }

    // Summary
    const hasAdminRole = rolesResult.rows.some((r) => r.name === 'admin');
    const isApproved = user.status === 'approved';

    console.log(`\n📊 Summary:`);
    console.log(`   - Has admin role: ${hasAdminRole ? '✅ Yes' : '❌ No'}`);
    console.log(`   - Is approved: ${isApproved ? '✅ Yes' : '❌ No'}`);
    console.log(`   - Can access admin portal: ${hasAdminRole && isApproved ? '✅ Yes' : '❌ No'}`);

    if (!hasAdminRole) {
      console.log(`\n⚠️  User does not have admin role!`);
      console.log(`   Run: node server/scripts/add-admin-user.js ${email}`);
    }

    if (!isApproved) {
      console.log(`\n⚠️  User is not approved!`);
      console.log(`   Status: ${user.status}`);
    }

    if (hasAdminRole && isApproved) {
      console.log(`\n✅ User is ready to access admin portal!`);
      console.log(`   Login at: http://localhost:5173/login`);
      console.log(`   Admin portal: http://localhost:5173/admin`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
  }
};

const email = process.argv[2] || 'amithbti416@gmail.com';
const password = process.argv[3] || 'Shanaya@123';

testAdminLogin(email, password)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });

