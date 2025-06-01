import {
  createUserController,
  updateUserController,
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  // getUserByEmailController,
  changeUserPasswordController,
} from "../controllers/user.controller.js";

import {
  createCourseController,
  updateCourseController,
  deleteCourseController,
  getAllCoursesController,
  getCourseByIdController,
  searchCoursesController,
} from "../controllers/courses.controller.js";
import {
  enrollCourseController,
  getCourseEnrollmentsController,
  unenrollCourseController,
  getUserEnrollmentsControllers,
  isUserEnrolledController,
  getAllEnrollmentsController,
} from "../controllers/enrollments.controller.js";
import express from "express";
import { validateBody } from "../middleware/validateBody.js";
import { CourseSchema } from "../validation/course.Schema.js";
import { registerSchema } from "../validation/register.Schema.js";
import { loginSchema } from "../validation/login.Schema.js";
import { UserSchema } from "../validation/user.Schema.js";
import { CourseSearchSchema } from "../validation/search.Schema.js";
//import { isAuthenticated } from "../middleware/authMiddleware.js";
import { ChangePasswordSchema } from "../validation/changePassword.Schema.js";
import {
  getCurrentLogInInfo,
  logout,
  Login,
  Register,
} from "../controllers/auth.controller.js";
import {
  googleAuth,
  googleCallBack,
  refreshToken,
} from "../controllers/auth.controller.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
const router = express.Router();

//home
router.get("/", (req, res) => {
  res.send("home page");
});

// Auth
router.post("/auth/register", validateBody(registerSchema), Register);
router.post("/auth/login", validateBody(loginSchema), Login);
router.post("/auth/refresh-token", refreshToken);

// Google OAuth
router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleCallBack);

// Current user info
//router.get("/me", isAuthenticated, getCurrentLogInInfo);
router.get("/me", authenticateJWT, getCurrentLogInInfo);
router.get("/logout", authenticateJWT, logout);

// Users
router.get("/users", authenticateJWT, getAllUsersController);
router.get("/users/:id", authenticateJWT, getUserByIdController);
router.post("/users", validateBody(UserSchema), createUserController);
router.put(
  "/users/:id",
  authenticateJWT,
  validateBody(UserSchema),
  updateUserController
);
router.delete("/users/:id", authenticateJWT, deleteUserController);
router.put(
  "/users/:id/password",
  validateBody(ChangePasswordSchema),
  changeUserPasswordController
);

// Courses
router.post(
  "/courses",
  authenticateJWT,
  validateBody(CourseSchema),
  createCourseController
);
router.put(
  "/courses/:id",
  authenticateJWT,
  validateBody(CourseSchema),
  updateCourseController
);
router.delete("/courses/:id", authenticateJWT, deleteCourseController);
router.get("/courses", getAllCoursesController);
router.get("/courses/:id", getCourseByIdController);
router.post(
  "/courses/search",
  validateBody(CourseSearchSchema),
  searchCoursesController
);

// Enrollment (add isAuthenticated as needed)
router.post(
  "/courses/:course_id/enroll/:user_id",
  authenticateJWT,
  enrollCourseController
);
router.delete(
  "/courses/:course_id/enroll/:user_id",
  authenticateJWT,
  unenrollCourseController
);
router.get(
  "/users/:user_id/enrollments",
  authenticateJWT,
  getUserEnrollmentsControllers
);
router.get(
  "/courses/:course_id/enrollments/:user_id/status",
  authenticateJWT,
  isUserEnrolledController
);
router.get("/enrollments", authenticateJWT, getAllEnrollmentsController);
router.get(
  "/courses/:course_id/enrollments",
  authenticateJWT,
  getCourseEnrollmentsController
);
export default router;
