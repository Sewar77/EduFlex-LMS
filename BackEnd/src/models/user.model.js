import pool from "../config/db.js";

//users
//1- create user
export async function createUser(userInfo) {
  try {
    const result = await pool.query(
      "insert into users (name, email, password_hash, role) values($1, $2, $3, $4)",
      [userInfo.name, userInfo.email, userInfo.password_hash, userInfo.role]
    );
    return {
      message: "User created successfully",
      user: result.rows[0],
    };
  } catch (err) {
    console.error("Error creating Users:", err.message);
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
           role = $4, 
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
    return {
      message: "User updated successfully",
      user: result.rows[0],
    };
  } catch (err) {
    console.error("Error updating user:", err.message);
    throw new Error("User updating failed");
  }
}

//3- delete user
export async function deleteUser(id) {
  try {
    await pool.query("delete from users where id = $1", [id]);
    return {
      message: "User deletered successfully",
    };
  } catch (err) {
    console.error("Error deleteing Users:", err.message);
    throw new Error("User deleted failed");
  }
}

// 4- get all users
export async function getAllUsers() {
  try {
    const allUsers = await pool.query("select * from users");
    if (allUsers.rows.length !== 0) {
      return allUsers.rows;
    }
    return {
      message: "There is no Users",
    };
  } catch (err) {
    console.error("Error Getting all Users:", err.message);
    throw new Error("Users returning failed");
  }
}

//5- get user by id.
export async function getUserById(id) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return {
        message: "There is no user with this ID",
      };
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error Getting User:", err.message);
    throw new Error("User fetching failed");
  }
}
