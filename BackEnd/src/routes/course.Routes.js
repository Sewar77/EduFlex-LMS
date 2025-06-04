import express from "express";
import { CourseSchema } from "../validation/course.Schema.js";
import { validateBody } from "../middleware/validateBody.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { CourseSearchSchema } from "../validation/search.Schema.js";
import { requireRole } from "../middleware/roleMiddlware.js";
import {
  createCourseController,
  updateCourseController,
  deleteCourseController,
  getAllCoursesController,
  getCourseByIdController,
  searchCoursesController,
} from "../controllers/courses.controller.js";

const coursesRouter = express.Router();

// Courses
coursesRouter.post(
  "/courses",
  authenticateJWT,
  requireRole("instructor", "admin"),
  validateBody(CourseSchema),
  createCourseController
);
coursesRouter.put(
  "/courses/:id",
  authenticateJWT,
  requireRole("instructor", "admin"),
  validateBody(CourseSchema),
  updateCourseController
);

coursesRouter.delete(
  "/courses/:id",
  authenticateJWT,
  requireRole("instructor", "admin"),
  deleteCourseController
);

coursesRouter.get("/courses", getAllCoursesController);
coursesRouter.get("/courses/:id", getCourseByIdController);
coursesRouter.post(
  "/courses/search",
  validateBody(CourseSearchSchema),
  searchCoursesController
);

export default coursesRouter;
