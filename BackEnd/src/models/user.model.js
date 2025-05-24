import pool from "../config/db.js";

export async function createUser(userInfo) {
  try {
    const result = await pool.query(
      "insert into users (name, email, password_hash, role, created_at,updated_at) values($1, $2, $3, $4, $5, $6)",
      [
        userInfo.name,
        userInfo.email,
        userInfo.password_hash,
        userInfo.role,
        userInfo.created_at,
        userInfo.updated_at,
      ]
    );
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function updateUser(req, res) {
  try {
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function createCourse(courseInfo) {
  try {
    const result = await pool.query(
      "insert into users (title,description,price,thumbnail_url,is_approved,is_published,created_at,updated_at,created_at,updated_at) values($1, $2, $3, $4, $5, $6)",
      [
        courseInfo.title,
        courseInfo.description,
        courseInfo.price,
        courseInfo.thumbnail_url,
        courseInfo.is_approved,
        courseInfo.is_published,
        courseInfo.created_at,
        courseInfo.updated_at,
      ]
    );
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
}
