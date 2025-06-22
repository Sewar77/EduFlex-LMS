import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validateBody.js";
import { submissionSchema } from "../validation/submissions.Schema.js";
import { query } from "../config/db.js";
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
submissionRouter.patch("/submissions/:id/grade", async (req, res) => {
  const { id } = req.params;
  const { grade } = req.body;
  await query("UPDATE submissions SET grade = $1 WHERE id = $2", [
    grade,
    id,
  ]);
  res.json({ success: true, grade });
});

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





// Get submissions for a specific assignment
submissionRouter.get(
  "/:assignmentId/submissions",
  authenticateJWT,
  async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const { role } = req.user;

      if (role !== "instructor") {
        return res.status(403).json({ error: "Instructor access required" });
      }

      const result = await query(
        `SELECT s.id, s.user_id, u.name as student_name, 
       s.submission_url, s.submitted_at, s.grade, s.feedback
       FROM submissions s
       JOIN users u ON s.user_id = u.id
       WHERE s.assignment_id = $1`,
        [assignmentId]
      );

      res.json({ submissions: result.rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Grade a submission
submissionRouter.put(
  "/submissions/:submissionId/grade",
  authenticateJWT,
  async (req, res) => {
    try {
      const { submissionId } = req.params;
      const { grade, feedback } = req.body;
      const { role } = req.user;

      if (role !== "instructor") {
        return res.status(403).json({ error: "Instructor access required" });
      }

      await query(
        `UPDATE submissions 
       SET grade = $1, feedback = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
        [grade, feedback, submissionId]
      );

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);














export default submissionRouter;
