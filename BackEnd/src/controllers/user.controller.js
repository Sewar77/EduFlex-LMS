import {
  createCourse,
  createUser,
  updateUser,
  getAllUsers,
  deleteUser,
} from "../models/user.model.js";

//users
//1-create user
export async function createUserController(req, res) {
  try {
    const userInfo = { ...req.body };
    await createUser(userInfo);
    res.send("created success"); //not created yet.
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//2-update user
export async function updateUserController(req, res) {
  try {
    const id = req.params.id;
    const userInfo = { ...req.body, id };
    await updateUser(userInfo);
    res.send("updated User");
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//3- delete user
export async function deleteUserController(req, res) {
  try {
    const id = req.params.id;
    if (id) {
      await deleteUser(id);
    } else {
      res.send("There is No Id");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}
//4- get all users:
export async function getAllUsersController(req, res) {
  try {
    const allUsers = await getAllUsers();
    //res.render("home", { users: allUsers });
    res.send("home, all users!")
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//5- get user by id
//courses
export async function createCourseController(req, res) {
  try {
    const courseInfo = { ...req.body };
    await createCourse(courseInfo);
    //res.render("createCourse.ejs"); //not created yet.
    res.send("created course. ")
  } catch (err) {
    console.error(err);
    throw err;
  }
}
