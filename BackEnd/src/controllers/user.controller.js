import {
  createUser,
  updateUser,
  getAllUsers,
  deleteUser,
  getUserById,
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
      const result = await deleteUser(id);
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
    throw err;
  }
}
//4- get all users:
export async function getAllUsersController(req, res) {
  try {
    const allUsers = await getAllUsers();
    //res.render("home", { users: allUsers });
    res.status(200).json(allUsers);
    //res.send("home, all users!");
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//5- get user by id
export async function getUserByIdController(req, res) {
  try {
    const id = req.params.id;
    const userById = await getUserById(id);
    //res.render("home", { users: allUsers });
    res.status(200).json(userById);
    //res.send("home, all users!");
  } catch (err) {
    console.error(err);
    throw err;
  }
}
