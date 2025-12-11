/**
 * Test script to check if students can see scheduled tests
 */

const { pool } = require('../config/database');

const testStudentScheduledTests = async () => {
  try {
    // Get a student user
    const studentResult = await pool.query(`
      SELECT u.id, u.name, u.email
      FROM users u
      INNER JOIN user_plans up ON u.id = up.user_id
      WHERE u.email IN ('shanaya@gmail.com', 'amithbti403@gmail.com')
      LIMIT 1
    `);

    if (studentResult.rows.length === 0) {
      console.log('❌ No student users found');
      return;
    }

    const student = studentResult.rows[0];
    console.log(`\n🧪 Testing for student: ${student.name} (${student.email})\n`);

    // Get user's plan IDs
    const userPlansResult = await pool.query(
      'SELECT plan_id FROM user_plans WHERE user_id = $1',
      [student.id]
    );
    const userPlanIds = userPlansResult.rows.map((row) => row.plan_id);
    console.log(`📋 User's Plan IDs: ${JSON.stringify(userPlanIds)}\n`);

    const now = new Date();
    console.log(`⏰ Current Time: ${now.toISOString()}\n`);

    // Run the actual query used by the API
    const query = `
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

    const result = await pool.query(query, [
      student.id,
      userPlanIds.length > 0 ? userPlanIds : [],
      now,
    ]);

    console.log(`✅ RESULT: ${result.rows.length} scheduled test(s) visible\n`);

    if (result.rows.length > 0) {
      console.log('📝 Visible Scheduled Tests:');
      result.rows.forEach((test, index) => {
        console.log(`\n   ${index + 1}. ${test.quiz_name}`);
        console.log(`      - ID: ${test.id}`);
        console.log(`      - Status: ${test.status}`);
        console.log(`      - Visible From: ${test.visible_from}`);
        console.log(`      - Visible Until: ${test.visible_until || 'No limit'}`);
        console.log(`      - Plan IDs: ${JSON.stringify(test.plan_ids)}`);
      });
    } else {
      console.log('⚠️  No scheduled tests visible');
      console.log('\n   Possible reasons:');
      console.log('   1. No scheduled tests match user\'s plan');
      console.log('   2. visible_from is in the future');
      console.log('   3. visible_until is in the past');
      console.log('   4. Status is not "scheduled" or "active"');
    }

    console.log('\n✅ Test complete!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  testStudentScheduledTests();
}

module.exports = { testStudentScheduledTests };

