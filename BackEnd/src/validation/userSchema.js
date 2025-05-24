import Joi from "joi";

export const UserSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password_hash: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "instructor", "student").required(),
  created_at: Joi.date().default(() => new Date()),
  updated_at: Joi.date().default(() => new Date()),
});


