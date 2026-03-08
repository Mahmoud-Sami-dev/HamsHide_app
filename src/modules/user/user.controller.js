import { Router } from "express";
import { decryption } from "../../common/utils/encryption.utils.js";
import { isAuthenticated } from "../../middlewares/authentication.middleware.js";

const router = Router();
// validation layer

// get profile >> url = /user >> method = GET
router.get("/", isAuthenticated, async (req, res, next) => {
  // get data from req
  const { user } = req;
  // -decryption phone
  if (user.phoneNumber) {
    user.phoneNumber = decryption(user.phoneNumber);
  }
  //send response
  return res
    .status(200)
    .json({ message: "done", success: true, data: { user } });
});

export default router;
