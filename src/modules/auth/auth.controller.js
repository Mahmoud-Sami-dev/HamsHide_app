import { Router } from "express";
import { checkUserExist, createUser } from "../user/user.service.js";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  SYS_MESSAGE,
  SYS_ROLE,
  hash,
  compare,
  generateTokens,
  verifyToken,
  SYS_GENDER,
} from "../../common/index.js";
import { encryption } from "../../common/utils/index.js";
import { loginSchema, signupSchema } from "./auth.validation.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { fileUpload } from "../../common/utils/multer.utils.js";
import {
  login,
  logout,
  logoutFromAllDevices,
  sendOTP,
  signup,
  verifyAccount,
} from "./auth.service.js";
import { isAuthenticated } from "../../middlewares/authentication.middleware.js";
const router = Router();

//signup >> check user >> create user
router.post(
  "/signup",
  fileUpload().none(), // parsing data from body from-data enforce non-file
  isValid(signupSchema),
  async (req, res, next) => {
    const createdUser = await signup(req.body);
    return res.status(201).json({
      message: SYS_MESSAGE.user.created,
      success: true,
      data: { createdUser },
    });
  },
);
// login
router.post(
  "/login",
  fileUpload().none(), // parsing
  isValid(loginSchema),
  async (req, res, next) => {
    const { accessToken, refreshToken } = await login(req.body);
    //send response
    return res.status(200).json({
      message: "login successfully",
      success: true,
      data: { accessToken, refreshToken },
    });
  },
);

router.get("/refresh-token", (req, res, next) => {
  //req.headers
  const { authorization } = req.headers; //refresh token
  // check token valid
  const payload = verifyToken(
    authorization,
    "aihuujgbvvvbcfujuujbjvjudvujjjjeuvjb",
  ); //valid - expire
  // payload token refresh >> iat & exp
  delete payload.iat;
  delete payload.exp;
  const { accessToken, refreshToken } = generateTokens(payload);
  return res.status(200).json({
    message: "token refresh successfully",
    success: true,
    data: { accessToken, refreshToken },
  });
});

//verify account
router.patch("/verify-account", async (req, res, next) => {
  await verifyAccount(req.body);
  return res
    .status(200)
    .json({ message: "email verified successfully", success: true });
});

router.post("/send-otp", async (req, res, next) => {
  await sendOTP(req.body);
  return res
    .status(200)
    .json({ message: "otp sent successfully", success: true });
});
//logout-from-all-devices
router.patch(
  "/logout-from-all-devices",
  isAuthenticated,
  async (req, res, next) => {
    await logoutFromAllDevices(req.user);
    return res
      .status(200)
      .json({ message: "logout from all devices", success: true });
  },
);

router.post("/logout", isAuthenticated, async (req, res, next) => {
  await logout(req.payload, req.user);
  return res
    .status(200)
    .json({ message: "logout successfully", success: true });
});
export default router;
