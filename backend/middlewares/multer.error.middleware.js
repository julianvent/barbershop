import multer from "multer";
import path from "path";
import { ALLOWED_MIME_TYPES } from "../config/upload.images.js";



export function handleMulterErrors(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        error: "File is too large. Maximum file size is 5MB.",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        error: "Too many files. Only 1 file is allowed.",
      });
    }
    return res.status(400).json({
      error: err.message,
    });
  }
  if (err) {
    return res.status(400).json({
      error: "An error occurred during file upload.",
    });
  }
  next();
}

export function validateFileType(req, res, next) {
  if (req.files && req.files.length > 0) {
    const file = req.files[0];
    const extension = path.extname(file.originalname || "").toLowerCase();
    const extensionOk = [".png", ".jpeg", ".jpg"].includes(extension);
    const mimeOk = ALLOWED_MIME_TYPES.includes(file.mimetype);

    if (!mimeOk || !extensionOk) {
      return res.status(400).json({
        error: "Invalid file type. Only png, jpeg, jpg are allowed.",
      });
    }
  }
  next();
}
