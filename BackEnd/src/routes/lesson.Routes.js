import { lessonSchema } from "../validation/lesson.Schema.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import express from "express";
import { validateBody } from "../middleware/validateBody.js";
import { requireRole } from "../middleware/roleMiddlware.js";
import {
  createLessonController,
  deleteLessonController,
  getAllLessonsForModuleController,
  getLessonByIdController,
  updateLessonController,
  getLessonContentController
} from "../controllers/lessons.controller.js";

const lessonRouter = express.Router();

// Create lesson
lessonRouter.post(
  "/lessons",
  authenticateJWT,
  requireRole("instructor", "admin"),
  validateBody(lessonSchema),
  createLessonController
);

// Get all lessons for a module
lessonRouter.get(
  "/modules/:module_id/lessons",
  authenticateJWT,
  getAllLessonsForModuleController
);

// Get lesson by ID
lessonRouter.get(
  "/lessons/:lessonId",
  authenticateJWT,
  getLessonByIdController
);

// Update lesson
lessonRouter.put(
  "/lessons/:id",
  authenticateJWT,
  requireRole("instructor", "admin"),
  validateBody(lessonSchema),
  updateLessonController
);

// Delete lesson
lessonRouter.delete(
  "/lessons/:id",
  authenticateJWT,
  requireRole("instructor", "admin"),
  deleteLessonController
);


lessonRouter.get(
  "/lessons/:lessonId/content",
  authenticateJWT,
  requireRole("instructor", "admin", "student"),
  getLessonContentController
);


export default lessonRouter;
