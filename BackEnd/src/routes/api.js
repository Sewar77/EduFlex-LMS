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
import { UserSchema } from "../validation/user.Schema.js";
import { CourseSearchSchema } from "../validation/search.Schema.js";
import { ChangePasswordSchema } from "../validation/changePassword.Schema.js";
import { getCurrentLogInInfo, logout, Login, Register } from "../controllers/auth.controller.js";

const router = express.Router();

//home
router.get("/", (req, res) => {
  res.send("home page");
});

// ==================== Google AOAuth ====================
router.get("/google", googleAuth);
router.get("/google/callback", googleCallBack);

router.get("/users", isAuthenticated, getCurrentLogInInfo);
router.get("/logout", isAuthenticated, logout);
router.get("/users", refreshToken);


// ==================== Users ====================
router.get("/users", getAllUsersController);

router.get("/users/:id", getUserByIdController);

router.post("/users", validateBody(UserSchema), createUserController);

router.put("/users/:id", validateBody(UserSchema), updateUserController);

router.delete("/users/:id", deleteUserController);

//router.get("/users/email", getUserByEmailController);

router.put(
  "/users/:id/password",
  validateBody(ChangePasswordSchema),
  changeUserPasswordController
);
// ==================== Courses ====================
router.post("/courses", validateBody(CourseSchema), createCourseController);

router.put("/courses/:id", validateBody(CourseSchema), updateCourseController);

router.delete("/courses/:id", deleteCourseController);

router.get("/courses", getAllCoursesController);

router.get("/courses/:id", getCourseByIdController);

router.post(
  "/course/search",
  validateBody(CourseSearchSchema),
  searchCoursesController
);
// ==================== Enrollment ====================
router.post("/courses/:course_id/enroll/:user_id", enrollCourseController);

router.delete("/courses/:course_id/enroll/:user_id", unenrollCourseController);

router.get("/users/:user_id/enrollments", getUserEnrollmentsControllers);
router.get(
  "/courses/:course_id/enrollments/:user_id/status",
  isUserEnrolledController
);
router.get("/enrollments", getAllEnrollmentsController);
router.get("/courses/:course_id/enrollments", getCourseEnrollmentsController);

export default router;