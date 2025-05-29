import {
  createUser,
  updateUser,
  getAllUsers,
  deleteUser,
  getUserById,
  changeUserPassword,
  getUserByEmail,
} from "../models/user.model.js";

//1-create user
export async function createUserController(req, res) {
  try {
    const userInfo = { ...req.body };
    await createUser(userInfo);
    return res.status(201).json({ message: "User created success" }); //not created yet.
  } catch (err) {
    console.error("Can't create new user:", err);
    res
      .status(500)
      .json({ message: "Failed to create user. Please try again later." });
  }
}

//2-update user
export async function updateUserController(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid User id " });
  }
  try {
    const userInfo = { ...req.body, id };
    const updatedUser = await updateUser(userInfo);
    if (updatedUser === null) {
      return res.status(404).json({ message: "User Not Found" });
    }
    return res.status(201).json({ message: "User updated seccessfully " });
  } catch (err) {
    console.error("Can't updated user:", err);
    res
      .status(500)
      .json({ message: "Failed to update user. Please try again later." });
  }
}

//3- delete user
export async function deleteUserController(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid User id " });
  }
  try {
    const result = await deleteUser(id);
    if (result === true) {
      return res.status(200).json({ message: "User deleted successfully." });
    }
    return res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
//4- get all users:
export async function getAllUsersController(req, res) {
  try {
    if (req.query.email) {
      const user = await getUserByEmail(req.query.email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    }
    const allUsers = await getAllUsers();
    return res.status(200).json(allUsers);
  } catch (err) {
    console.error("Can't Get users: ", err);
    res
      .status(500)
      .json({ message: "Failed to get users. Please try again later." });
  }
}

//5- get user by id
export async function getUserByIdController(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(404).json({ message: "Invalid user id" });
  }
  try {
    const userById = await getUserById(id);
    if (userById === null) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(userById);
  } catch (err) {
    console.error("Can't Get user: ", err);
    res
      .status(500)
      .json({ message: "Failed to get user. Please try again later." });
  }
}

export async function changeUserPasswordController(req, res) {
  const user_id = Number(req.params.id);
  const { newPassword } = req.body;
  if (!Number.isInteger(user_id)) {
    return res.status(404).json({ message: "Invalid user id" });
  }
  try {
    const changePassword = await changeUserPassword({ user_id, newPassword });
    return res.status(200).json({ changePassword });
  } catch (err) {
    console.error("Can't change user password: ", err);
    res.status(500).json({
      message: "Failed to change user password. Please try again later.",
    });
  }
}

// export async function getUserByEmailController(req, res) {
//   const { email } = req.body; // or req.query.email if using query params
//   if (!email || typeof email !== "string") {
//     return res.status(400).json({ message: "Email is required." });
//   }
//   try {
//     const user = await getUserByEmail(email);
//     if (!user) {
//       return res.status(404).json({ message: "User with this email not found." });
//     }
//     return res.status(200).json(user);
//   } catch (err) {
//     console.error("Can't get user by email:", err);
//     res
//       .status(500)
//       .json({ message: "Failed to get user. Please try again later." });
//   }
// }
