/**
 * Diagnostic script to check why scheduled tests are not visible to students
 * Checks database records and query logic
 */

const { pool } = require('../config/database');

const checkScheduledTestsVisibility = async () => {
  try {
    console.log('🔍 Checking scheduled tests visibility...\n');

    // 1. Check all scheduled tests
    console.log('1️⃣ All Scheduled Tests:');
    const allTests = await pool.query(`
      SELECT 
        st.id,
        st.quiz_id,
        st.status,
        st.scheduled_for,
        st.visible_from,
        st.visible_until,
        st.plan_ids,
        st.user_ids,
        q.name as quiz_name,
        u.name as scheduled_by_name
      FROM scheduled_tests st
      LEFT JOIN quizzes q ON st.quiz_id = q.id
      LEFT JOIN users u ON st.scheduled_by = u.id
      ORDER BY st.created_at DESC
    `);

    if (allTests.rows.length === 0) {
      console.log('   ⚠️  No scheduled tests found in database!\n');
      return;
    }

    allTests.rows.forEach((test, index) => {
      console.log(`   Test ${index + 1}:`);
      console.log(`   - ID: ${test.id}`);
      console.log(`   - Quiz: ${test.quiz_name || 'N/A'}`);
      console.log(`   - Status: ${test.status}`);
      console.log(`   - Scheduled For: ${test.scheduled_for}`);
      console.log(`   - Visible From: ${test.visible_from}`);
      console.log(`   - Visible Until: ${test.visible_until || 'NULL (no limit)'}`);
      console.log(`   - Plan IDs: ${JSON.stringify(test.plan_ids || [])}`);
      console.log(`   - User IDs: ${JSON.stringify(test.user_ids || [])}`);
      console.log('');
    });

    // 2. Check user plans
    console.log('2️⃣ User Plans:');
    const usersWithPlans = await pool.query(`
      SELECT 
        u.id as user_id,
        u.name as user_name,
        u.email,
        up.plan_id,
        p.name as plan_name
      FROM users u
      LEFT JOIN user_plans up ON u.id = up.user_id
      LEFT JOIN plans p ON up.plan_id = p.id
      ORDER BY u.name
      LIMIT 20
    `);

    if (usersWithPlans.rows.length === 0) {
      console.log('   ⚠️  No students found!\n');
    } else {
      const userPlanMap = {};
      usersWithPlans.rows.forEach((row) => {
        if (!userPlanMap[row.user_id]) {
          userPlanMap[row.user_id] = {
            name: row.user_name,
            email: row.email,
            plans: [],
          };
        }
        if (row.plan_id) {
          userPlanMap[row.user_id].plans.push({
            id: row.plan_id,
            name: row.plan_name,
          });
        }
      });

      Object.entries(userPlanMap).forEach(([userId, data]) => {
        console.log(`   User: ${data.name} (${data.email})`);
        console.log(`   - User ID: ${userId}`);
        if (data.plans.length > 0) {
          console.log(`   - Plans: ${data.plans.map((p) => `${p.name} (${p.id})`).join(', ')}`);
        } else {
          console.log(`   - Plans: ⚠️  NO PLANS ASSIGNED`);
        }
        console.log('');
      });
    }

    // 3. Test the query logic for a sample user
    console.log('3️⃣ Testing Query Logic:');
    const sampleUser = await pool.query(`
      SELECT id, name, email FROM users 
      WHERE id NOT IN (SELECT DISTINCT scheduled_by FROM scheduled_tests)
      LIMIT 1
    `);

    if (sampleUser.rows.length === 0) {
      console.log('   ⚠️  No student users found to test with!\n');
      return;
    }

    const testUserId = sampleUser.rows[0].id;
    const testUserName = sampleUser.rows[0].name;
    console.log(`   Testing for user: ${testUserName} (${testUserId})\n`);

    // Get user's plan IDs
    const userPlansResult = await pool.query(
      'SELECT plan_id FROM user_plans WHERE user_id = $1',
      [testUserId]
    );
    const userPlanIds = userPlansResult.rows.map((row) => row.plan_id);
    console.log(`   User's Plan IDs: ${JSON.stringify(userPlanIds)}\n`);

    const now = new Date();
    console.log(`   Current Time: ${now.toISOString()}\n`);

    // Test each condition separately
    console.log('   Checking each condition:\n');

    // Condition 1: User directly assigned
    const directAssign = await pool.query(
      `SELECT id, quiz_id, status, visible_from, visible_until, plan_ids, user_ids 
       FROM scheduled_tests 
       WHERE $1 = ANY(user_ids)`,
      [testUserId]
    );
    console.log(`   ✅ Directly assigned tests: ${directAssign.rows.length}`);

    // Condition 2: User's plan in plan_ids
    const planAssign = await pool.query(
      `SELECT id, quiz_id, status, visible_from, visible_until, plan_ids, user_ids 
       FROM scheduled_tests 
       WHERE plan_ids IS NOT NULL AND plan_ids && $1::uuid[]`,
      [userPlanIds.length > 0 ? userPlanIds : []]
    );
    console.log(`   ✅ Tests assigned via plans: ${planAssign.rows.length}`);

    // Condition 3: Visible from check
    const visibleFrom = await pool.query(
      `SELECT id, quiz_id, status, visible_from, visible_until 
       FROM scheduled_tests 
       WHERE visible_from <= $1`,
      [now]
    );
    console.log(`   ✅ Tests visible from now: ${visibleFrom.rows.length}`);

    // Condition 4: Not expired
    const notExpired = await pool.query(
      `SELECT id, quiz_id, status, visible_from, visible_until 
       FROM scheduled_tests 
       WHERE visible_until IS NULL OR visible_until >= $1`,
      [now]
    );
    console.log(`   ✅ Tests not expired: ${notExpired.rows.length}`);

    // Condition 5: Status check
    const correctStatus = await pool.query(
      `SELECT id, quiz_id, status 
       FROM scheduled_tests 
       WHERE status IN ('scheduled', 'active')`
    );
    console.log(`   ✅ Tests with correct status: ${correctStatus.rows.length}\n`);

    // Full query result
    const fullQuery = `
      SELECT 
        st.*,
        q.id as quiz_id,
        q.name as quiz_name,
        q.description as quiz_description,
        q.age_group as quiz_age_group,
        q.difficulty as quiz_difficulty,
        q.number_of_questions,
        q.passing_percentage,
        q.time_limit,
        u.name as scheduled_by_name
      FROM scheduled_tests st
      INNER JOIN quizzes q ON st.quiz_id = q.id
      INNER JOIN users u ON st.scheduled_by = u.id
      WHERE (
        ($1 = ANY(st.user_ids) OR (st.plan_ids IS NOT NULL AND st.plan_ids && $2::uuid[]))
      )
      AND st.visible_from <= $3
      AND (st.visible_until IS NULL OR st.visible_until >= $3)
      AND st.status IN ('scheduled', 'active')
      ORDER BY 
        CASE 
          WHEN st.status = 'active' THEN 1
          WHEN st.scheduled_for <= $3 THEN 2
          ELSE 3
        END,
        st.scheduled_for ASC
    `;

    const result = await pool.query(fullQuery, [
      testUserId,
      userPlanIds.length > 0 ? userPlanIds : [],
      now,
    ]);

    console.log(`   📊 FINAL RESULT: ${result.rows.length} tests visible to user\n`);

    if (result.rows.length > 0) {
      console.log('   Visible tests:');
      result.rows.forEach((test, index) => {
        console.log(`   ${index + 1}. ${test.quiz_name} (Status: ${test.status})`);
      });
    } else {
      console.log('   ⚠️  NO TESTS VISIBLE - Possible reasons:');
      console.log('   1. User has no plans assigned');
      console.log('   2. Scheduled tests have no plan_ids or user_ids matching this user');
      console.log('   3. visible_from is in the future');
      console.log('   4. visible_until is in the past');
      console.log('   5. Status is not "scheduled" or "active"');
    }

    console.log('\n✅ Diagnostic complete!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
};

// Run if called directly
if (require.main === module) {
  checkScheduledTestsVisibility();
}

module.exports = { checkScheduledTestsVisibility };

