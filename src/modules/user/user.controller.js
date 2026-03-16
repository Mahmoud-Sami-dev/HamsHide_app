import { Router } from "express";
import { decryption } from "../../common/utils/encryption.utils.js";
import { isAuthenticated } from "../../middlewares/authentication.middleware.js";
import { fileUpload } from "../../common/utils/multer.utils.js";
import { fileValidation } from "../../middlewares/file-validation.middleware.js";
import { uploadProfilePic } from "./user.service.js";

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

router.patch(
  "/upload-profile-pic",
  isAuthenticated,
  fileUpload().single("pp"),
  fileValidation,
  async (req, res, next) => {
    const updatedUser = await uploadProfilePic(req.user, req.file);
    return res.json({
      message: "uploaded",
      success: true,
      data: { updatedUser },
    });
  },
);
export default router;
