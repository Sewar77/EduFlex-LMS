import Joi from "joi";

export const ChangePasswordSchema = Joi.object({
  newPassword: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/)
    .required()
    .messages({
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 8 characters.",
      "string.pattern.base":
        "Password must contain at least one letter and one number.",
    }),
});
