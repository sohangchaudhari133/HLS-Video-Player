import { v4 as uuidv4 } from "uuid";
import { HLS_DIR } from "../config/paths.js";
import { processVideoToHls } from "../services/video.service.js";
import path from "path";

export const uploadVideo = async (req, res) => {
  try {
    const lessonId = uuidv4();
    const videoPath = req.file.path;
    const outputPath = path.join(HLS_DIR, lessonId);

    const masterUrl = await processVideoToHls(
      videoPath,
      outputPath,
      lessonId
    );
    
    res.status(200).json({
      message: "Video converted to multi-quality HLS format",
      masterUrl,
      lessonId,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Transcoding failed" });
  }
};
