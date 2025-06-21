import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import {
  enrollCourseController,
  getCourseEnrollmentsController,
  unenrollCourseController,
  getUserEnrollmentsControllers,
  isUserEnrolledController,
  getAllEnrollmentsController,
  getEnrollmentProgressController,
} from "../controllers/enrollments.controller.js";




const enrollmentsRouter = express.Router();



enrollmentsRouter.get(
  "/progress",
  authenticateJWT,
  getEnrollmentProgressController
);



// Enrollment
enrollmentsRouter.post(
  "/courses/:course_id/enroll",
  authenticateJWT,
  enrollCourseController
);

enrollmentsRouter.delete(
  "/courses/:course_id/enroll",
  authenticateJWT,
  unenrollCourseController
);

enrollmentsRouter.get(
  "/enrollments/my-courses",
  authenticateJWT,
  getUserEnrollmentsControllers
);

enrollmentsRouter.get(
  "/courses/:course_id/enrollments/:user_id/status",
  authenticateJWT,
  isUserEnrolledController
);

enrollmentsRouter.get(
  "/enrollments",
  authenticateJWT,
  getAllEnrollmentsController
);

enrollmentsRouter.get(
  "/courses/:course_id/enrollments",
  authenticateJWT,
  getCourseEnrollmentsController
);


// routes/enrollments.js
enrollmentsRouter.get("/progress", authenticateJWT, async (req, res) => {
  try {
    // Get enrollments with progress data
    const enrollments = await Enrollment.findAll({
      attributes: ["id", "user_id", "progress", "enrolled_at", "completed_at"],
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
      order: [["progress", "DESC"]],
    });

    // Calculate days enrolled
    const data = enrollments.map((enrollment) => ({
      id: enrollment.id,
      user_id: enrollment.user_id,
      user_name: enrollment.User.name,
      progress: enrollment.progress,
      enrolled_at: enrollment.enrolled_at,
      completed_at: enrollment.completed_at,
      days_enrolled: Math.floor(
        (new Date() - new Date(enrollment.enrolled_at)) / (1000 * 60 * 60 * 24)
      ),
    }));

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



export default enrollmentsRouter;
