import { fileTypeFromBuffer } from "file-type";
import fs from "node:fs";
import { BadRequestException } from "../common/index.js";

// Middleware to validate file type by magic number (file signatures)
export const fileValidation = async (req, res, next) => {
  console.log("file information after multer upload", req.file);

  // get the file path
  const filePath = req.file.path;
  // read the file and return buffer
  const buffer = fs.readFileSync(filePath);
  // get the file type
  const type = await fileTypeFromBuffer(buffer);
  // validate
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!type || !allowedTypes.includes(type.mime)) {
    // delete upload file
    fs.unlinkSync(filePath);
    throw new BadRequestException("Invalid file type");
  }
  return next();
};
