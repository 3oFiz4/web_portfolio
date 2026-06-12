import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { RiDoubleQuotesL as QuoteIcon } from "react-icons/ri";

function Quote({
  className = "",
  text = "Is this running? Clearly yeah.",
  origin = "Anonymous",
}) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const iconRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 1.2 },
    });

    tl.fromTo(
      lineRef.current,
      { scaleY: 0, transformOrigin: "top" },
      { scaleY: 1, delay: 0.2 },
    )
      .fromTo(
        iconRef.current,
        { opacity: 0, x: -10 },
        { opacity: 0.4, x: 0 },
        "-=0.8",
      )
      .fromTo(
        textRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0 },
        "-=1",
      );
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-start gap-4 p-2 ${className}`}
      style={{ background: "transparent" }}
    >
      {/* Vertical Accent Line */}
      <div
        ref={lineRef}
        className="w-[1px] h-full absolute left-0 top-0 bg-gradient-to-b from-white/60 via-white/20 to-transparent"
      />

      {/* Quote Icon */}
      <div ref={iconRef} className="mt-1">
        <QuoteIcon
          size={24}
          className="absolute text-white fill-white/50 -top-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        {/* Main Text */}
        <p
          ref={textRef}
          className="jb-mono text-sm md:text-base font-light tracking-wide leading-relaxed text-white/90 select-none italic"
        >
          "{text}"
        </p>

        {/* Sub-decoration */}
        <div className="flex items-center gap-2">
          <span className="h-[1px] w-4 bg-white/30"></span>
          <span className="jb-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            {origin}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Quote;
