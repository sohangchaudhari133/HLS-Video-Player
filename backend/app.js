import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload.routes.js";
import { HLS_DIR } from "./config/paths.js";


const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/hls", express.static(HLS_DIR));

app.get("/", (req, res) => {
  res.json({ message: "Home Page" });
});

app.use("/", uploadRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
