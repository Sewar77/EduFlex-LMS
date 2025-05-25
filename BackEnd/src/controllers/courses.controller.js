import {
  createCourse,
  updateCourse,
  deletCourse,
  getAllCourses,
  getCourseById,
} from "../models/course.model.js";

//courses
//create course
export async function createCourseController(req, res) {
  try {
    const courseInfo = { ...req.body };
    const createdCourse = await createCourse(courseInfo);
    res.status(201).json(createdCourse);
  } catch (err) {
    console.error(" (controller) REAL DB ERROR:", err);
    res.status(500).json({ error: err.message, full: err.stack });
  }
}

//update course:
export async function updateCourseController(req, res) {
  try {
    const id = req.params.id;
    const courseInfo = { ...req.body, id };
    await updateCourse(courseInfo);
    res.send("course updated");
  } catch (err) {
    console.error("(controller) REAL DB ERROR:", err);
    res.status(500).json({ error: err.message, full: err.stack });
  }
}

//delete course
export async function deleteCourseController(req, res) {
  try {
    const id = req.params.id;
    if (id) {
      await deletCourse(id);
    } else {
      return res.status(400).json("error deleteing course");
    }
  } catch (err) {
    console.error("(controller) REAL DB ERROR:", err);
    res.status(500).json({ error: err.message, full: err.stack });
  }
}

//getAllCourses
export async function getAllCoursesController(req, res) {
  try {
    const allCourses = await getAllCourses();
    res.status(200).json(allCourses);
  } catch (err) {
    console.error("(controller) REAL DB ERROR:", err);
    res.status(500).json({ error: err.message, full: err.stack });
  }
}

//get user by id
export async function getCourseByIdController(req, res) {
  try {
    const id = req.params.id;
    if (id) {
      const course = await getCourseById(id);
      res.status(200).json(course);
    }
  } catch (err) {
    console.error("(controller) REAL DB ERROR:", err);
    res.status(500).json({ error: err.message, full: err.stack });
  }
}
