import {
  createQuiz,
  getQuizById,
  getAllQuizzesForLesson,
  updateQuiz,
  deleteQuiz,
} from "../models/quizzes.models.js";

// Create quiz
export async function createQuizController(req, res) {
  try {
    const quizInfo = { ...req.body };
    const result = await createQuiz(quizInfo);
    if (result) {
      return res.status(201).json({
        success: true,
        message: "Quiz created successfully.",
        data: result,
      });
    }
    return res.status(400).json({
      success: false,
      message: "Cannot create quiz.",
    });
  } catch (err) {
    console.error("Can't create quiz:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create quiz. Please try again later.",
    });
  }
}

// Get quiz by ID
export async function getQuizByIdController(req, res) {
  const quiz_id = Number(req.params.id);
  if (!Number.isInteger(quiz_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid quiz ID",
    });
  }
  try {
    const result = await getQuizById(quiz_id);
    if (result) {
      return res.status(200).json({
        success: true,
        data: result,
      });
    }
    return res.status(404).json({
      success: false,
      message: "Quiz not found.",
    });
  } catch (err) {
    console.error("Can't get quiz:", err);
    res.status(500).json({
      success: false,
      message: "Failed to get quiz. Please try again later.",
    });
  }
}

// Get all quizzes for a lesson
export async function getAllQuizzesForLessonController(req, res) {
  const lesson_id = Number(req.params.lesson_id);
  if (!Number.isInteger(lesson_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid lesson ID",
    });
  }
  try {
    const result = await getAllQuizzesForLesson(lesson_id);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Can't get quizzes:", err);
    res.status(500).json({
      success: false,
      message: "Failed to get quizzes. Please try again later.",
    });
  }
}

// Update quiz
export async function updateQuizController(req, res) {
  const quiz_id = Number(req.params.id);
  if (!Number.isInteger(quiz_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid quiz ID",
    });
  }
  try {
    const quizInfo = { ...req.body, id: quiz_id };
    const result = await updateQuiz(quizInfo);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Quiz updated successfully.",
        data: result,
      });
    }
    return res.status(404).json({
      success: false,
      message: "Quiz not found.",
    });
  } catch (err) {
    console.error("Can't update quiz:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update quiz. Please try again later.",
    });
  }
}

// Delete quiz
export async function deleteQuizController(req, res) {
  const quiz_id = Number(req.params.id);
  if (!Number.isInteger(quiz_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid quiz ID",
    });
  }
  try {
    const result = await deleteQuiz(quiz_id);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Quiz deleted successfully.",
      });
    }
    return res.status(404).json({
      success: false,
      message: "Quiz not found.",
    });
  } catch (err) {
    console.error("Can't delete quiz:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete quiz. Please try again later.",
    });
  }
}
