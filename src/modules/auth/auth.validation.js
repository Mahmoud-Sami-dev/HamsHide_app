import joi from "joi";
import { generalFields } from "../../middlewares/validation.middleware.js";
export const signupSchema = joi
  .object({
    userName: generalFields.userName,
    email: generalFields.email,
    phoneNumber: generalFields.phoneNumber,
    gender: generalFields.gender,
    role: generalFields.role,
    password: generalFields.password,
    rePassword: generalFields.rePassword,
  })
  .required(); // {}
export const loginSchema = joi
  .object({
    email: generalFields.email,
    password: generalFields.password,
  })
  .required();
