import { query } from "../config/db.js";

// Course model with all fields
export async function createCourse(courseInfo) {
  try {
    const result = await query(
      `INSERT INTO courses 
       (title, description, instructor_id, category_id, 
        thumbnail_url, is_published, is_approved) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        courseInfo.title,
        courseInfo.description,
        courseInfo.instructor_id,
        courseInfo.category_id || null, // Handle optional category
        courseInfo.thumbnail_url,
        courseInfo.is_published || false, // Default to false
        courseInfo.is_approved || false, // Default to false
      ]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error("Error creating course:", err);
    throw err;
  }
}

export async function updateCourse(courseInfo) {
  try {
    const result = await query(
      `UPDATE courses
       SET title = $1,
           description = $2,
           instructor_id = $3,
           category_id = $4,
           thumbnail_url = $5,
           is_published = $6,
           is_approved = $7,
           updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [
        courseInfo.title,
        courseInfo.description,
        courseInfo.instructor_id,
        courseInfo.category_id,
        courseInfo.thumbnail_url, // $5
        courseInfo.is_published, // $6 (make sure this is boolean)
        courseInfo.is_approved, // $7 (make sure this is boolean)
        courseInfo.id, // $8
      ]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error("Error updating course:", err);
    throw err;
  }
}

export async function deleteCourse(id) {
  try {
    if (!Number.isInteger(id)) {
      throw new Error("Invalid Course Id");
    }

    const result = await query(
      "DELETE FROM courses WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rowCount > 0;
  } catch (err) {
    console.error("Error deleting course:", err);
    throw err;
  }
}

export async function getAllCourses() {
  try {
    const result = await query(`
      SELECT 
        c.*,
        u.name as instructor_name,
        cat.name as category_name
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      ORDER BY c.created_at DESC
    `);
    return result.rows;
  } catch (err) {
    console.error("Error fetching courses:", err);
    throw err;
  }
}

export async function getCourseById(id) {
  try {
    if (!Number.isInteger(id)) {
      throw new Error("Invalid Course Id");
    }

    const result = await query(
      `
    SELECT 
  c.*,
  u.name AS instructor_name,
  u.avatar AS instructor_avatar,
  cat.name AS category_name
FROM courses c
LEFT JOIN users u ON c.instructor_id = u.id
LEFT JOIN categories cat ON c.category_id = cat.id
WHERE c.id = $1

    `,
      [id]
    );

    return result.rows[0] || null;
  } catch (err) {
    console.error("Error fetching course:", err);
    throw err;
  }
}

// Get courses by status
export async function getCoursesByStatus(isPublished, isApproved) {
  try {
    const result = await query(
      `SELECT * FROM courses 
       WHERE is_published = $1 AND is_approved = $2
       ORDER BY created_at DESC`,
      [isPublished, isApproved]
    );
    return result.rows;
  } catch (err) {
    console.error("Error fetching courses by status:", err);
    throw err;
  }
}

export async function getCoursesByInstructor(instructorId) {
  try {
    if (!Number.isInteger(instructorId)) {
      throw new Error("Invalid Instructor ID");
    }

    const result = await query(
      `
      SELECT 
        c.*,
        u.name AS instructor_name,
        cat.name AS category_name
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.instructor_id = $1
      ORDER BY c.created_at DESC
      `,
      [instructorId]
    );

    return result.rows;
  } catch (err) {
    console.error("Error fetching instructor's courses:", err);
    throw err;
  }
}

export async function getCoursesByCategory(categoryId) {
  try {
    if (!Number.isInteger(categoryId)) {
      throw new Error("Invalid Category Id");
    }

    const result = await query(
      `SELECT 
         c.*,
         u.name as instructor_name,
         cat.name as category_name
       FROM courses c
       LEFT JOIN users u ON c.instructor_id = u.id
       LEFT JOIN categories cat ON c.category_id = cat.id
       WHERE c.category_id = $1
       ORDER BY c.created_at DESC`,
      [categoryId]
    );

    return result.rows;
  } catch (err) {
    console.error("Error fetching courses by category:", err);
    throw err;
  }
}


export async function searchCourses(keyword) {
  try {
    const result = await query(
      `SELECT 
         c.*,
         u.name as instructor_name,
         cat.name as category_name
       FROM courses c
       LEFT JOIN users u ON c.instructor_id = u.id
       LEFT JOIN categories cat ON c.category_id = cat.id
       WHERE LOWER(c.title) LIKE $1
       ORDER BY c.created_at DESC`,
      [`%${keyword.toLowerCase()}%`]
    );
    return result.rows;
  } catch (err) {
    console.error("Error searching courses:", err);
    throw err;
  }
}


export const getLatestCourses = async (limit = 8) => {
  try {
    const result = await query(
      `SELECT 
         c.*, 
         u.name AS instructor_name,
         cat.name AS category_name
       FROM courses c
       LEFT JOIN users u ON c.instructor_id = u.id
       LEFT JOIN categories cat ON c.category_id = cat.id
       ORDER BY c.created_at DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  } catch (err) {
    console.error("Error fetching latest courses:", err);
    throw err;
  }
};



export async function getPendingCourses() {
  try {
    const result = await query(`
      SELECT c.id, c.title, u.name AS instructor_name, cat.name AS category_name
      FROM courses c
      JOIN users u ON u.id = c.instructor_id
      JOIN categories cat ON cat.id = c.category_id
      WHERE c.is_approved = false
    `);
    return result.rows;
  } catch (error) {
    console.error("Error in getPendingCourses:", error);
    throw error; // let controller handle the error and response
  }
}