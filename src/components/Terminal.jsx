import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

function Terminal({ className = "" }) {
  return (
    <div
      className={`relative border border-white overflow-hidden w-full h-full ${className}`}
    >
      {/* CHANGED: Replaced text-[10px] with a fluid text clamp, added whitespace-pre-wrap, and safe padding/overflow rules */}
      <pre className="jb-mono px-4 py-3 h-full text-[clamp(0.6rem,2vw,0.65rem)] font-light text-white whitespace-pre-wrap overflow-y-auto break-words">
        v0.0.1 This website is still early, please wait for another feature! ty!
        <br />
        Coming soon:
        <br /> [ ] Projects
        <br /> [ ] About
        <br /> [ ] ???
        <br /> [ ] Mobile-support
        <br />
      </pre>
    </div>
  );
}

export default Terminal;
