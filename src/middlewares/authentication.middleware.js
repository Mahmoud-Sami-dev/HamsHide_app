import {
  BadRequestException,
  NotFoundException,
  SYS_MESSAGE,
  verifyToken,
} from "../common/index.js";
import { userRepository } from "../DB/index.js";
import { tokenRepository } from "../DB/models/token/token.repository.js";

export const isAuthenticated = async (req, res, next) => {
  // isAuthenticated function Middleware
  const { authorization } = req.headers;
  // //   const decoded = jwt.decode(authorization); // token >> decode >> data
  // //   console.log({ decoded });
  const payload = verifyToken(
    authorization,
    "ihuujgbvvvbcfujuujbjvjudvujjjjeuvjb",
  ); //throw error invalid signature - expire

  //get profile service
  const user = await userRepository.getOne({
    _id: payload.sub,
  });
  if (!user) throw new NotFoundException(SYS_MESSAGE.user.notFound);
  // credentials updated at
  console.log({
    credentialsUpdatedAt: new Date(user.credentialsUpdatedAt).getTime(),
    tokenExp: payload.iat * 1000,
  });
  if (new Date(user.credentialsUpdatedAt).getTime() > payload.iat * 1000) {
    throw new BadRequestException("invalid token!");
  }
  const tokenExist = await tokenRepository.getOne({ token: payload.jti });
  if (tokenExist) throw new BadRequestException("invalid token");
  // inject user data
  req.user = user;
  req.payload = payload;
  next();
};
