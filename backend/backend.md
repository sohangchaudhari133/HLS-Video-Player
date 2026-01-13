# Stream_App Backend 🎥

A Node.js and Express backend service for uploading videos and streaming them using **HLS (HTTP Live Streaming)**.The system uses **FFmpeg** to transcode uploaded videos into adaptive HLS formats suitable for modern web players.

## 🚀 Features

- Video upload API using Multer
- Automatic HLS conversion via FFmpeg
- Organized storage for original videos and HLS outputs
- Scalable and production-ready architecture
- Easy integration with frontend video players

## 🧩 Tech Stack

- **Node.js**
- **Express.js**
- **FFmpeg**
- **Multer**
- **UUID**

## 📁 Project Structure

```
backend/
├── config/
│   ├── ffmpeg.js              # FFmpeg command configuration
│   └── paths.js               # Upload and output paths
│
├── controllers/
│   └── video.controller.js    # Request / response handlers
│
├── middleware/
│   └── upload.js              # Multer upload configuration
│
├── services/
│   └── video.service.js       # Video processing & HLS logic
│
├── routes/
│   └── upload.routes.js       # Upload API routes
│
├── uploads/
│   ├── originals/             # Original uploaded videos
│   └── hls/                   # Generated HLS streams
│
├── test-video/                # Sample video for testing
│
├── app.js                   # App entry point
└── package.json
```

## ⚙️ Prerequisites

- **Node.js** (version ≥ 14)
- **npm** or **yarn**
- **FFmpeg** installed and available in PATH

Verify installation:

```
ffmpeg -version
```

## 📦 Installation

```
cd backend
npm install
```

## 🔐 Environment Variables

Create a `.env file` from the sample:

```
cp .env_sample .env
```

Configure the following as needed:

- Server port
- Upload base directory
- FFmpeg-related options

Refer to `.env_sample` for all supported variables.

## ▶️ Running the Server

### Development Mode

```
npm start
```

## 📡 API Reference

### Upload Video

**Endpoint**

```
POST /upload
```

**Description**

- Accepts a video file
- Converts it into HLS format using FFmpeg
- Stores output in:

```
uploads/hls/<video-id>/
```

**Implementation**

- `routes/upload.routes.js`
- `middleware/upload.js`
- `controllers/video.controller.js`

## 🧪 Testing

- Inspect the `uploads/hls/<video-id>/` directory for a sample HLS output
- Test uploads using:

  - Frontend uploader
  - Postman

## 🏗️ Production Recommendations

- Use persistent storage (AWS S3, GCP buckets, or cloud volumes)
- Move FFmpeg processing to a background worker or job queue (Bull + Redis)
- Enforce file size and MIME type validation
- Protect upload endpoints with authentication
- Serve HLS files using a CDN or optimized static server (Nginx)

## 🛠️ Troubleshooting

- Ensure `ffmpeg` installed correctly
- Verify write permissions for the uploads/ directory
- Check Multer limits if uploads fail
- Review FFmpeg logs for transcoding errors

## 📄 License

This project is for educational and development purposes.<br/>
Feel free to modify and extend it as needed.
