import {
  enrollCourse,
  unenrollCourse,
  getUserEnrollments,
  isUserEnrolled,
  getAllEnrollments,
  getCourseEnrollments,
} from "../models/enrollments.model.js";

//user enroll course
export async function enrollCourseController(req, res) {
  const user_id = Number(req.user.id);
  const course_id = Number(req.params.course_id);
  console.log("req.user.id:", req.user.id);
  console.log("req.params.course_id:", req.params.course_id);
  if (!Number.isInteger(user_id) || !Number.isInteger(course_id)) {
    return res.status(400).json({ message: "Invalid user id model " });
  }
  try {
    const result = await enrollCourse({ user_id, course_id });
    if (result === false) {
      return res.status(409).json({
        message: "User is already enrollment",
      });
    }
    if (result === null) {
      return res.status(400).json({ message: "Invalid user Id" });
    }
    return res.status(201).json({
      message: "User enrolled successfully",
    });
  } catch (err) {
    console.error("Can't enroll course:", err);
    res
      .status(500)
      .json({ message: "Failed to enroll courses. Please try again later." });
  }
}

//user enroll course
export async function unenrollCourseController(req, res) {
  const user_id = Number(req.user.id);
  const course_id = Number(req.params.course_id);
  if (!Number.isInteger(user_id) || !Number.isInteger(course_id)) {
    return res.status(400).json({ message: "invalid user id" });
  }
  try {
    const result = await unenrollCourse({ user_id, course_id });
    if (result === false) {
      return res.status(404).json({
        message: "User is not enroll in this course",
      });
    }

    return res.status(200).json({
      message: "User Unenrollment seccessfuly",
    });
  } catch (err) {
    console.error("Can't unenroll courses:", err);
    res
      .status(500)
      .json({ message: "Failed to unenroll courses. Please try again later." });
  }
}

export async function getUserEnrollmentsControllers(req, res) {
  const user_id = req.user?.id;

  if (!Number.isInteger(user_id)) {
    console.log("user enroll invalid: ", user_id);
    return res.status(400).json({ message: "invalid user id enroll " });
  }

  try {
    const result = await getUserEnrollments(user_id);

    if (result === false) {
      return res.status(200).json({ message: "there is no enrolments" });
    }

    const mappedResult = result.map((row) => ({
      course: {
        _id: row.course_id,
        title: row.title || "Untitled Course",
        thumbnail: row.thumbnail || "/default-course.jpg",
        instructor: {
          name: row.instructor_name || "Unknown Instructor",
        },
      },
      enrollmentDate: row.enrolled_at,
      progress: row.progress || 0,
    }));

    return res.status(200).json({ result: mappedResult });
  } catch (err) {
    console.error("Can't get courses:", err);
    res.status(500).json({
      message: "Failed to get courses. Please try again later.",
    });
  }
}

export async function isUserEnrolledController(req, res) {
  const user_id = Number(req.params.user_id);
  const course_id = Number(req.params.course_id);
  if (!Number.isInteger(user_id) || !Number.isInteger(course_id)) {
    return res.status(400).json({ message: "invalid user id" });
  }
  try {
    const result = await isUserEnrolled({ user_id, course_id });
    return res.status(200).json({ result });
  } catch (err) {
    console.error("Can't get the course", err);
    res.status(500).json({
      message: "Failed to get course. Please try again later.",
    });
  }
}

export async function getAllEnrollmentsController(req, res) {
  try {
    const result = await getAllEnrollments();
    return res.status(200).json({ result });
  } catch (err) {
    console.error("Can't get the course", err);
    res.status(500).json({
      message: "Failed to get course. Please try again later.",
    });
  }
}

export async function getCourseEnrollmentsController(req, res) {
  const course_id = Number(req.params.course_id);
  if (!Number.isInteger(course_id)) {
    return res.status(400).json({ message: "Invalid course id" });
  }
  try {
    const result = await getCourseEnrollments(course_id);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Can't get course enrollments:", err);
    res.status(500).json({
      message: "Failed to get course enrollments. Please try again later.",
    });
  }
}
