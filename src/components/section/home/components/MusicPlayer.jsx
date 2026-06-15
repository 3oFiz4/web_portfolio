import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import "./MusicPlayer.css";

const MusicPlayer = ({ src, musicName = "Unknown Track", logo }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const audioRef = useRef(null);
  const sliderRef = useRef(null);
  const thumbRef = useRef(null);
  const containerRef = useRef(null);
  const logoRef = useRef(null);

  // Initial animation
  useEffect(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: "power2.out",
    });
  }, []);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isDragging) setCurrentTime(audio.currentTime);
    };
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isDragging]);

  // Logo pulse animation when playing
  useEffect(() => {
    if (isPlaying) {
      gsap.to(logoRef.current, {
        scale: 1.03,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    } else {
      gsap.killTweensOf(logoRef.current);
      gsap.to(logoRef.current, { scale: 1, duration: 0.3 });
    }
  }, [isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handlePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  };

  const skip = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(
      0,
      Math.min(duration, audio.currentTime + seconds),
    );

    // Visual feedback
    gsap.fromTo(
      thumbRef.current,
      { scale: 1.5 },
      { scale: 1, duration: 0.3, ease: "back.out(2)" },
    );
  };

  const getPositionFromEvent = (e) => {
    const slider = sliderRef.current;
    if (!slider) return 0;
    const rect = slider.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    return Math.max(0, Math.min(1, x / rect.width));
  };

  const handleSliderDown = (e) => {
    setIsDragging(true);
    const pos = getPositionFromEvent(e);
    const newTime = pos * duration;
    setCurrentTime(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e) => {
      const pos = getPositionFromEvent(e);
      const newTime = pos * duration;
      setCurrentTime(newTime);
    };

    const handleUp = () => {
      if (audioRef.current) audioRef.current.currentTime = currentTime;
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [isDragging, duration, currentTime]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="music-player" ref={containerRef}>
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="player-inner">
        <div className="logo-container" ref={logoRef}>
          {logo ? (
            <img src={logo} alt="logo" className="logo-img" />
          ) : (
            <div className="logo-placeholder">n</div>
          )}
        </div>

        <div className="player-content">
          <div className="music-name">{musicName}</div>

          <div className="slider-container">
            <div
              className="slider-track"
              ref={sliderRef}
              onMouseDown={handleSliderDown}
              onTouchStart={handleSliderDown}
            >
              <div className="slider-fill" style={{ width: `${progress}%` }} />
              <div
                className="slider-thumb"
                ref={thumbRef}
                style={{ left: `${progress}%` }}
              />
            </div>
          </div>

          <div className="controls">
            <button
              className="ctrl-btn"
              onClick={() => skip(-10)}
              title="Rewind"
            >
              {"<|"}
            </button>
            <button className="ctrl-btn" onClick={handlePlay} title="Play">
              {"▶"}
            </button>
            <button className="ctrl-btn" onClick={handlePause} title="Pause">
              {"❚❚"}
            </button>
            <button
              className="ctrl-btn"
              onClick={() => skip(10)}
              title="Forward"
            >
              {"|>"}
            </button>
            <div className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatTime = (t) => {
  if (!t || isNaN(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

export default MusicPlayer;
