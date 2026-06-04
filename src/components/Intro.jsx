// src/components/Intro.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

function Intro({ name, age }) {
  return (
    <>
      <div
        className="text-white w-full jb-mono
        text-[clamp(0.3rem,1.5cqw,0.7rem)] px-3 py-1 w-full h-full"
      >
        <p>
          I am a developer in Indonesia with expertise in UI/UX design,
          Front-End development, and System Architecture.
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
    </>
  );
}

export default Intro;
