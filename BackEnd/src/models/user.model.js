import pool from "../config/db.js";

//users
//1- create user
export async function createUser(userInfo) {
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "insert into users (name, email, password_hash, role) values($1, $2, $3, $4) RETURNING *",
      [userInfo.name, userInfo.email, password_hash, userInfo.role]
    );
    if (result.rows[0]) {
      return result.rows[0];
    }
    return null;
  } catch (err) {
    console.error(err);
    throw err; // keep original error so you see details
  }
}
//update User
export async function updateUser(userInfo) {
  try {
    const result = await pool.query(
      `UPDATE users 
       SET name = $1, 
           email = $2, 
           password_hash = $3, 
           role = $4
       WHERE id = $5
       RETURNING *`,
      [
        userInfo.name,
        userInfo.email,
        userInfo.password_hash,
        userInfo.role,
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
      const result = await pool.query("delete from users where id = $1", [id]);
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
    const allUsers = await pool.query("select * from users");
    if (allUsers.rows.length !== 0) {
      return allUsers.rows;
    }
    return null;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

//5- get user by id.
export async function getUserById(id) {
  try {
    if (Number.isInteger(id)) {
      const result = await pool.query("SELECT * FROM users WHERE id = $1", [
        id,
      ]);
      if (!result.rows[0]) {
        return null;
      }
      return result.rows[0];
    } else {
      throw new Error("Invalid User id");
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}



export async function getUserByEmail(email) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0] || null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}



export async function changeUserPassword({ user_id, newPassword }) {
  try {
    if (!Number.isInteger(user_id)) return false;
    const result = await pool.query(
      `update users 
set password_hash = $1 where user_id = $2 returning *`,
      [newPassword, user_id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}
