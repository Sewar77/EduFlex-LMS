import pool from "../config/db.js";

//courses:
export async function createCourse(courseInfo) {
  try {
    const result = await pool.query(
      `INSERT INTO courses 
    (title, description, price, thumbnail_url, instructor_id) 
   VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        courseInfo.title,
        courseInfo.description,
        courseInfo.price,
        courseInfo.thumbnail_url,
        courseInfo.instructor_id, // <---- for now to prevent errors !
      ]
    );
    return {
      message: "Course created successfully",
      course: result.rows[0],
    };
  } catch (err) {
    console.error("REAL DB ERROR:", err);
    throw err;
  }
}

export async function updateCourse(courseInfo) {
  try {
    const updatedCourse = await pool.query(
      `update courses
       set title = $1,
            description=$2,
            price=$3,
            thumbnail_url=$4
            where id = $5
 RETURNING *`,
      [
        courseInfo.title,
        courseInfo.description,
        courseInfo.price,
        courseInfo.thumbnail_url,
        courseInfo.id,
      ]
    );
    if (updatedCourse.rows[0]) {
      return {
        message: "Course updated successfully",
        course: updatedCourse.rows[0],
      };
    }
    return {
      message: "Course unfound",
    };
  } catch (err) {
    console.error(" REAL DB ERROR:", err);
    throw err;
  }
}

//delete course:
export async function deletCourse(id) {
  try {
    await pool.query("delete from course where id = $1", [id]);
    return {
      message: "User deleted ",
    };
  } catch (err) {
    console.error(" REAL DB ERROR:", err);
    throw err;
  }
}

//get all courses
export async function getAllCourses() {
  try {
    const allCourses = await pool.query("select * from courses");
    if (allCourses.rows) {
      return allCourses.rows;
    }
    return {
      message: "No Courses to get",
    };
  } catch (err) {
    console.error(" REAL DB ERROR:", err);
    throw err;
  }
}

//get course by Id
export async function getCourseById(id) {
  try {
    const course = await pool.query("select * from courses where id = $1", [
      id,
    ]);
    if (course.rows.length !== 0) {
      return course.rows[0];
    }
    return {
      message: "no course with this id ",
    };
  } catch (err) {
    console.error(" REAL DB ERROR:", err);
    throw err;
  }
}
