import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

function Terminal({ className = "" }) {
  return (
    <div
      className={`relative border border-white overflow-hidden w-full h-full ${className}`}
    >
      <code className="jb-mono px-4 text-xs font-light leading-none select-none text-white">
        Is this running? Clearly yeah.
      </code>
    </div>
  );
}

export default Terminal;
