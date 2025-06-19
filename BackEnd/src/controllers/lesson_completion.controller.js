import {
  markLessonComplete,
  isLessonCompleted,
} from "../models/lesson_completion.model.js";
import { query } from "../config/db.js";
import { updateEnrollmentProgress } from "../models/enrollments.model.js";

export async function checkLessonCompletionController(req, res) {
  const user_id = req.user.id;
  const lesson_id = Number(req.params.lessonId);

  if (!Number.isInteger(lesson_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid lesson ID",
    });
  }

  try {
    const completed = await isLessonCompleted(user_id, lesson_id);
    return res.status(200).json({
      success: true,
      completed,
    });
  } catch (error) {
    console.error("Error checking lesson completion:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check lesson completion",
    });
  }
}


export async function markLessonCompleteController(req, res) {
  const user_id = req.user.id;
  const lesson_id = Number(req.params.lessonId);

  if (!Number.isInteger(lesson_id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid lesson ID" });
  }

  try {
    const alreadyMarked = await markLessonComplete(user_id, lesson_id);

    // Get course_id from lesson
    const courseResult = await query(
      `
      SELECT m.course_id
      FROM lessons l
      JOIN modules m ON l.module_id = m.id
      WHERE l.id = $1
    `,
      [lesson_id]
    );

    const course_id = courseResult.rows[0]?.course_id;

    if (!course_id) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Update progress
    const progress = await updateEnrollmentProgress(user_id, course_id);

    return res.status(200).json({
      success: true,
      message: alreadyMarked
        ? "Lesson already marked as complete"
        : "Lesson marked as complete",
      progress,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Error marking lesson" });
  }
}