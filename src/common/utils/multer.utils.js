import multer, { diskStorage } from "multer"; //multer >> file upload middleware (Busboy[parsing multipart form data])
import fs from "node:fs";
import { BadRequestException } from "./error.utils.js";
export const fileUpload = (
  allowedType = ["image/png", "image/jpeg", "image/gif"],
) => {
  return multer({
    fileFilter: (req, file, cb) => {
      if (!allowedType.includes(file.mimetype)) {
        return cb(new BadRequestException("invalid file format!"), false);
      }
      cb(null, true);
    },
    //limits: { fileSize: 500000 },
    storage: diskStorage({
      destination: (req, file, cb) => {
        // req >> user
        //create folder
        const folder = req.user
          ? `uploads/${req.user._id}`
          : `uploads/${req.params.receiverId}/messages`;

        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder, { recursive: true });
        }
        cb(null, folder);
      }, // string >> "uploads" >> function
      filename: (req, file, cb) => {
        console.log({ "file information before multer upload": file }); //information about file
        cb(null, Date.now() + Math.random() + "__" + file.originalname);
      }, //function
    }), // result from execution of [diskStorage , memoryStorage]
  });
};
