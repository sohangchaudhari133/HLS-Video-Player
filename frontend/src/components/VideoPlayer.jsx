// VideoPlayer.jsx
import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

import "videojs-contrib-quality-levels";
import "videojs-http-source-selector";

const VideoPlayer = ({ options, onReady, onStateChange }) => {
  const playerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // FIRST TIME INITIALIZE
    if (!playerRef.current) {
      const videoElement = document.createElement("video");
      videoElement.classList.add("video-js", "vjs-big-play-centered");
      videoElement.setAttribute("controls", "true");
      videoElement.setAttribute("playsinline", "true");

      videoRef.current.appendChild(videoElement);

      const player = videojs(videoElement, options, () => {
        videojs.log("Player is ready");
        onReady && onReady(player);
      });

      // Quality selector
      player.ready(() => {
        if (typeof player.httpSourceSelector === "function") {
          player.httpSourceSelector({ default: "auto" });
        }
      });

      // EVENTS
      player.on("loadedmetadata", () => {
        onStateChange && onStateChange("success");
      });

      player.on("error", () => {
        console.log("Player Error:", player.error());
        onStateChange && onStateChange("error");
      });

      playerRef.current = player;
    } else {
      // UPDATE SOURCE WHEN URL CHANGES
      playerRef.current.src(options.sources);
    }
  }, [options]);

  // CLEANUP
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;
