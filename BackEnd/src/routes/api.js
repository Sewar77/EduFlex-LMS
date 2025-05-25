import {
  createUserController,
  updateUserController,
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
} from "../controllers/user.controller.js";
import {
  createCourseController,
  updateCourseController,
  deleteCourseController,
  getAllCoursesController,
  getCourseByIdController,
} from "../controllers/courses.controller.js";
import express from "express";
import { validateBody } from "../middleware/validateBody.js";
import { CourseSchema } from "../validation/course.Schema.js";
import { UserSchema } from "../validation/user.Schema.js";

const router = express.Router();

//home
router.get("/", (req, res) => {
  res.send("home page");
});

//CRUD Ussers
router.get("/getAllUsers", getAllUsersController);
router.get("/getUserById/:id", getUserByIdController);

router.get("/createUser", createUserController);
router.post("/createUser", validateBody(UserSchema), createUserController);

router.get("/updateUser/:id", updateUserController);
router.put("/updateUser/:id", validateBody(UserSchema), updateUserController);

router.delete("/deleteUser/:id", deleteUserController);

//CRUD Course
router.get("/createCourse", createCourseController);
router.post(
  "/createCourse",
  validateBody(CourseSchema),
  createCourseController
);

router.get("/updateCourse/:id", updateCourseController);
router.put(
  "/updateCourse/:id",
  validateBody(CourseSchema),
  updateCourseController
);

router.delete("/deleteCourse/:id", deleteCourseController);

router.get("/getAllCourses", getAllCoursesController);
router.get("/getCourseById/:id", getCourseByIdController);

export default router;
