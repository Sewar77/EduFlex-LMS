import express from "express";
import {
  markLessonCompleteController,
  checkLessonCompletionController,
} from "../controllers/lesson_completion.controller.js";
import { authenticateJWT } from "../middleware/authMiddleware.js"; // Adjust as needed

const LessonCompleterouter = express.Router();

LessonCompleterouter.post(
  "/lessons/:lessonId/complete",
  authenticateJWT,
  markLessonCompleteController
);
LessonCompleterouter.get(
  "/lessons/:lessonId/completion",
  authenticateJWT,
  checkLessonCompletionController
);

export default LessonCompleterouter;
