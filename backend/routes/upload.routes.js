import express from "express";
import { upload } from "../middleware/upload.js";
import { uploadVideo } from "../controllers/video.controller.js";

const router = express.Router();

router.post("/upload", (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File size exceeds 100MB limit",
        });
      }

      return res.status(400).json({
        message: err.message || "File upload failed",
      });
    }

    uploadVideo(req, res);
  });
});

export default router;
