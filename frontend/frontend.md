# Stream_App — Frontend

A small Vite + React frontend for uploading videos and playing HLS streams produced by the backend.

## Quick overview
- Vite + React app (entry: `index.html`).
- Key components:
  - [src/components/VideoUploader.jsx](src/components/VideoUploader.jsx) — file upload UI and POST to backend.
  - [src/components/VideoPlayer.jsx](src/components/VideoPlayer.jsx) — player wrapper for HLS playback.
  - [src/components/VideoJS.jsx](src/components/VideoJS.jsx) — Video.js integration / HLS helper.
- Dev server and build via Vite.

## Prerequisites
- Node.js 14+ / npm (or yarn)
- A running backend that exposes the upload endpoint and serves HLS files.

## Installation
```bash
cd frontend
npm install
```

## Environment
- Copy `.env_sample` to `.env` if present and set the backend API base URL (for example `BASE_URL=http://localhost:8000`).
- Ensure the frontend uses the correct backend port and that the backend allows CORS for the frontend origin.

## Running (development)

```bash
cd frontend
npm run dev
```

Open the URL printed by Vite (commonly `http://localhost:5173`).


## How it communicates with the backend
- The uploader component posts video files to the backend upload endpoint (see `routes/upload.routes.js` on the backend).
- After upload the backend transcodes and writes HLS to `uploads/hls/<video-id>/master.m3u8`. The frontend should request the returned `master.m3u8` URL or a backend-provided stream URL to play.

## Developer notes (where to look)

- App entry: [index.html](index.html)
- Main React code: [src/main.jsx](src/main.jsx)
- Vite config: [vite.config.js](vite.config.js)
- Package manifest: [package.json](package.json)
- Core components: see links under "Quick overview".

## Testing the full flow
1. Start the backend and confirm its upload endpoint and HLS static route are reachable.
2. Start the frontend (`npm run dev`).
3. Use the `VideoUploader` UI to upload a sample video.
4. After processing, point the player to the returned `master.m3u8` (or the path under your backend `uploads/hls/<id>/master.m3u8`).

## Troubleshooting

* Player fails to load HLS:
    * Confirm the master playlist URL is correct and reachable from the browser.
    * Check CORS headers on the backend.
    * Use HLS.js or Video.js (already integrated) to support HLS in browsers that lack native support.
* Upload errors:
    * Ensure backend accepts large file sizes and that `VITE_API_BASE_URL` is correct.


## 📄 License
This project is for educational and development purposes.<br/>
Feel free to modify and extend it as needed.