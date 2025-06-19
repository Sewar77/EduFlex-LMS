import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { quizSchema } from "../validation/quize.Schema.js";
import { validateBody } from "../middleware/validateBody.js";
import { requireRole } from "../middleware/roleMiddlware.js";
import {
  createQuizController,
  getQuizByIdController,
  getAllQuizzesForLessonController,
  updateQuizController,
  deleteQuizController,
  submitQuiz
} from "../controllers/quizzes.controller.js";

const quizRouter = express.Router();

// Create quiz
quizRouter.post(
  "/quizzes",
  authenticateJWT,
  requireRole("instructor", "admin"),
  validateBody(quizSchema),
  createQuizController
);

// Get quiz by ID
quizRouter.get("/quizzes/:id", authenticateJWT, getQuizByIdController);

// Get all quizzes for a lesson
quizRouter.get(
  "/lessons/:lesson_id/quizzes",
  authenticateJWT,
  getAllQuizzesForLessonController
);

// Update quiz
quizRouter.put(
  "/quizzes/:id",
  authenticateJWT,
  requireRole("instructor", "admin"),
  validateBody(quizSchema),
  updateQuizController
);

// Delete quiz
quizRouter.delete(
  "/quizzes/:id",
  authenticateJWT,
  requireRole("instructor", "admin"),
  deleteQuizController
);


quizRouter.post(
  "/lessons/:lessonId/quizzes/submit",
  authenticateJWT,
  submitQuiz
);





export default quizRouter;
