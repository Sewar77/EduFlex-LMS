import Joi from "joi";

export const CourseSchema = Joi.object({
  title: Joi.string()
    .pattern(/^[a-zA-Z0-9\s.,!?()'"-]+$/)
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.pattern.base":
        "Title can only contain letters, numbers, and basic punctuation.",
    }),
  description: Joi.string().min(10).max(2000).required().messages({
    "string.min": "Description should be at least 10 characters.",
  }),
  instructor_id: Joi.number().integer().required(),
  category_id: Joi.number().integer().allow(null),
  thumbnail_url: Joi.string().uri().required().messages({
    "string.uri": "Thumbnail URL must be a valid URL.",
  }),
  is_approved: Joi.boolean().default(false),
  is_published: Joi.boolean().default(false),
});
