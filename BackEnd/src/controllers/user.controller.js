import { createCourse, createUser, updateUser } from "../models/user.model";

export async function createUserController(req, res) {
  try {
    const userInfo = {
      name: req.body.name,
      email: req.body.email,
      password_hash: req.body.password_hash,
      role: req.body.role,
      created_at: req.body.created_at,
      updated_at: req.body.updated_at,
    };
    await createUser(userInfo);
    res.render("createUser.ejs"); //not created yet.
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function createCourseController(req, res) {
  try {
    const courseInfo = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      thumbnail_url: req.body.thumbnail_url,
      is_approved: req.body.is_approved,
      is_published: req.body.is_published,
      created_at: req.body.created_at,
      updated_at: req.body.updated_at,
    };
    await createCourse(courseInfo);
    res.render("createCourse.ejs"); //not created yet.
  } catch (err) {
    console.error(err);
    throw err;
  }
}
