import pool from "../config/db.js";

//users
//1- create user
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
    return {
      message: "User created successfully",
      user: result.rows[0],
    };
  } catch (err) {
    console.error("Error creating Users:", err.message);
    throw err; // keep original error so you see details
  }

}export async function updateUser(userInfo) {
  try {
    const result = await pool.query(
      `UPDATE users 
       SET name = $1, 
           email = $2, 
           password_hash = $3, 
           role = $4, 
           created_at = $5, 
           updated_at = $6
       WHERE id = $7
       RETURNING *`,
      [
        userInfo.name,
        userInfo.email,
        userInfo.password_hash,
        userInfo.role,
        userInfo.created_at,
        userInfo.updated_at,
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
    const deletedUser = await pool.query("delete from users where id = $1", [
      id,
    ]);
  } catch (err) {
    console.error("Error deleteing Users:", err.message);
    throw new Error("User deleted failed");
  }
  
}



// 4- get all users
export async function getAllUsers() {
  try {
    const allUsers = await pool.query("select * from users");
    return allUsers.rows;
  } catch (err) {
    console.error("Error Getting all Users:", err.message);
    throw new Error("Users returning failed");
  }
}

//5- get user by id.

//courses:
export async function createCourse(courseInfo) {
  try {
    const result = await pool.query(
      "insert into courses (title,description,price,thumbnail_url,is_approved,is_published,created_at,updated_at) values($1, $2, $3, $4, $5, $6)",
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
    return {
      message: "Course created successfully",
      user: result.rows[0],
    };
  } catch (err) {
    console.error("Error creating course:", err.message);
    throw new Error("Course creation failed");
  }
}
