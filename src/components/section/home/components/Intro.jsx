// src/components/Intro.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(Observer);

function Intro() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Use Observer for high-performance drag-to-scroll logic
    const obs = Observer.create({
      target: el,
      type: "touch,pointer", // Listen for touch and mouse dragging
      dragMinimum: 2, // Avoid accidental triggers on taps
      onChangeY: (self) => {
        // Increment scroll position based on drag delta (inverted for natural feel)
        el.scrollTop -= self.deltaY;
      },
      // Allow standard behavior for links/buttons inside if any
      preventDefault: false,
    });

    return () => obs.kill();
  }, []);
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
      ref={scrollRef}
      className="text-white w-full jb-mono
      overflow-y-auto max-h-full touch-pan-y
      scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
      h-52 max-h-52 md:h-full md:max-h-full
      max-md:text-[clamp(0.8rem,1vw,.8rem)] 
      md:text-[clamp(0.3rem,1.5cqw,0.7rem)]
      cursor-grab active:cursor-grabbing
      px-3 py-1 w-full h-full"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.1) transparent",
        overscrollBehavior: "contain", // Prevents page bounce
        WebkitOverflowScrolling: "touch",
      }}
    >
      <p>
        I am a <b>College Student and a Junior Freelance</b> developer in Bali,
        Indonesia with expertise in{" "}
        <b>
          UI/UX design, Front-End development, TUI Scripting and System
          Architecture
        </b>
        .
      </p>
      <br />
      <p>
        I am naturally born as an <b>extremely curious person</b>, and easily
        adaptable to any circumstances. I tend to{" "}
        <b>favor things that has "process" or "mechanism" behind</b>, so I am
        not stuck on logic and rational fields, but also field that provides
        ambiguous and probabilistic nature, call it Psychology, and Finance.
      </p>
      <br />
      <p>
        Most of my <b>projects are open-sourced on GitHub</b> and everybody can
        see it. There I mostly build what I believe to simply satisfy my
        curiosity, and to apply what seems to be impossible, is possible.
      </p>
      <br />
      <p>
        I am interested in other field such as (ranked): Mathematics,
        Psychology, Finance, Machine Learning and Videography.
      </p>
      <br />
      <p>
        Irrelevant info:
        <br />- I am ENFP
        <br />- I am rejected from Psych. degree, so I ended up in Computer
        Science lol
        <br />- I read too many philosophy book, so expect me when I said the
        most unhinged stuff
      </p>
    </div>
  );
}

export default Intro;
