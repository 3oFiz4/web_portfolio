import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

function Terminal({ className = "" }) {
  return (
    <div
      className={`relative border border-white overflow-hidden w-full h-full ${className}`}
    >
      {/* CHANGED: Replaced text-[10px] with a fluid text clamp, added whitespace-pre-wrap, and safe padding/overflow rules */}
      <pre
        className="jb-mono px-4 py-3 h-full text-[clamp(0.6rem,2vw,0.65rem)] font-light text-white whitespace-pre-wrap overflow-y-auto break-words
      overflow-y-auto max-h-full touch-pan-y
      scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
        "
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.1) transparent",
        }}
      >
        v0.0.2 (overhaul on animation performance and mobile-support viewport)
        <br />
        <br />
        Coming soon:
        <br /> [x] Mobile-support (v0.2)
        <br /> [x]-Anim. performance improvement (v0.2)
        <br /> [ ] Projects
        <br /> [ ] About
        <br /> [ ] ???
        <br />
      </pre>
    </div>
  );
}

export default Terminal;
