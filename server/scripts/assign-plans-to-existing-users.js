/**
 * Script to assign Freemium plan to existing users who don't have a plan
 * This fixes the issue where scheduled tests are not visible to students
 */

const { pool } = require('../config/database');
const { getFreemiumPlan, assignPlanToUser } = require('../utils/plans');

const assignPlansToExistingUsers = async () => {
  try {
    console.log('🔍 Finding users without plans...\n');

    // Get Freemium plan
    const freemiumPlan = await getFreemiumPlan();
    console.log(`✅ Found Freemium plan: ${freemiumPlan.name} (${freemiumPlan.id})\n`);

    // Find users without plans
    const usersWithoutPlans = await pool.query(`
      SELECT u.id, u.name, u.email
      FROM users u
      LEFT JOIN user_plans up ON u.id = up.user_id
      WHERE up.user_id IS NULL
      ORDER BY u.created_at
    `);

    if (usersWithoutPlans.rows.length === 0) {
      console.log('✅ All users already have plans assigned!\n');
      return;
    }

    console.log(`📋 Found ${usersWithoutPlans.rows.length} users without plans:\n`);
    usersWithoutPlans.rows.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email})`);
    });
    console.log('');

    // Assign Freemium plan to each user
    let successCount = 0;
    let errorCount = 0;

    for (const user of usersWithoutPlans.rows) {
      try {
        await assignPlanToUser(user.id, freemiumPlan.id);
        console.log(`   ✅ Assigned Freemium plan to ${user.name} (${user.email})`);
        successCount++;
      } catch (error) {
        console.error(`   ❌ Failed to assign plan to ${user.name} (${user.email}):`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Successfully assigned: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`\n✅ Process complete!`);

    // Verify assignments
    console.log('\n🔍 Verifying assignments...');
    const verifyResult = await pool.query(`
      SELECT COUNT(*) as count
      FROM users u
      LEFT JOIN user_plans up ON u.id = up.user_id
      WHERE up.user_id IS NULL
    `);
    console.log(`   Users still without plans: ${verifyResult.rows[0].count}`);
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

// Run if called directly
if (require.main === module) {
  assignPlansToExistingUsers()
    .then(() => {
      console.log('\n✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { assignPlansToExistingUsers };


