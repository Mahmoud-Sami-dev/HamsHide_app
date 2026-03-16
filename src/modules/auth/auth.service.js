import {
  BadRequestException,
  compare,
  ConflictException,
  encryption,
  generateTokens,
  hash,
  sendMail,
  SYS_MESSAGE,
  SYS_ROLE,
} from "../../common/index.js";
import { userRepository } from "../../DB/index.js";
import { otpRepository } from "../../DB/models/otp/otp.repository.js";
import { tokenRepository } from "../../DB/models/token/token.repository.js";
import { checkUserExist, createUser } from "../user/user.service.js";

export async function sendOTP(body) {
  const { email } = body;
  // otp valid >> DB
  const otpDoc = await otpRepository.getOne({ email });
  if (otpDoc) {
    throw new BadRequestException("cannot send otp your otp still valid");
  }
  // create new otp
  const otp = Math.floor(100000 + Math.random() * 900000);
  // save into db
  await otpRepository.create({
    email,
    otp,
    expiresAt: Date.now() + 1 * 60 * 1000,
  });
  // send email
  await sendMail({
    to: email,
    subject: "verify your account",
    html: `<p>your otp to verify your account is ${otp}</p>`,
  });
  return true;
}

export const signup = async (body) => {
  const { email, phoneNumber } = body; //get data
  const userExist = await checkUserExist({
    $or: [
      { email: { $eq: email, $exists: true, $ne: null } },
      { phoneNumber: { $eq: phoneNumber, $exists: true, $ne: null } },
    ],
  });
  //fail case
  if (userExist) throw new ConflictException(SYS_MESSAGE.user.alreadyExist);

  //prepare data - validation - hashing password
  body.role = SYS_ROLE.user; //0 || 1 >> 0
  body.password = await hash(body.password);
  if (body.phoneNumber) {
    body.phoneNumber = encryption(phoneNumber);
  }
  //OTP >> create otp >> save into DB >> send email to user
  await sendOTP({ email });
  //create user
  return await createUser(body); // not verified
};

export const login = async (body) => {
  //get data from req
  const { email, password } = body;
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
  return { accessToken, refreshToken };
};

export const verifyAccount = async (body) => {
  const { otp, email } = body;
  const otpDoc = await otpRepository.getOne({ email });
  if (!otpDoc) throw new BadRequestException("expired otp!");
  if (otp != otpDoc.otp) {
    otpDoc.attempts += 1;
    if (otpDoc.attempts > 3) {
      await otpRepository.deleteOne({ _id: otpDoc._id });
      throw new BadRequestException("too many tries!");
    }
    await otpDoc.save();
    throw new BadRequestException("invalid otp!");
  }
  await userRepository.update({ email }, { isEmailVerified: true });
  await otpRepository.deleteOne({ _id: otpDoc._id });
  return true;
};

export const logoutFromAllDevices = async (user) => {
  await userRepository.update(
    { _id: user._id },
    { credentialsUpdatedAt: Date.now() },
  );
  return true;
};

export const logout = async (tokenPayload, user) => {
  await tokenRepository.create({
    token: tokenPayload.jti,
    userId: user._id,
    expiresAt: tokenPayload.exp * 1000,
  });
};
