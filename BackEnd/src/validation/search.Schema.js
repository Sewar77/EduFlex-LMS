import Joi from "joi";

export const CourseSearchSchema = Joi.object({
  keyword: Joi.string().trim().min(1).required(),
});
