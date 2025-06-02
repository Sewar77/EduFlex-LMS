import {
  createSubmission,
  getSubmissionById,
  getAllSubmissionsForAssignment,
  updateSubmission,
  deleteSubmission,
} from "../models/submissions.models.js";

// Create submission
export async function createSubmissionController(req, res) {
  try {
    const submissionInfo = { ...req.body };
    const result = await createSubmission(submissionInfo);
    if (result) {
      return res.status(201).json({
        success: true,
        message: "Submission created successfully.",
        data: result,
      });
    }
    return res.status(400).json({
      success: false,
      message: "Cannot create submission.",
    });
  } catch (err) {
    console.error("Can't create submission:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create submission. Please try again later.",
    });
  }
}

// Get submission by ID
export async function getSubmissionByIdController(req, res) {
  const submission_id = Number(req.params.id);
  if (!Number.isInteger(submission_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid submission ID",
    });
  }
  try {
    const result = await getSubmissionById(submission_id);
    if (result) {
      return res.status(200).json({
        success: true,
        data: result,
      });
    }
    return res.status(404).json({
      success: false,
      message: "Submission not found.",
    });
  } catch (err) {
    console.error("Can't get submission:", err);
    res.status(500).json({
      success: false,
      message: "Failed to get submission. Please try again later.",
    });
  }
}

// Get all submissions for an assignment
export async function getAllSubmissionsForAssignmentController(req, res) {
  const assignment_id = Number(req.params.assignment_id);
  if (!Number.isInteger(assignment_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid assignment ID",
    });
  }
  try {
    const result = await getAllSubmissionsForAssignment(assignment_id);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Can't get submissions:", err);
    res.status(500).json({
      success: false,
      message: "Failed to get submissions. Please try again later.",
    });
  }
}

// Update submission (grade/feedback)
export async function updateSubmissionController(req, res) {
  const submission_id = Number(req.params.id);
  if (!Number.isInteger(submission_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid submission ID",
    });
  }
  try {
    const submissionInfo = { ...req.body, id: submission_id };
    const result = await updateSubmission(submissionInfo);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Submission updated successfully.",
        data: result,
      });
    }
    return res.status(404).json({
      success: false,
      message: "Submission not found.",
    });
  } catch (err) {
    console.error("Can't update submission:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update submission. Please try again later.",
    });
  }
}

// Delete submission
export async function deleteSubmissionController(req, res) {
  const submission_id = Number(req.params.id);
  if (!Number.isInteger(submission_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid submission ID",
    });
  }
  try {
    const result = await deleteSubmission(submission_id);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Submission deleted successfully.",
      });
    }
    return res.status(404).json({
      success: false,
      message: "Submission not found.",
    });
  } catch (err) {
    console.error("Can't delete submission:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete submission. Please try again later.",
    });
  }
}
