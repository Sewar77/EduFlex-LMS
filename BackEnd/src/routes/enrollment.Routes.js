import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import {
  enrollCourseController,
  getCourseEnrollmentsController,
  unenrollCourseController,
  getUserEnrollmentsControllers,
  isUserEnrolledController,
  getAllEnrollmentsController,
} from "../controllers/enrollments.controller.js";

const enrollmentsRouter = express.Router();

// Enrollment
enrollmentsRouter.post(
  "/courses/:course_id/enroll/:user_id",
  authenticateJWT,
  enrollCourseController
);
enrollmentsRouter.delete(
  "/courses/:course_id/enroll/:user_id",
  authenticateJWT,
  unenrollCourseController
);
enrollmentsRouter.get(
  "/users/:user_id/enrollments",
  authenticateJWT,
  getUserEnrollmentsControllers
);
enrollmentsRouter.get(
  "/courses/:course_id/enrollments/:user_id/status",
  authenticateJWT,
  isUserEnrolledController
);
enrollmentsRouter.get(
  "/enrollments",
  authenticateJWT,
  getAllEnrollmentsController
);
enrollmentsRouter.get(
  "/courses/:course_id/enrollments",
  authenticateJWT,
  getCourseEnrollmentsController
);

export default enrollmentsRouter;
