import {
  createQuiz,
  getQuizById,
  getAllQuizzesForLesson,
  updateQuiz,
  deleteQuiz,
  calculateAndSaveAttempt,
} from "../models/quizzes.models.js";

// Create quiz
export async function createQuizController(req, res) {
  try {
    const { lesson_id, quizzes } = req.body;
    if (!Array.isArray(quizzes) || quizzes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Quiz questions are required.",
      });
    }

    const inserted = [];

    for (const quiz of quizzes) {
      const result = await createQuiz({
        lesson_id,
        question: quiz.question,
        options: quiz.options,
        correct_answer: quiz.correct_answer,
        max_score: quiz.max_score ?? 10,
      });
      if (result) inserted.push(result);
    }

    return res.status(201).json({
      success: true,
      message: "All quiz questions added.",
      data: inserted,
    });
  } catch (err) {
    console.error("Can't create quizzes:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create quiz questions.",
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



export const submitQuiz = async (req, res) => {
  const { lessonId } = req.params;
  const { answers } = req.body;
  const userId = req.user.id;

  try {
    const { score, correctAnswers } = await calculateAndSaveAttempt(
      userId,
      lessonId,
      answers
    );
    res.json({ success: true, score, correctAnswers }); // ✅ include correctAnswers
  } catch (error) {
    console.error("Error submitting quiz:", error);
    if (error.message === "No quizzes found for this lesson") {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
