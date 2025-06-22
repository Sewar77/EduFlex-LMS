import { query } from "../config/db.js";

//user enroll course
export async function enrollCourse({ user_id, course_id }) {
  try {
    if (Number.isInteger(user_id) && Number.isInteger(course_id)) {
      const isEnroller = await query(
        "select * from enrollments where user_id = $1 and course_id = $2",
        [user_id, course_id]
      );
      if (!isEnroller.rows[0]) {
        const enrolled = await query(
          "insert into enrollments (user_id, course_id, progress)values($1, $2, $3) RETURNING * ",
          [user_id, course_id, 0]
        );
        return enrolled.rows[0];
      }
      return false;
    }
    return null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//User unenroll course
export async function unenrollCourse({ user_id, course_id }) {
  try {
    if (Number.isInteger(user_id) && Number.isInteger(course_id)) {
      const isEnroller = await query(
        "select * from enrollments where user_id = $1 and course_id = $2",
        [user_id, course_id]
      );
      if (!isEnroller.rows[0]) {
        return false; //cant delete anything, not existed
      }
      await query(
        "delete from enrollments where user_id = $1 AND course_id = $2",
        [user_id, course_id]
      );
      return true; //deleted
    }
    return null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//get user enrollments
export async function getUserEnrollments(user_id) {
  try {
    if (Number.isInteger(user_id)) {
   const userCourses = await query(
     `SELECT 
    courses.id AS course_id,
    courses.title AS title,
    courses.thumbnail_url AS thumbnail,
    users.name AS instructor_name,
    enrollments.enrolled_at,
    enrollments.progress
  FROM enrollments
  JOIN courses ON enrollments.course_id = courses.id
  JOIN users ON courses.instructor_id = users.id
  WHERE enrollments.user_id = $1`,
     [user_id]
   );

      return userCourses.rows;
    }
    return false;
  } catch (err) {
    console.error(err);
    throw err;
  }
}


//search course
export async function isUserEnrolled({ user_id, course_id }) {
  try {
    if (Number.isInteger(user_id) && Number.isInteger(course_id)) {
      const userCourse = await query(
        `SELECT enrollments.*
          FROM enrollments 
          WHERE user_id = $1 AND course_id = $2`,
        [user_id, course_id]
      );
      return userCourse.rows.length > 0;
    }
    return false;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//for admin
export async function getAllEnrollments() {
  try {
    const allEnrollments = query("select * from enrollments");
    return (await allEnrollments).rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Get All Users Enrolled in a Course
export async function getCourseEnrollments(course_id) {
  try {
    if (Number.isInteger(course_id)) {
      const allEnrollments = await query(
        `SELECT e.id, e.course_id, u.name AS student_name, u.email AS student_email, e.enrolled_at, e.progress
    FROM enrollments e
    JOIN users u ON e.user_id = u.id
    WHERE e.course_id = $1
    ORDER BY e.enrolled_at DESC
`,
        [course_id]
      );
      return allEnrollments.rows;
    }
    return [];
  } catch (err) {
    console.error(err);
    throw err;
  }
}


export async function updateEnrollmentProgress(user_id, course_id) {
  // Total lessons in this course
  const totalLessonsResult = await query(
    `
    SELECT COUNT(*) FROM lessons l
    JOIN modules m ON l.module_id = m.id
    WHERE m.course_id = $1
  `,
    [course_id]
  );

  const total = parseInt(totalLessonsResult.rows[0].count, 10);

  // Completed lessons by this user
  const completedLessonsResult = await query(
    `
    SELECT COUNT(*) FROM lesson_completions lc
    JOIN lessons l ON lc.lesson_id = l.id
    JOIN modules m ON l.module_id = m.id
    WHERE lc.user_id = $1 AND m.course_id = $2
  `,
    [user_id, course_id]
  );

  const completed = parseInt(completedLessonsResult.rows[0].count, 10);
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  await query(
    `
    UPDATE enrollments
    SET progress = $1,
        completed_at = CASE WHEN $1 >= 100 THEN CURRENT_TIMESTAMP ELSE completed_at END
    WHERE user_id = $2 AND course_id = $3
  `,
    [progress, user_id, course_id]
  );

  return progress;
}





// repositories/enrollments.repository.js

export async function getEnrollmentProgress(courseId = null) {
  try {
    let sqlQuery = `
      SELECT 
        e.id,
        e.user_id,
        u.name AS user_name,
        e.progress,
        e.enrolled_at,
        e.completed_at,
        c.title AS course_title,
        EXTRACT(DAY FROM (NOW() - e.enrolled_at)) AS days_enrolled
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN courses c ON e.course_id = c.id
    `;

    const params = [];
    
    if (courseId) {
      sqlQuery += ` WHERE e.course_id = $1`;
      params.push(courseId);
    }

    sqlQuery += ` ORDER BY e.progress DESC`;

    const result = await query(sqlQuery, params);
    return result.rows;
  } catch (err) {
    console.error("Error fetching enrollment progress:", err);
    throw err;
  }
}