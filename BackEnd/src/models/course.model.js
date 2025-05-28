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
    if (result.rows[0]) {
      return result.rows[0];
    }
    return null;
  } catch (err) {
    console.error(err);
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
      return updatedCourse.rows[0];
    }
    return null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//delete course:
export async function deleteCourse(id) {
  try {
    if (Number.isInteger(id)) {
      const result = await pool.query("delete from courses where id = $1", [
        id,
      ]);
      if (result.rowCount === 0) {
        return false;
      }
      return true;
    } else {
      throw new Error("Invalid Course Id");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//get all courses
export async function getAllCourses() {
  try {
    const allCourses = await pool.query("select * from courses");
    return allCourses.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//get course by Id
export async function getCourseById(id) {
  try {
    if (Number.isInteger(id)) {
      const course = await pool.query("select * from courses where id = $1", [
        id,
      ]);
      if (course.rows.length !== 0) {
        return course.rows[0];
      }
      return null;
    } else {
      throw new Error("Invalid Cours Id");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//search
export async function searchCourses(keyword) {
  try {
    const result = await pool.query(
      `
    select * from courses where lower(name) LIKE $1
  `,
      [`%${keyword.toLowerCase()}%`]
    );
    return result.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}


