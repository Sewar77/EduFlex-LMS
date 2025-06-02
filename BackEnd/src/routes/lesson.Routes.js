import { lessonSchema } from "../validation/lesson.Schema.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import express from "express";
import { validateBody } from "../middleware/validateBody.js";
import {
  createLessonController,
  deleteLessonController,
  getAllLessonsForModuleController,
  getLessonByIdController,
  updateLessonController,
} from "../controllers/lessons.controller.js";

const lessonRouter = express.Router();

// Create lesson
lessonRouter.post(
  "/lessons",
  authenticateJWT,
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
lessonRouter.get("/lessons/:id", authenticateJWT, getLessonByIdController);

// Update lesson
lessonRouter.put(
  "/lessons/:id",
  authenticateJWT,
  validateBody(lessonSchema),
  updateLessonController
);

// Delete lesson
lessonRouter.delete("/lessons/:id", authenticateJWT, deleteLessonController);

export default lessonRouter;
