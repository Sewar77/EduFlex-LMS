import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validateBody.js";
import { assignmentSchema } from  "../validation/assignments.Schema.js"
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  createAssignmentController,
  getAssignmentByIdController,
  getAllAssignmentsForLessonController,
  updateAssignmentController,
  deleteAssignmentController,
} from "../controllers/assignments.controller.js";
// (Optional) import assignmentSchema if you have validation
// import { assignmentSchema } from "../validation/assignment.Schema.js";

const assignmentRouter = express.Router();

// Create assignment
assignmentRouter.post(
  "/assignments",
  authenticateJWT,
  requireRole("instructor", "admin"),
  validateBody(assignmentSchema), // Uncomment if you have a schema
  createAssignmentController
);

// Get assignment by ID
assignmentRouter.get(
  "/assignments/:id",
  authenticateJWT,
  getAssignmentByIdController
);

// Get all assignments for a lesson
assignmentRouter.get(
  "/lessons/:lesson_id/assignments",
  authenticateJWT,
  getAllAssignmentsForLessonController
);

// Update assignment
assignmentRouter.put(
  "/assignments/:id",
  authenticateJWT,
  requireRole("instructor", "admin"),
  validateBody(assignmentSchema), // Uncomment if you have a schema
  updateAssignmentController
);

// Delete assignment
assignmentRouter.delete(
  "/assignments/:id",
  authenticateJWT,
  requireRole("instructor", "admin"),
  deleteAssignmentController
);


export default assignmentRouter;
