import {
  createCourseController,
  createUserController,
} from "../controllers/user.controller";
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("home.ejs");
});

router.get("/createUser", createUserController);
router.post("/createUser", createUserController);

router.get("/createCourse", createCourseController);
router.post("/createCourse", createCourseController);

export default router;
