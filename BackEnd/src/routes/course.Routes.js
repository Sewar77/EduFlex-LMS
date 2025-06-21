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
  getRecommendedCourses,
  fetchInstructorCourses
} from "../controllers/courses.controller.js";

const coursesRouter = express.Router();

// Course CRUD operations
coursesRouter.post(
  "/course",
  authenticateJWT,
  // requireRole("instructor", "admin"),
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


coursesRouter.get(
  "/instructor/my-courses",
  authenticateJWT,
  fetchInstructorCourses
);


// Search and filtered routes
coursesRouter.get("/course/search", searchCoursesController); // Now uses query params

// Course retrieval routes
coursesRouter.get("/course", authenticateJWT, getAllCoursesController);

coursesRouter.get(
  "/course/recommended",
  authenticateJWT,
  getRecommendedCourses
);

coursesRouter.get("/course/:id", authenticateJWT, getCourseByIdController);

coursesRouter.get(
  "/course/category/:categoryId",
  authenticateJWT,
  getCoursesByCategoryController
);
coursesRouter.get(
  "/course/status/filter",
  authenticateJWT,
  getCoursesByStatusController
); // Uses query params for is_published and is_approved

export default coursesRouter;
