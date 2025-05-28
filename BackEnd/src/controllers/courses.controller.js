import {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  searchCourses,
} from "../models/course.model.js";

//create course
export async function createCourseController(req, res) {
  try {
    const courseInfo = { ...req.body };
    const createdCourse = await createCourse(courseInfo);
    return res.status(201).json(createdCourse);
  } catch (err) {
    console.error("Can't create new course:", err);
    res
      .status(500)
      .json({ message: "Failed to create course. Please try again later." });
  }
}

//update course:
export async function updateCourseController(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid course ID." });
  }
  try {
    const courseInfo = { ...req.body, id };
    const updatedCourse = await updateCourse(courseInfo);
    if (updatedCourse !== null) {
      return res.status(200).json({ message: "Course Updated Successfly. " });
    } else {
      return res.status(404).json({ message: "Course not exist" });
    }
  } catch (err) {
    console.error("Can't update new course:", err);
    res
      .status(500)
      .json({ message: "Failed to update course. Please try again later." });
  }
}

//delete course
export async function deleteCourseController(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid course id" });
  }
  try {
    const result = await deleteCourse(id);
    if (result === true) {
      return res.status(200).json({ message: "Course deleted Successfuly. " });
    } else {
      return res.status(404).json({ message: "Course Not Found " });
    }
  } catch (err) {
    console.error("Can't delete course:", err);
    res
      .status(500)
      .json({ message: "Failed to delete course. Please try again later." });
  }
}

//getAllCourses
export async function getAllCoursesController(req, res) {
  try {
    const allCourses = await getAllCourses();
    return res.status(200).json(allCourses);
  } catch (err) {
    console.error("Can't get courses:", err);
    res
      .status(500)
      .json({ message: "Failed to get courses. Please try again later." });
  }
}

//get user by id
export async function getCourseByIdController(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid course id" });
  }
  try {
    const course = await getCourseById(id);
    if (!course) {
      return res.status(404).json({ message: "Course is not found." });
    }
    return res.status(200).json(course);
  } catch (err) {
    console.error("Can't get the selected course", err);
    res.status(500).json({
      message: "Failed to get the selected course. Please try again later.",
    });
  }
}




export async function searchCoursesController(req, res) {
  const { keyword } = req.body;
  try {
    const result = await searchCourses(keyword);
    if (!result.length) {
      return res.status(404).json({ message: "No courses found." });
    }
    return res.status(200).json({ result });
  } catch (err) {
    console.error("Can't search courses: ", err);
    res.status(500).json({
      message: "Failed to search courses. Please try again later.",
    });
  }
}






