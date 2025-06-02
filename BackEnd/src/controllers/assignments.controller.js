import {
  createAssignment,
  getAssignmentById,
  getAllAssignmentsForLesson,
  updateAssignment,
  deleteAssignment,
} from "../models/assignments.models.js";

// Create assignment
export async function createAssignmentController(req, res) {
  try {
    const assignmentInfo = { ...req.body };
    const result = await createAssignment(assignmentInfo);
    if (result) {
      return res.status(201).json({
        success: true,
        message: "Assignment created successfully.",
        data: result,
      });
    }
    return res.status(400).json({
      success: false,
      message: "Cannot create assignment.",
    });
  } catch (err) {
    console.error("Can't create assignment:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create assignment. Please try again later.",
    });
  }
}

// Get assignment by ID
export async function getAssignmentByIdController(req, res) {
  const assignment_id = Number(req.params.id);
  if (!Number.isInteger(assignment_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid assignment ID",
    });
  }
  try {
    const result = await getAssignmentById(assignment_id);
    if (result) {
      return res.status(200).json({
        success: true,
        data: result,
      });
    }
    return res.status(404).json({
      success: false,
      message: "Assignment not found.",
    });
  } catch (err) {
    console.error("Can't get assignment:", err);
    res.status(500).json({
      success: false,
      message: "Failed to get assignment. Please try again later.",
    });
  }
}

// Get all assignments for a lesson
export async function getAllAssignmentsForLessonController(req, res) {
  const lesson_id = Number(req.params.lesson_id);
  if (!Number.isInteger(lesson_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid lesson ID",
    });
  }
  try {
    const result = await getAllAssignmentsForLesson(lesson_id);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Can't get assignments:", err);
    res.status(500).json({
      success: false,
      message: "Failed to get assignments. Please try again later.",
    });
  }
}

// Update assignment
export async function updateAssignmentController(req, res) {
  const assignment_id = Number(req.params.id);
  if (!Number.isInteger(assignment_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid assignment ID",
    });
  }
  try {
    const assignmentInfo = { ...req.body, id: assignment_id };
    const result = await updateAssignment(assignmentInfo);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Assignment updated successfully.",
        data: result,
      });
    }
    return res.status(404).json({
      success: false,
      message: "Assignment not found.",
    });
  } catch (err) {
    console.error("Can't update assignment:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update assignment. Please try again later.",
    });
  }
}

// Delete assignment
export async function deleteAssignmentController(req, res) {
  const assignment_id = Number(req.params.id);
  if (!Number.isInteger(assignment_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid assignment ID",
    });
  }
  try {
    const result = await deleteAssignment(assignment_id);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Assignment deleted successfully.",
      });
    }
    return res.status(404).json({
      success: false,
      message: "Assignment not found.",
    });
  } catch (err) {
    console.error("Can't delete assignment:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete assignment. Please try again later.",
    });
  }
}
