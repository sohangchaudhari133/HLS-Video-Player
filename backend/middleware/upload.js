import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { ORIGINALS_DIR } from "../config/paths.js";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, ORIGINALS_DIR),
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/x-matroska",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Unsupported video format"), false);
    }

    cb(null, true);
  },
});
