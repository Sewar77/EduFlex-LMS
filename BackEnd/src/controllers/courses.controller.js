import {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  searchCourses,
  getLatestCourses,
} from "../models/course.model.js";

// Create course
export async function createCourseController(req, res) {
  try {
    const {
      title,
      description,
      instructor_id,
      category_id,
      thumbnail_url,
      is_published = false,
      is_approved = false,
    } = { ...req.body };

    if (!title || !description || !instructor_id) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    const courseInfo = {
      title,
      description,
      instructor_id,
      category_id,
      thumbnail_url,
      is_published,
      is_approved,
    };

    const createdCourse = await createCourse(courseInfo);
    return res.status(201).json(createdCourse);
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({
      message: "Failed to create course. Please try again later.",
      error: err.message,
    });
  }
}

// Update course
export async function updateCourseController(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid course ID..." });
  }

  try {
    const {
      title,
      description,
      instructor_id,
      category_id,
      thumbnail_url,
      is_published,
      is_approved,
    } = { ...req.body };

    if (!title || !description || !instructor_id) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    const courseInfo = {
      id,
      title,
      description,
      instructor_id,
      category_id,
      thumbnail_url,
      is_published,
      is_approved,
    };

    const updatedCourse = await updateCourse(courseInfo);
    if (updatedCourse) {
      return res.status(200).json(updatedCourse);
    } else {
      return res.status(404).json({ message: "Course not found." });
    }
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).json({
      message: "Failed to update course. Please try again later.",
      error: err.message,
    });
  }
}

// Delete course
export async function deleteCourseController(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Invalid course ID.." });
  }

  try {
    const deleted = await deleteCourse(id);
    if (deleted) {
      return res.status(200).json({ message: "Course deleted successfully." });
    } else {
      return res.status(404).json({ message: "Course not found." });
    }
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({
      message: "Failed to delete course. Please try again later.",
      error: err.message,
    });
  }
}
// Get all courses
export async function getAllCoursesController(req, res) {
  try {
    const { is_published, is_approved } = req.query;
    
    // If status filters are provided, use getCoursesByStatus
    if (is_published !== undefined || is_approved !== undefined) {
      const published = is_published ? is_published === 'true' : undefined;
      const approved = is_approved ? is_approved === 'true' : undefined;
      return getCoursesByStatusController(req, res);
    }

    const courses = await getAllCourses();
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: err.message
    });
  }
}

// Get course by ID
export async function getCourseByIdController(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid course ID...." 
    });
  }
  try {
    const course = await getCourseById(id);
    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: "Course not found" 
      });
    }
    return res.status(200).json({
      success: true,
      data: course
    });
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: err.message
    });
  }
}

// Search courses
export async function searchCoursesController(req, res) {
  const { keyword } = req.query;
  if (!keyword || keyword.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Search keyword is required",
    });
  }
  try {
    const courses = await searchCourses(keyword.trim());
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (err) {
    console.error("Error searching courses:", err);
    res.status(500).json({
      success: false,
      message: "Failed to search courses",
      error: err.message,
    });
  }
}

// Get courses by category
export async function getCoursesByCategoryController(req, res) {
  const categoryId = Number(req.params.categoryId);
  if (!Number.isInteger(categoryId)) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid category ID" 
    });
  }
  try {
    const courses = await getCoursesByCategory(categoryId);
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (err) {
    console.error("Error fetching courses by category:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses by category",
      error: err.message
    });
  }
}

export async function getCoursesByStatusController(req, res) {
  try {
    const is_published = req.query.is_published === 'true';
    const is_approved = req.query.is_approved === 'true';
    const courses = await getCoursesByStatus(is_published, is_approved);
    return res.status(200).json({
      success: true,
      count: courses.length,
      filters: {
        is_published,
        is_approved
      },
      data: courses
    });
  } catch (err) {
    console.error("Error fetching courses by status:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses by status",
      error: err.message
    });
  }
}



export const getRecommendedCourses = async (req, res) => {
  try {
    const courses = await getLatestCourses();
    res.status(200).json({ success: true, courses }); // ✅ this must be .json()
  } catch (error) {
    console.error("Error in getRecommendedCourses:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
