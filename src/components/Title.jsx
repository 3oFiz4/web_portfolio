// src/components/Title.jsx
import React, { useRef, useEffect } from "react";
import gsap from "gsap";

function MovingStripes({ stripeClassName = "", opacity = 0.18 }) {
  // Each block is exactly 38 viewBox units wide, containing exactly 3 slanted stripes.
  // We render blocks from i = -4 to 50 so that there is an endless continuous canvas with flawless wrap overlap.
  const blocks = Array.from({ length: 55 }, (_, idx) => idx - 4); // -4 to 50

  return (
    <svg
      viewBox="-152 0 2052 15" // -4 * 38 = -152, 54 * 38 = 2052
      preserveAspectRatio="none"
      className={`block h-full shrink-0 pointer-events-none ${stripeClassName}`}
      style={{ width: "auto", height: "100%", display: "block" }}
    >
      <g opacity={opacity} fill="currentColor">
        {blocks.map((i) => {
          const tx = 40 * i;
          return (
            <g key={i} transform={`translate(${tx}, 0)`}>
              {/* Stripe 0 */}
              <polygon points="14.11,0 5.29,15 0,15 8.82,0" />
              {/* Stripe 1 */}
              <polygon points="26.7767,0 17.9567,15 12.6667,15 21.4867,0" />
              {/* Stripe 2 */}
              <polygon points="39.4433,0 30.6233,15 25.3333,15 34.1533,0" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

const VARIANTS = {
  black: {
    text: "text-white",
    stripeColor: "text-white",
    stripeOpacity: 0.18,
  },
};

function Title({
  children,
  variant = "black",
  direction = "right",
  duration = 20,
  className = "",
  bgClassName,
  textClassName,
  stripeClassName,
  stripeOpacity,
  ...props
}) {
  const containerRef = useRef(null);
  const stripeTrackRef = useRef(null);

  const activeVariant = VARIANTS[variant] || VARIANTS.sky;

  const finalBgClassName =
    bgClassName !== undefined ? bgClassName : activeVariant.bg;
  const finalTextClassName =
    textClassName !== undefined ? textClassName : activeVariant.text;
  const finalStripeClassName =
    stripeClassName !== undefined ? stripeClassName : activeVariant.stripeColor;
  const finalStripeOpacity =
    stripeOpacity !== undefined ? stripeOpacity : activeVariant.stripeOpacity;

  useEffect(() => {
    const track = stripeTrackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    let tween = null;

    const setupAnimation = () => {
      const containerHeight = container.getBoundingClientRect().height || 64;

      // Calculate exact pixels corresponding to 6 blocks (228 viewBox units).
      // Since viewBox height is 15, each viewBox unit is containerHeight / 15 pixels.
      // 228 units is exactly 6 repeats of our 38-unit pattern block.
      const loopPixels = containerHeight * (228 / 15);

      // Lock track height to container
      track.style.height = `${containerHeight}px`;
      const svg = track.querySelector("svg");
      if (svg) {
        svg.style.height = `${containerHeight}px`;
      }

      if (tween) tween.kill();

      // Flawless GSAP seamless loop shifting by exactly loopPixels
      tween = gsap.fromTo(
        track,
        direction === "right" ? { x: -loopPixels } : { x: 0 },
        direction === "right"
          ? { x: 0, duration, ease: "none", repeat: -1 }
          : { x: -loopPixels, duration, ease: "none", repeat: -1 },
      );
    };

    // Run setup after DOM render
    requestAnimationFrame(setupAnimation);

    window.addEventListener("resize", setupAnimation);
    return () => {
      window.removeEventListener("resize", setupAnimation);
      if (tween) tween.kill();
    };
  }, [direction, duration]);

  return (
    <h1
      ref={containerRef}
      className={`relative overflow-hidden inline-flex items-center justify-center tracking-tight select-none ${finalBgClassName} ${finalTextClassName} ${className}`}
      {...props}
    >
      {/* Flawless continuous MovingStripes track */}
      <div
        ref={stripeTrackRef}
        className={`absolute inset-y-0 left-0 flex flex-row items-center pointer-events-none z-0 will-change-transform ${finalStripeClassName}`}
      >
        <MovingStripes opacity={finalStripeOpacity} />
      </div>

      {/* Glossy overlay for premium depth */}
      <div className="absolute inset-0 pointer-events-none z-1" />

      {/* Title Text Content */}
      <span className="relative z-10 ">{children}</span>
    </h1>
  );
}

export default Title;
