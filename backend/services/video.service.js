import fs from "fs";
import path from "path";
import { execAsync } from "../utils/execAsync.js";
import { QUALITY_PROFILES } from "../config/ffmpeg.js";

export const processVideoToHls = async (videoPath, outputPath, lessonId) => {

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // Create quality folders
  QUALITY_PROFILES.forEach(q => {
    const dir = path.join(outputPath, q.name);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // Convert video sequentially
  for (const q of QUALITY_PROFILES) {
    const cmd =
      `ffmpeg -i "${videoPath}" -vf scale=-2:${q.height} ` +
      `-c:v libx264 -preset veryfast -b:v ${q.videoBitrate} -maxrate ${q.maxrate} -bufsize ${q.bufsize} ` +
      `-c:a aac -ar 44100 -ac 2 -hls_time 10 -hls_playlist_type vod ` +
      `-hls_segment_filename "${outputPath}/${q.name}/segment_%03d.ts" ` +
      `"${outputPath}/${q.name}/index.m3u8"`;

    await execAsync(cmd);
    console.log("Quality conversion done for:", q.name);
  }

  // Create Master Playlist
  const master = [
    "#EXTM3U",
    "#EXT-X-VERSION:3",
    "",
    ...QUALITY_PROFILES.map(q => (
      `#EXT-X-STREAM-INF:BANDWIDTH=${q.bandwidth},RESOLUTION=${q.resolution},CODECS="${q.codec},mp4a.40.2"`
      + `\n${q.name}/index.m3u8`
    )),
    ""
  ].join("\n");

  fs.writeFileSync(path.join(outputPath, "master.m3u8"), master);

  // DELETE ORIGINAL UPLOADED VIDEO
  try {
    fs.unlinkSync(videoPath);
    // console.log("Original uploaded video deleted:", videoPath);
    console.log("Original uploaded video deleted");
  } catch (err) {
    console.error("Failed to delete source video:", err);
  }

  return `${process.env.BASE_URL}/hls/${lessonId}/master.m3u8`;
};
