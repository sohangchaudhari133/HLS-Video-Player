// VideoJS.jsx
//✨ Add file size validator + warning
import { useRef, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import VideoUploader from "./VideoUploader";

const DEMO_HLS_URL = import.meta.env.VITE_DEMO_HLS_URL;

function VideoJS() {
  const playerRef = useRef(null);

  const [inputUrl, setInputUrl] = useState(DEMO_HLS_URL || "");
  const [videoUrl, setVideoUrl] = useState(DEMO_HLS_URL || "");
  const [error, setError] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copyMsg, setCopyMsg] = useState("");
  
  // NEW LOAD STATE
  const [loadState, setLoadState] = useState(
    DEMO_HLS_URL ? "success" : "idle"
  );
  // idle | loading | success | error

  const handleLoadVideo = (e) => {
    e.preventDefault();

    if (!inputUrl.trim()) {
      setError("Please enter a video URL.");
      setLoadState("idle");
      return;
    }

    // better validation
    if (!/\.m3u8($|\?)/.test(inputUrl)) {
      setError("This doesn't look like a valid HLS (.m3u8) link.");
      setLoadState("idle");
      return;
    }

    setError("");
    setLoadState("loading");
    setVideoUrl(inputUrl.trim());
  };

  // from uploader
  const handleGeneratedFromUpload = (url) => {
    setGeneratedUrl(url);
    setCopyMsg("");
  };

  const handleCopyGenerated = async () => {
    if (!generatedUrl) return;
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopyMsg("Copied!");
      setTimeout(() => setCopyMsg(""), 1500);
    } catch {
      setCopyMsg("Copy failed. Try manually.");
    }
  };

  const videoPlayerOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    playbackRates: [0.5, 1, 1.5, 2],
    sources: videoUrl
      ? [
          {
            src: videoUrl,
            type: "application/x-mpegURL",
          },
        ]
      : [],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;
  };

  // PLAYER STATE UPDATES
  const handleVideoState = (state) => {
    setLoadState(state);
  };

  const getStatusLabel = () => {
    switch (loadState) {
      case "loading":
        return { text: "Loading…", color: "#0ea5e9" };
      case "success":
        return { text: "Video Loaded", color: "#22c55e" };
      case "error":
        return { text: "Failed to load", color: "#ef4444" };
      default:
        return { text: "Waiting for URL", color: "#f97316" };
    }
  };

  const status = getStatusLabel();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "40px 16px",
        background:
          "radial-gradient(circle at top, #1f2937 0, #020617 55%, #000 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          background: "rgba(15, 23, 42, 0.9)",
          borderRadius: "18px",
          padding: "24px",
          border: "1px solid rgba(148,163,184,0.25)",
        }}
      >
        {/* header */}
        <header
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "1.4rem", color: "#e5e7eb" }}>
              HLS Video Player
            </h1>
            <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
              Upload → Copy master.m3u8 → Paste → Load
            </p>
          </div>

          <span
            style={{
              fontSize: "0.75rem",
              padding: "4px 10px",
              borderRadius: "999px",
              border: "1px solid rgba(148,163,184,0.4)",
              color: status.color,
            }}
          >
            {status.text}
          </span>
        </header>

        {/* URL input */}
        <form onSubmit={handleLoadVideo}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste your master.m3u8 URL here"
              style={{
                flex: 1,
                borderRadius: "999px",
                border: "1px solid rgba(75,85,99,0.9)",
                padding: "10px 14px",
                backgroundColor: "#020617",
                color: "#e5e7eb",
              }}
            />

            <button
              type="submit"
              style={{
                borderRadius: "999px",
                padding: "10px 18px",
                background:
                  "linear-gradient(135deg, #6366f1 0%, #22c55e 100%)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Load Video
            </button>
          </div>
        </form>

        {error && (
          <p style={{ color: "#f97316", marginTop: "8px" }}>{error}</p>
        )}

        {/* uploader */}
        <div
          style={{
            marginTop: "18px",
            padding: "10px 14px",
            borderRadius: "12px",
            border: "1px dashed rgba(75,85,99,0.9)",
          }}
        >
          <VideoUploader onGenerated={handleGeneratedFromUpload} />

          {generatedUrl && (
            <div
              style={{
                marginTop: "10px",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: "#020617",
              }}
            >
              <div style={{ fontSize: "0.78rem", color: "#9ca3af" }}>
                Your master.m3u8 URL:
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  readOnly
                  value={generatedUrl}
                  style={{
                    flex: 1,
                    borderRadius: "999px",
                    padding: "6px 10px",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                  }}
                />

                <button
                  type="button"
                  onClick={handleCopyGenerated}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "999px",
                    border: "none",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    background:
                      "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
                    color: "#fff",
                  }}
                >
                  Copy
                </button>
              </div>

              {copyMsg && (
                <div style={{ fontSize: "0.75rem", color: "#22c55e", marginTop: "4px" }}>
                  {copyMsg}
                </div>
              )}
            </div>
          )}
        </div>

        {/* video player */}
        <div
          style={{
            marginTop: "20px",
            borderRadius: "16px",
            overflow: "hidden",
            backgroundColor: "#000",
          }}
        >
          {videoUrl ? (
            <VideoPlayer
              options={videoPlayerOptions}
              onReady={handlePlayerReady}
              onStateChange={handleVideoState}
            />
          ) : (
            <div
              style={{
                height: "260px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
              }}
            >
              Upload file → Copy master.m3u8 → Paste & Load.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoJS;
