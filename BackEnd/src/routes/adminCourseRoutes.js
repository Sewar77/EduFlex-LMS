import express from "express";
import {
  getPendingCoursesController,
  reviewCourseController,
} from "../controllers/adminCourseController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { getSystemUsageReport } from "../controllers/adminReportsController.js";
const adminrouter = express.Router();

adminrouter.get(
  "/courses/pending",
  authenticateJWT,
  getPendingCoursesController
);
adminrouter.patch(
  "/courses/:id/review",
  authenticateJWT,
  reviewCourseController
);

adminrouter.get("/usage", authenticateJWT, getSystemUsageReport);

export default adminrouter;
