import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validateBody.js";
import { submissionSchema } from "../validation/submissions.Schema.js";
import {
  createSubmissionController,
  getSubmissionByIdController,
  getAllSubmissionsForAssignmentController,
  updateSubmissionController,
  deleteSubmissionController,
} from "../controllers/submissions.controller.js";

const submissionRouter = express.Router();

// Create submission
submissionRouter.post(
  "/submissions",
  authenticateJWT,
  validateBody(submissionSchema),
  createSubmissionController
);

// Get submission by ID
submissionRouter.get(
  "/submissions/:id",
  authenticateJWT,
  getSubmissionByIdController
);

// Get all submissions for an assignment
submissionRouter.get(
  "/assignments/:assignment_id/submissions",
  authenticateJWT,
  getAllSubmissionsForAssignmentController
);

// Update submission (grade/feedback)
submissionRouter.put(
  "/submissions/:id",
  authenticateJWT,
  validateBody(submissionSchema),
  updateSubmissionController
);

// Delete submission
submissionRouter.delete(
  "/submissions/:id",
  authenticateJWT,
  deleteSubmissionController
);

export default submissionRouter;
