import path from "path";
import fs from "fs";

const ROOT_UPLOADS = path.join(process.cwd(), "uploads");
const ORIGINALS_DIR = path.join(ROOT_UPLOADS, "originals");
const HLS_DIR = path.join(ROOT_UPLOADS, "hls");

[ROOT_UPLOADS, ORIGINALS_DIR, HLS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

export { ORIGINALS_DIR, HLS_DIR };
