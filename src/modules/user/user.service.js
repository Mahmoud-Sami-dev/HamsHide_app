import { userRepository } from "../../DB/index.js";
import { NotFoundException, SYS_MESSAGE } from "../../common/index.js";
import fs from "node:fs";

export const checkUserExist = async (filter) => {
  return await userRepository.getOne(filter);
};

export const createUser = async (userData) => {
  return await userRepository.create(userData);
};

export const getProfile = async (filter) => {
  return await userRepository.getOne(filter);
};

export const uploadProfilePic = async (user, file) => {
  // upload into db
  const updatedUser = await userRepository.update(
    { _id: user._id },
    { profilePic: file.path },
  );
  if (!updatedUser) throw new NotFoundException(SYS_MESSAGE.user.notFound);

  //delete old image
  if (fs.existsSync(user.profilePic)) fs.unlinkSync(user.profilePic);

  return updatedUser;
};
