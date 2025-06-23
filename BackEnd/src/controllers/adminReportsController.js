// controllers/adminReportsController.js
import { query } from "../config/db.js";

export async function getSystemUsageReport(req, res) {
  try {
    // Total users count
    const usersCountResult = await query(`SELECT COUNT(*) FROM users`);
    const totalUsers = parseInt(usersCountResult.rows[0].count, 10);

    // Active users in last 30 days (fixed column name)
    const activeUsersResult = await query(`
      SELECT COUNT(DISTINCT user_id) 
      FROM user_logins 
      WHERE login_time >= CURRENT_DATE - INTERVAL '30 days'
    `);
    const activeUsersLast30Days = parseInt(activeUsersResult.rows[0].count, 10);

    // Total courses count
    const coursesCountResult = await query(`SELECT COUNT(*) FROM courses`);
    const totalCourses = parseInt(coursesCountResult.rows[0].count, 10);

    // Published courses count
    const publishedCoursesResult = await query(
      `SELECT COUNT(*) FROM courses WHERE is_published = TRUE`
    );
    const publishedCourses = parseInt(publishedCoursesResult.rows[0].count, 10);

    // Pending course approvals
    const pendingCoursesResult = await query(
      `SELECT COUNT(*) FROM courses WHERE is_approved = FALSE`
    );
    const pendingCourses = parseInt(pendingCoursesResult.rows[0].count, 10);

    // Construct report object
    const report = {
      totalUsers,
      activeUsersLast30Days,
      totalCourses,
      publishedCourses,
      pendingCourses,
    };

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err) {
    console.error("Error generating system usage report:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to generate usage report",
      error: err.message,
    });
  }
}
