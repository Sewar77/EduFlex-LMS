import {
  createLesson,
  getAllLessonsForModule,
  getLessonById,
  updateLesson,
  deleteLesson,
  getLessonContent,
} from "../models/lessons.model.js";
import { getQuizById } from "../models/quizzes.models.js";
import { getAssignmentById } from "../models/assignments.models.js";

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

import { isLessonCompleted } from "../models/lesson_completion.model.js";

export async function getLessonByIdController(req, res) {
  const lesson_id = Number(req.params.lessonId);
  const user_id = req.user?.id; // Ensure auth middleware runs before this

  if (!Number.isInteger(lesson_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid lesson ID",
    });
  }

  try {
    const lesson = await getLessonById(lesson_id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const completed = user_id
      ? await isLessonCompleted(user_id, lesson_id)
      : false;

    const content = await getLessonContent(lesson); // 👈 Includes text, video, quiz, or assignment content

    return res.status(200).json({
      success: true,
      data: {
        ...lesson,
        completed,
        content,
      },
    });
  } catch (err) {
    console.error("Error fetching lesson by ID:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to get lesson data",
    });
  }
}


export async function getLessonContentController(req, res) {
  const lessonId = Number(req.params.lessonId);
  if (!Number.isInteger(lessonId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid lesson ID" });
  }
  try {
    // 1. Get lesson (with text/video content info)
    const lesson = await getLessonById(lessonId);
    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }

    // 2. Get quizzes for lesson
    const quizzes = await getQuizById(lessonId);

    // 3. Get assignments for lesson
    const assignments = await getAssignmentById(lessonId);

    // Compose response data
    const content = {
      lessonContent: {
        content_type: lesson.content_type,
        content_url: lesson.content_url,
        title: lesson.title,
        duration: lesson.duration,
        // include other lesson fields if needed
      },
      quizzes,
      assignments,
    };

    return res.status(200).json({
      success: true,
      data: content,
    });
  } catch (err) {
    console.error("Failed to get lesson content:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}