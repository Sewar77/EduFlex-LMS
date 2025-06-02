import {
  createLesson,
  getAllLessonsForModule,
  getLessonById,
  updateLesson,
  deleteLesson,
} from "../models/lessons.model.js";

// Create lesson
export async function createLessonController(req, res) {
  try {
    const lessonsInfo = { ...req.body };
    const result = await createLesson(lessonsInfo);
    if (result) {
      return res.status(201).json({
        success: true,
        message: "Lesson created successfully.",
        data: result,
      });
    }
    return res.status(400).json({
      success: false,
      message: "Cannot create lesson.",
    });
  } catch (err) {
    console.error("Can't create new lesson:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create lesson. Please try again later.",
    });
  }
}

// Update lesson
export async function updateLessonController(req, res) {
  const lesson_id = Number(req.params.id);
  if (!Number.isInteger(lesson_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid lesson ID",
    });
  }
  try {
    const lessonsInfo = { ...req.body, id: lesson_id };
    const result = await updateLesson(lessonsInfo);
    if (result !== null) {
      return res.status(200).json({
        success: true,
        message: "Lesson updated successfully.",
        data: result,
      });
    }
    return res.status(404).json({
      success: false,
      message: "Lesson not found.",
    });
  } catch (err) {
    console.error("Can't update lesson:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update lesson. Please try again later.",
    });
  }
}

// Delete lesson
export async function deleteLessonController(req, res) {
  const lesson_id = Number(req.params.id);
  if (!Number.isInteger(lesson_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid lesson ID",
    });
  }
  try {
    const result = await deleteLesson(lesson_id);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Lesson deleted successfully.",
      });
    }
    return res.status(404).json({
      success: false,
      message: "Lesson not found.",
    });
  } catch (err) {
    console.error("Can't delete lesson:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete lesson. Please try again later.",
    });
  }
}

// Get all lessons for a module
export async function getAllLessonsForModuleController(req, res) {
  const module_id = Number(req.params.module_id);
  if (!Number.isInteger(module_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid module ID",
    });
  }
  try {
    const result = await getAllLessonsForModule(module_id);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Can't get lessons:", err);
    res.status(500).json({
      success: false,
      message: "Failed to get lessons. Please try again later.",
    });
  }
}

// Get lesson by ID
export async function getLessonByIdController(req, res) {
  const lesson_id = Number(req.params.id);
  if (!Number.isInteger(lesson_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid lesson ID",
    });
  }
  try {
    const result = await getLessonById(lesson_id);
    if (result) {
      return res.status(200).json({
        success: true,
        data: result,
      });
    }
    return res.status(404).json({
      success: false,
      message: "Lesson not found.",
    });
  } catch (err) {
    console.error("Can't find lesson:", err);
    res.status(500).json({
      success: false,
      message: "Failed to find lesson. Please try again later.",
    });
  }
}
