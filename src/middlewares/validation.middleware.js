import { BadRequestException, SYS_GENDER, SYS_ROLE } from "../common/index.js";
import joi from "joi";
export const isValid = (schema) => {
  return (req, res, next) => {
    // layer of validation
    const validationResult = schema.validate(req.body, {
      abortEarly: false,
    });
    if (validationResult.error) {
      let errorMessages = validationResult.error.details.map((err) => {
        return { message: err.message, path: err.path[0] };
      });
      throw new BadRequestException("validation error", errorMessages);
    }
    next();
  };
};

export const generalFields = {
  userName: joi
    .string()
    .min(2)
    .max(20)
    .trim()
    .messages({
      "string.base": "username must of type string",
      "any.required": "username is required",
    })
    .required(),
  email: joi
    .string()
    .pattern(/^\w{1,100}@(gmail|yahoo|icloud){1}(.com|.edu|.eg|.net|.su){1,3}$/)
    .messages({ "string.pattern.base": "invalid email" })
    .when("phoneNumber", {
      is: joi.exist(),
      then: joi.optional(),
      otherwise: joi.required(),
    }),
  phoneNumber: joi
    .string()
    .pattern(/^(00201|01|\+20)[0125]{1}[0-9]{8}$/)
    .messages({
      "string.pattern.base": "phoneNumber must be a valid Egypt number",
    }),
  password: joi
    .string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .messages({
      "string.pattern.base":
        "password must be a strong which must contain uppercase & lowercase & numbers and special at least 8 chars",
    })
    .required(),
  rePassword: joi
    .string()
    .valid(joi.ref("password"))
    .messages({ "any.only": "rePassword must be match password" }),
  gender: joi
    .number()
    .valid(...Object.values(SYS_GENDER))
    .default(0),
  role: joi
    .number()
    .valid(...Object.values(SYS_ROLE))
    .default(0),
};
