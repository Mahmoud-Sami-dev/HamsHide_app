import {
  NotFoundException,
  SYS_MESSAGE,
  verifyToken,
} from "../common/index.js";
import { userRepository } from "../DB/index.js";

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
  // inject user data
  req.user = user;
  next();
};
