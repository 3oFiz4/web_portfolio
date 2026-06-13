// src/components/Intro.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

function Intro() {
  // text-white w-full jb-mono px-3 py-1
  // /* CHANGED: Fixed height constraint for mobile so it has a definitive scroll boundary, then resets on desktop */
  // h-52 max-h-52 md:h-full md:max-h-full
  // /* Vertical scrollbar configuration */
  // overflow-y-auto touch-pan-y
  // scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
  //
  // /* Mobile vs Desktop Fluid Typography */
  // max-md:text-[clamp(0.7rem,3.5vw,0.9rem)]
  // md:text-[clamp(0.3rem,1.5cqw,0.7rem)]
  return (
    <div
      className="text-white w-full jb-mono
      overflow-y-auto max-h-full touch-pan-y
      scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
h-52 max-h-52 md:h-full md:max-h-full
      max-md:text-[clamp(0.8rem,1vw,.8rem)] 
        md:text-[clamp(0.3rem,1.5cqw,0.7rem)]
        px-3 py-1 w-full h-full"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.1) transparent",
      }}
    >
      <p>
        I am a developer in Indonesia with expertise in UI/UX design, Front-End
        development, and System Architecture.
      </p>
      <br />
      <p>
        Challenge and creation is what drives me. It is a part that empower my
        curiosity, growrth, and understanding.
      </p>
      <br />
      <p>
        I am interested in other field such as: Mathematics, Psychology,
        Finance, Machine Learning and Videography.
      </p>
      <br />
      <p>
        I mostly spend my time creating random projects, solving puzzles,
        reading, discussing and writing.
      </p>
    </div>
  );
}

export default Intro;
