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
  loginWithGoogle,
  logout,
  logoutFromAllDevices,
  refreshTokenService,
  sendOTP,
  signup,
  verifyAccount,
} from "./auth.service.js";
import { isAuthenticated } from "../../middlewares/authentication.middleware.js";
import rateLimit from "express-rate-limit";
const router = Router();
const limit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)  
  // standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  // legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // handler: (req, res, next) => {
  //   throw new Error("too many requests", { cause: 429 });
  // }
});
router.use(limit); // Apply the rate limiting middleware to all requests
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

router.get("/refresh-token", async (req, res, next) => {
  //req.headers
  const { authorization } = req.headers; //refresh token
  const { accessToken, refreshToken } = await refreshTokenService(authorization);
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

router.post("/signup-with-google", async (req, res, next) => {
  const { idToken } = req.body;
  const { accessToken, refreshToken } = await loginWithGoogle(idToken);
  return res.status(200).json({
    message: "login successfully",
    success: true,
    data: { accessToken, refreshToken },
  });
});
export default router;
