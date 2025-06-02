import express from "express";
import { validateBody } from "../middleware/validateBody.js";
import { UserSchema } from "../validation/user.Schema.js";
import { ChangePasswordSchema } from "../validation/changePassword.Schema.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import {
  createUserController,
  updateUserController,
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  changeUserPasswordController,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// Users
userRouter.get("/users", authenticateJWT, getAllUsersController);
userRouter.get("/users/:id", authenticateJWT, getUserByIdController);
userRouter.post("/users", validateBody(UserSchema), createUserController);
userRouter.put(
  "/users/:id",
  authenticateJWT,
  validateBody(UserSchema),
  updateUserController
);
userRouter.delete("/users/:id", authenticateJWT, deleteUserController);
userRouter.put(
  "/users/:id/password",
  authenticateJWT, // <-- Add this!
  validateBody(ChangePasswordSchema),
  changeUserPasswordController
);

export default userRouter;
