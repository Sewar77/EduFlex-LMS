import Joi from "joi";

export const CourseSearchSchema = Joi.object({
  keyword: Joi.string().min(1).max(100).required().messages({
    "string.min": "Search keyword must be at least 1 character.",
    "string.max": "Search keyword cannot exceed 100 characters.",
  }),
});
