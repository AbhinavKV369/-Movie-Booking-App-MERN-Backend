import Joi from "joi";

export const signupSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(50)
    .required()
    .email({
      tlds: { allow: ["com", "net"] },
    })
    .message("Email is not valid"),
  password: Joi.string()
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/
      )
    )
    .message("Password must be strong"),
});

export const signinSchema  = Joi.object({
  email: Joi.string()
    .min(6)
    .max(50)
    .required()
    .email({
      tlds: { allow: ["com", "net"] },
    })
    .message("Email is not valid"),
  password: Joi.string()
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/
      )
    )
    .message("Password must be strong"),
});