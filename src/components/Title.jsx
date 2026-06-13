// src/components/Title.jsx
import React, { useRef, useMemo, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function MovingStripes({ stripeClassName = "", opacity = 0.18 }) {
  // Optimized: Memoize blocks array to prevent recreation on every render
  const blocks = useMemo(
    () => Array.from({ length: 55 }, (_, idx) => idx - 4),
    [],
  );

  return (
    <svg
      viewBox="-152 0 2052 15"
      preserveAspectRatio="none"
      className={`block h-full shrink-0 pointer-events-none ${stripeClassName}`}
      style={{ width: "auto", height: "100%", display: "block" }}
    >
      <g opacity={opacity} fill="currentColor">
        {blocks.map((i) => {
          const tx = 40 * i;
          return (
            <g key={i} transform={`translate(${tx}, 0)`}>
              <polygon points="14.11,0 5.29,15 0,15 8.82,0" />
              <polygon points="26.7767,0 17.9567,15 12.6667,15 21.4867,0" />
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

  // Cache for animation state to prevent recalculations
  const animationStateRef = useRef({
    containerHeight: 0,
    loopPixels: 0,
    isVisible: true,
    needsRefresh: true,
  });

  const activeVariant = VARIANTS[variant] || VARIANTS.black;

  const finalBgClassName =
    bgClassName !== undefined ? bgClassName : activeVariant.bg;
  const finalTextClassName =
    textClassName !== undefined ? textClassName : activeVariant.text;
  const finalStripeClassName =
    stripeClassName !== undefined ? stripeClassName : activeVariant.stripeColor;
  const finalStripeOpacity =
    stripeOpacity !== undefined ? stripeOpacity : activeVariant.stripeOpacity;

  // Optimized calculation function with caching
  const calculateAnimationParams = useCallback(() => {
    const container = containerRef.current;
    if (!container) return null;

    const containerHeight = container.getBoundingClientRect().height || 64;

    // Only recalculate if height actually changed
    if (
      containerHeight === animationStateRef.current.containerHeight &&
      !animationStateRef.current.needsRefresh
    ) {
      return {
        containerHeight: animationStateRef.current.containerHeight,
        loopPixels: animationStateRef.current.loopPixels,
      };
    }

    const loopPixels = containerHeight * (228 / 15);

    // Cache the values
    animationStateRef.current.containerHeight = containerHeight;
    animationStateRef.current.loopPixels = loopPixels;
    animationStateRef.current.needsRefresh = false;

    return { containerHeight, loopPixels };
  }, []);

  const { contextSafe } = useGSAP(
    () => {
      const track = stripeTrackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;

      const state = animationStateRef.current;
      let resizeTimeout = null;

      // Use GSAP quickSetter for optimal performance
      const setHeight = gsap.quickSetter(track, "height", "px");
      const setSvgHeight = gsap.quickSetter(
        track.querySelector("svg"),
        "height",
        "px",
      );

      const setupAnimation = () => {
        const params = calculateAnimationParams();
        if (!params) return;

        const { containerHeight, loopPixels } = params;

        // Use GSAP for DOM manipulation instead of direct style setting
        setHeight(containerHeight);
        if (track.querySelector("svg")) {
          setSvgHeight(containerHeight);
        }

        // Create timeline for better performance and control
        const tl = gsap.timeline({
          repeat: -1,
          ease: "none",
          paused: !state.isVisible, // Only play if visible
        });

        // Configure animation based on direction
        const fromX = direction === "right" ? -loopPixels : 0;
        const toX = direction === "right" ? 0 : -loopPixels;

        tl.fromTo(track, { x: fromX }, { x: toX, duration, ease: "none" });

        return tl;
      };

      // Debounced resize handler for better performance
      const debouncedSetup = () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          animationStateRef.current.needsRefresh = true;
          setupAnimation();
        }, 100); // 100ms debounce
      };

      // Intersection Observer for visibility optimization
      const io = new IntersectionObserver(
        (entries) => {
          const isVisible = entries[0].isIntersecting;
          if (state.isVisible !== isVisible) {
            state.isVisible = isVisible;

            // Pause/resume animation based on visibility
            const timeline = gsap.getById("stripe-animation");
            if (timeline) {
              isVisible ? timeline.play() : timeline.pause();
            }
          }
        },
        { threshold: 0, rootMargin: "50px" },
      );

      io.observe(container);

      // Setup ResizeObserver for better performance than window resize
      const ro = new ResizeObserver(debouncedSetup);
      ro.observe(container);

      // Initial setup
      const initialTimeline = setupAnimation();
      if (initialTimeline) {
        initialTimeline.set({}, { id: "stripe-animation" });
      }

      return () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        io.disconnect();
        ro.disconnect();
        gsap.killTweensOf(track);
      };
    },
    {
      scope: containerRef,
      dependencies: [
        direction,
        duration,
        finalStripeClassName,
        finalStripeOpacity,
      ],
    },
  );

  // Memoized stripe component to prevent unnecessary re-renders
  const memoizedStripes = useMemo(
    () => (
      <MovingStripes
        stripeClassName={finalStripeClassName}
        opacity={finalStripeOpacity}
      />
    ),
    [finalStripeClassName, finalStripeOpacity],
  );

  return (
    <h1
      ref={containerRef}
      className={`relative overflow-hidden inline-flex items-center justify-center tracking-tight select-none ${finalBgClassName} ${finalTextClassName} ${className}`}
      {...props}
    >
      {/* Optimized MovingStripes track with proper will-change placement */}
      <div
        ref={stripeTrackRef}
        className={`absolute inset-y-0 left-0 flex flex-row items-center pointer-events-none z-0 will-change-transform ${finalStripeClassName}`}
      >
        {memoizedStripes}
      </div>

      {/* Glossy overlay for premium depth */}
      <div className="absolute inset-0 pointer-events-none z-1" />

      {/* Title Text Content */}
      <span className="relative z-10">{children}</span>
    </h1>
  );
}

export default Title;
