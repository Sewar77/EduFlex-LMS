import { query } from "../config/db.js";
import { getPendingCourses } from "../models/course.model.js"; // Make sure this is implemented


export async function getPendingCoursesController(req, res) {
  try {
    const courses = await getPendingCourses();
    res.json(courses);
  } catch (err) {
    console.error("Error fetching pending courses:", err);
    res.status(500).json({ message: "Failed to fetch pending courses" });
  }
}

export async function reviewCourseController(req, res) {
  const courseId = Number(req.params.id);
  const { isApproved } = req.body;

  if (!Number.isInteger(courseId)) {
    return res.status(400).json({ message: "Invalid course ID" });
  }

  if (typeof isApproved !== "boolean") {
    return res.status(400).json({ message: "Invalid approval status" });
  }

  try {
    const result = await query(
      `UPDATE courses 
       SET is_approved = $1 
       WHERE id = $2 
       RETURNING *`,
      [isApproved, courseId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({
      message: isApproved ? "Course approved successfully" : "Course rejected",
      course: result.rows[0],
    });
  } catch (err) {
    console.error("Error reviewing course:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
