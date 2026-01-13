import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

function VideoUploader({ onGenerated }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const formatSize = (bytes) =>
    (bytes / (1024 * 1024)).toFixed(2) + " MB";

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Size validation
    if (selected.size > MAX_FILE_SIZE) {
      setFile(null);
      setStatus("error");
      setMessage("File size must be less than 100 MB.");
      return;
    }

    setFile(selected);
    setStatus("idle");
    setMessage(`Selected: ${selected.name} (${formatSize(selected.size)})`);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("error");
      setMessage("Please select a video file first.");
      return;
    }

    try {
      setStatus("uploading");
      setMessage("Uploading & generating HLS…");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || `Upload failed (${res.status})`);
      }

      const data = await res.json();

      if (!data?.masterUrl) {
        throw new Error("Backend did not return master URL");
      }

      setStatus("done");
      setMessage("HLS generated successfully!");
      onGenerated?.(data.masterUrl);
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Upload failed.");
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Upload Box */}
      <div
        style={{
          padding: "14px 16px",
          borderRadius: "14px",
          background: "rgba(2, 6, 23, 0.6)",
          border: "1px solid rgba(148,163,184,0.25)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {/* FILE INPUT */}
        <label
          style={{
            flex: "1",
            cursor: "pointer",
            background: "rgba(15, 23, 42, 0.8)",
            borderRadius: "12px",
            padding: "10px 14px",
            border: "1px dashed rgba(100,116,139,0.7)",
            color: "#cbd5e1",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "0.8rem" }}>
            {file ? "Change file" : "Choose a video file"}
          </span>

          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>

        {/* UPLOAD BUTTON */}
        <button
          type="button"
          onClick={handleUpload}
          disabled={status === "uploading" || !file}
          style={{
            borderRadius: "12px",
            padding: "10px 18px",
            fontSize: "0.85rem",
            cursor:
              status === "uploading" || !file ? "not-allowed" : "pointer",
            background:
              status === "uploading"
                ? "rgba(148,163,184,0.35)"
                : "linear-gradient(135deg, #6366f1 0%, #0ea5e9 50%, #22c55e 100%)",
            color: "#fff",
            border: "none",
            boxShadow:
              status === "uploading"
                ? "none"
                : "0 6px 18px rgba(99,102,241,0.35)",
            opacity: status === "uploading" ? 0.6 : 1,
          }}
        >
          {status === "uploading" ? "Processing…" : "Upload & Generate"}
        </button>
      </div>

      {/* STATUS MESSAGE */}
      {message && (
        <p
          style={{
            marginTop: "8px",
            fontSize: "0.8rem",
            color:
              status === "error"
                ? "#f87171"
                : status === "done"
                ? "#22c55e"
                : "#a5b4fc",
            padding: "6px 8px",
            borderRadius: "8px",
            background:
              status === "error"
                ? "rgba(239,68,68,0.15)"
                : status === "done"
                ? "rgba(34,197,94,0.15)"
                : "rgba(99,102,241,0.15)",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default VideoUploader;
