import {
  createCourseController,
  createUserController,
  updateUserController
} from "../controllers/user.controller.js";
import express from "express";
import { validateBody } from "../middleware/validateBody.js";
import { CourseSchema } from "../validation/courseSchema.js";
import { UserSchema } from "../validation/userSchema.js";

const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("home.ejs");
// });

router.get("/", createUserController);
router.post("/", validateBody(UserSchema), createUserController);

router.get("/createCourse", createCourseController);
router.post(
  "/createCourse",
  validateBody(CourseSchema),
  createCourseController
);

router.get("/users/:id", updateUserController);
router.put("/users/:id", validateBody(UserSchema), updateUserController);
export default router;
