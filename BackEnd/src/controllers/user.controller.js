import {
  createUser,
  updateUser,
  getAllUsers,
  deleteUser,
  getUserById,
  changeUserPassword,
  getUserByEmail,
  getUserbyGoogleId,
  getUserProfileById,
  updateUserProfile,
} from "../models/user.model.js";
import { verifyPassword } from "../utils/auth.js";

//1-create user
export async function createUserController(req, res) {
  try {
    const userInfo = { ...req.body };
    if (userInfo.oauth_provider === "google" && userInfo.oauth_id) {
      userInfo.passord = null;
      userInfo.avatar = userInfo.avatar || null;
    } else {
      userInfo.oauth_provider = null;
      userInfo.oauth_id = null;
      userInfo.avatar = userInfo.avatar || null;
    }
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
    return res.status(404).json({ message: "Invalid user id controller" });
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
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await getUserById(userId); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Stored hash:", user.password_hash);
    console.log("Input password:", currentPassword);

    const isMatch = await verifyPassword(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const updatedUser = await changeUserPassword({
      user_id: user.id,
      newPassword,
    });

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update password" });
    }

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Can't change user password: ", err);
    res.status(500).json({
      message: "Failed to change user password. Please try again later.",
    });
  }
}

export async function getUserbyGoogleIdController(req, res) {
  const id = req.params.oauth_id;
  if (!id) {
    return res.status(400).json({ message: "Google ID is required" });
  }
  try {
    const userById = await getUserbyGoogleId(id);
    if (userById === null) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(userById);
  } catch (err) {
    console.error("Can't Get user with google id: ", err);
    res.status(500).json({
      message: "Failed to get user with google id. Please try again later.",
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

export async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    const user = await getUserProfileById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Optionally, validate password strength if updateData.password is present

    const updatedUser = await updateUserProfile(userId, updateData);
    if (!updatedUser) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}
