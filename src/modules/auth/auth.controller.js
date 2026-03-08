import { Router } from "express";
import { checkUserExist, createUser, getProfile } from "../user/user.service.js";
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
} from "../../common/index.js";
import { encryption, sendOTPEmail } from "../../common/utils/index.js";
const router = Router();
//signup >> check user >> create user
router.post("/signup", async (req, res, next) => {
  const { email, phoneNumber } = req.body;
  const userExist = await checkUserExist({
    $or: [
      { email: { $eq: email, $exists: true, $ne: null } },
      { phoneNumber: { $eq: phoneNumber, $exists: true, $ne: null } },
    ],
  });
  //fail case
  if (userExist) throw new ConflictException(SYS_MESSAGE.user.alreadyExist);
  //generate OTP
  const otp = Math.floor(100000 + Math.random() * 90000);
  //send OTP email
  await sendOTPEmail(email, otp);
  req.body.otp = otp;
  //prepare data - validation - hashing password
  req.body.role = SYS_ROLE.user; //0 || 1 >> 0
  req.body.password = await hash(req.body.password);
  if (req.body.phoneNumber) {
    req.body.phoneNumber = encryption(phoneNumber);
  }
  //create user
  const createdUser = await createUser(req.body);
  return res.status(201).json({
    message: SYS_MESSAGE.user.created,
    success: true,
    data: { createdUser },
  });
});

router.post("/login", async (req, res, next) => {
  //get data from req
  const { email, password } = req.body;
  //check user exist
  const userExist = await checkUserExist({
    email: { $eq: email, $exists: true, $ne: null },
  });
  //check password
  const match = await compare(password, userExist?.password || "fdcggyvkuh");
  //fail case
  if (!userExist) throw new BadRequestException("Invalid credentials");
  if (!match) throw new BadRequestException("Invalid credentials");
  //userExist.password = undefined;
  //generate token
  const { accessToken, refreshToken } = generateTokens({
    sub: userExist._id,
    role: userExist.role,
  });
  //send response
  return res.status(200).json({
    message: "login successfully",
    success: true,
    data: { accessToken, refreshToken },
  });
});

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

router.post("/verify-otp", async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await getProfile({ email });

  if (!user) throw new NotFoundException(SYS_MESSAGE.user.alreadyExist);
  if (user.otp != otp) throw new BadRequestException("Invalid OTP");

  user.isVerified = true;
  user.otp = null;
  await user.save();

  return res.status(200).json({
    message: "Account verified successfully",
    success: true,
  });
});
export default router;
