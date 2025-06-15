import { query } from "../config/db.js";
import bcrypt from "bcryptjs";

//users
//1- create user
export async function createUser(userInfo) {
  try {
    let hashedPassword = null;
    if (userInfo.password) {
      hashedPassword = await bcrypt.hash(
        userInfo.password,
        Number(process.env.BCRYPT_SALT_ROUNDS)
      );
    }
    const result = await query(
      "insert into users (name, email, password_hash, role, avatar, oauth_provider, oauth_id) values($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        userInfo.name,
        userInfo.email,
        hashedPassword,
        userInfo.role || "student",
        userInfo.avatar || null,
        userInfo.oauth_provider || null,
        userInfo.oauth_id || null,
      ]
    );

    if (result.rows[0]) {
      return result.rows[0];
    }
    return null;
  } catch (err) {
    if (err.code === "23505") {
      throw new Error("Error already exist");
    }
    throw err;
  }
}

//update User
export async function updateUser(userInfo) {
  try {
    let hashedPassword = null;
    if (userInfo.password) {
       hashedPassword = await bcrypt.hash(
        userInfo.password,
        Number(process.env.BCRYPT_SALT_ROUNDS)
      );
    }
    const result = await query(
      `UPDATE users 
       SET name = $1, 
           email = $2, 
           password_hash = $3, 
           role = $4,
           avatar = $5
       WHERE id = $6
       RETURNING *`,
      [
        userInfo.name,
        userInfo.email,
        hashedPassword,
        userInfo.role,
        userInfo.avatar || null,
        userInfo.id,
      ]
    );
    if (result.rows[0]) {
      return result.rows[0];
    }
    return null;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

//3- delete user
export async function deleteUser(id) {
  try {
    if (Number.isInteger(id)) {
      const result = await query("delete from users where id = $1", [id]);
      if (result.rowCount > 0) {
        return true;
      }
      return false;
    } else {
      throw new Error("Invalid User id");
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

// 4- get all users
export async function getAllUsers() {
  try {
    const allUsers = await query("select * from users");
    return allUsers.rows;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

//5- get user by id.
export async function getUserById(id) {
  try {
    const userId = Number(id);
    if (Number.isInteger(userId) && userId > 0) {
      const result = await query(
        "SELECT id, email,password_hash, name, role, is_active, avatar FROM users WHERE id = $1",
        [userId]
      );
      if (!result.rows[0]) {
        return null;
      }
      return result.rows[0];
    } else {
      throw new Error("Invalid User id id");
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

export async function getUserByEmail(email) {
  try {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function changeUserPassword({ user_id, newPassword }) {
  try {
    const hashedPassword = await bcrypt.hash(
      newPassword,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    );
    const result = await query(
      `UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING *`,
      [hashedPassword, user_id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

export async function getUserbyGoogleId(id) {
  try {
    const googleId = await query(
      "select email,oauth_id, name, role, avatar from users where oauth_id = $1",
      [id]
    );
    if (!googleId.rows[0]) {
      return null;
    }
    return googleId.rows[0];
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}


export async function getUserProfileById(userId) {
  try {
    // Fetch basic user info
    const userQuery = `
      SELECT id, email, name, role, is_active, avatar
      FROM users WHERE id = $1
    `;
    const userResult = await query(userQuery, [userId]);
    const user = userResult.rows[0];
    if (!user) return null;

    // Fetch enrolled courses with instructor name
    const coursesQuery = `
      SELECT c.id, c.title, c.thumbnail_url,
             u.name AS instructor_name,
             e.progress
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN users u ON c.instructor_id = u.id
      WHERE e.user_id = $1
    `;
    const coursesResult = await query(coursesQuery, [userId]);
    user.enrolledCourses = coursesResult.rows || [];

    return user;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}


// Update profile fields and optionally password
export async function updateUserProfile(userId, updateData) {
  try {
    const fields = [];
    const values = [];
    let idx = 1;

    if (updateData.name) {
      fields.push(`name = $${idx++}`);
      values.push(updateData.name);
    }
    if (updateData.email) {
      fields.push(`email = $${idx++}`);
      values.push(updateData.email);
    }
    if (updateData.avatar !== undefined) {
      fields.push(`avatar = $${idx++}`);
      values.push(updateData.avatar);
    }

    if (fields.length === 0 && !updateData.password) {
      // Nothing to update except maybe password
      if (!updateData.password) return null;
    }

    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(
        updateData.password,
        Number(process.env.BCRYPT_SALT_ROUNDS)
      );
      fields.push(`password_hash = $${idx++}`);
      values.push(hashedPassword);
    }

    if (fields.length === 0) return null;

    values.push(userId);

    const queryText = `
      UPDATE users SET ${fields.join(", ")}
      WHERE id = $${idx}
      RETURNING id, email, name, role, is_active, avatar
    `;

    const result = await query(queryText, values);
    return result.rows[0] || null;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}
