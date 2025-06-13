import express from "express";
import { CourseSchema } from "../validation/course.Schema.js";
import { validateBody } from "../middleware/validateBody.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddlware.js";
import {
  createCourseController,
  updateCourseController,
  deleteCourseController,
  getAllCoursesController,
  getCourseByIdController,
  searchCoursesController,
  getCoursesByCategoryController,
  getCoursesByStatusController,
} from "../controllers/courses.controller.js";

const coursesRouter = express.Router();

// Course CRUD operations
coursesRouter.post(
  "/course",
  authenticateJWT,
  requireRole("instructor", "admin"),
  validateBody(CourseSchema),
  createCourseController
);

coursesRouter.put(
  "/course/:id",
  authenticateJWT,
  requireRole("instructor", "admin"),
  validateBody(CourseSchema),
  updateCourseController
);

coursesRouter.delete(
  "/course/:id",
  authenticateJWT,
  requireRole("instructor", "admin"),
  deleteCourseController
);

// Course retrieval routes
coursesRouter.get("/course", getAllCoursesController);
coursesRouter.get("/course/:id", getCourseByIdController);

// Search and filtered routes
coursesRouter.get("/course/search", searchCoursesController); // Now uses query params
coursesRouter.get("/course/category/:categoryId", getCoursesByCategoryController);
coursesRouter.get("/course/status/filter", getCoursesByStatusController); // Uses query params for is_published and is_approved

export default coursesRouter;
