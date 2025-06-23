import express from "express";
import { validateBody } from "../middleware/validateBody.js";
import { UserSchema } from "../validation/user.Schema.js";
import { ChangePasswordSchema } from "../validation/changePassword.Schema.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { query } from "../config/db.js";
import {
  createUserController,
  updateUserController,
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  changeUserPasswordController,
  getProfile,
  updateUserRoleController,
  updateProfile,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// Users
userRouter.get("/users", authenticateJWT, getAllUsersController);

userRouter.put("/admin/users/:id", authenticateJWT, updateUserRoleController);

userRouter.get("/users/:id", authenticateJWT, getUserByIdController);
userRouter.post("/users", validateBody(UserSchema), createUserController);
userRouter.put(
  "/users/:id",
  authenticateJWT,
  validateBody(UserSchema),
  updateUserController
);

userRouter.get("/profile", authenticateJWT, getProfile);
userRouter.put("/profile", authenticateJWT, updateProfile);

userRouter.delete("/users/:id", authenticateJWT, deleteUserController);

userRouter.put(
  "/user/change-password",
  authenticateJWT,
  validateBody(ChangePasswordSchema),
  changeUserPasswordController
);



// In admin router
userRouter.patch("/admin/users/:id/status", authenticateJWT, async (req, res) => {
  const id = Number(req.params.id);
  const { is_active } = req.body;

  try {
    const result = await query(
      `UPDATE users SET is_active = $1 WHERE id = $2 RETURNING *`,
      [is_active, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "Status updated", user: result.rows[0] });
  } catch (err) {
    console.error("Error updating status:", err);
    return res.status(500).json({ message: "Internal error" });
  }
});



export default userRouter;
