import { Router } from "express";
import {
  getAllMessages,
  getSpecificMessage,
  sendMessage,
} from "./message.service.js";
import { SYS_MESSAGE } from "../../common/index.js";
import { fileUpload } from "../../common/utils/multer.utils.js";
import { isAuthenticated } from "../../middlewares/authentication.middleware.js";
import rateLimit from "express-rate-limit";

const router = Router();
const limit = rateLimit({
  windowMs: 1 * 60 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 3 requests per `window` (here, per 15 minutes)
  // standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  // legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // handler: (req, res, next) => {
  //   throw new Error("too many requests", { cause: 429 });
  // }
});
router.use(limit);
// send message anonymous
router.post(
  "/:receiverId/anonymous",
  fileUpload().array("attachments", 2), // parsing
  async (req, res, next) => {
    const { content } = req.body;
    const { receiverId } = req.params;
    const files = req.files;
    const createdMessage = await sendMessage(content, files, receiverId);
    return res.status(200).json({
      message: SYS_MESSAGE.message.created,
      success: true,
      data: { createdMessage },
    });
  },
);
// send message public
router.post(
  "/:receiverId/public",
  isAuthenticated,
  fileUpload().array("attachments", 2), // parsing
  async (req, res, next) => {
    const { content } = req.body;
    const { receiverId } = req.params;
    const files = req.files;
    const createdMessage = await sendMessage(
      content,
      files,
      receiverId,
      req.user._id,
    );
    return res.status(200).json({
      message: SYS_MESSAGE.message.created,
      success: true,
      data: { createdMessage },
    });
  },
);
//get specific message
router.get("/:id", isAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  const message = await getSpecificMessage(id, req.user._id);
  return res
    .status(200)
    .json({ message: "done", success: true, data: { message } });
});
//get all messages
router.get("/", isAuthenticated, async (req, res, next) => {
  const messages = await getAllMessages(req.user._id);
  return res
    .status(200)
    .json({ message: "done", success: true, data: { messages } });
});
export default router;
