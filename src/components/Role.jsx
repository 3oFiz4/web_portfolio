// src/components/Role.jsx
import React, { useRef, useMemo, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const BASE_SPEED = 18;
const DRAG_MULTIPLIER = 1.35;
const MAX_DRAG_SPEED = 320;
const SMOOTHNESS = 0.09;
const COPY_COUNT = 12;

function Role({ list = [] }) {
  const wrapperRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const sequenceRef = useRef(null);

  // Consolidated animation state
  const animationStateRef = useRef({
    x: 0,
    currentSpeed: BASE_SPEED,
    targetSpeed: BASE_SPEED,
    sequenceWidth: 0,
    isHovering: false,
    isDragging: false,
    dragStartX: 0,
    dragDistance: 0,
  });

  // Memoize list to prevent unnecessary re-renders
  const memoizedList = useMemo(() => list, [list]);

  const { contextSafe } = useGSAP(
    () => {
      if (!memoizedList.length) return;

      const viewport = viewportRef.current;
      const track = trackRef.current;
      const sequence = sequenceRef.current;
      if (!viewport || !track || !sequence) return;

      const state = animationStateRef.current;
      let resizeTimeout = null;

      // Use quickSetter for optimal performance
      const setX = gsap.quickSetter(track, "x", "px");

      const measure = () => {
        const width = sequence.offsetWidth;
        if (!width) return;

        state.sequenceWidth = width;

        // Initialize position
        if (state.x === 0) {
          state.x = -width;
          setX(state.x);
        } else {
          // Normalize position on resize
          while (state.x >= 0) state.x -= width;
          while (state.x <= -2 * width) state.x += width;
          setX(state.x);
        }
      };

      // Single, clean ticker function
      const tick = (time, deltaTime) => {
        const width = state.sequenceWidth;
        if (!width) return;

        // Calculate target speed based on current interaction state
        if (state.isDragging) {
          state.targetSpeed = gsap.utils.clamp(
            -MAX_DRAG_SPEED,
            MAX_DRAG_SPEED,
            state.dragDistance * DRAG_MULTIPLIER,
          );
        } else if (state.isHovering) {
          state.targetSpeed = 0;
        } else {
          state.targetSpeed = BASE_SPEED;
        }

        // Smooth interpolation
        state.currentSpeed = gsap.utils.interpolate(
          state.currentSpeed,
          state.targetSpeed,
          state.isDragging ? 0.18 : SMOOTHNESS,
        );

        // Update position
        state.x += state.currentSpeed * (deltaTime / 1000);

        // Handle infinite loop
        if (state.x >= 0) state.x -= width;
        if (state.x <= -2 * width) state.x += width;

        setX(state.x);
      };

      // Debounced resize handler
      const debouncedMeasure = () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(measure, 16);
      };

      // Setup observers
      const ro = new ResizeObserver(debouncedMeasure);
      ro.observe(viewport);
      ro.observe(sequence);

      // Initial setup
      measure();

      // Start the ticker - this ensures it runs from the beginning
      gsap.ticker.add(tick);

      return () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        ro.disconnect();
        gsap.ticker.remove(tick);
      };
    },
    { scope: wrapperRef, dependencies: [memoizedList] },
  );

  // Event handlers using contextSafe
  const handlePointerDown = contextSafe((e) => {
    const state = animationStateRef.current;
    state.isDragging = true;
    state.dragStartX = e.clientX;
    state.dragDistance = 0;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  });

  const handlePointerMove = contextSafe((e) => {
    const state = animationStateRef.current;
    if (!state.isDragging) return;
    state.dragDistance = e.clientX - state.dragStartX;
  });

  const stopDragging = contextSafe((e) => {
    const state = animationStateRef.current;
    if (!state.isDragging) return;
    state.isDragging = false;
    state.dragDistance = 0;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  });

  // Memoized mouse handlers
  const handleMouseEnter = useCallback(() => {
    animationStateRef.current.isHovering = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    animationStateRef.current.isHovering = false;
  }, []);

  const preventDragStart = useCallback((e) => e.preventDefault(), []);

  if (!memoizedList.length) return null;

  return (
    <div ref={wrapperRef} className="relative w-full overflow-hidden">
      {/* Left fade overlay */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-10 h-full"
        style={{
          width: "clamp(1rem, 3vw, 2rem)",
          background:
            "linear-gradient(to right, var(--fade-bg, #000) 0%, transparent 100%)",
        }}
      />

      {/* Right fade overlay */}
      <div
        className="pointer-events-none absolute right-0 top-0 z-10 h-full"
        style={{
          width: "clamp(1rem, 3vw, 5rem)",
          background:
            "linear-gradient(to left, var(--fade-bg, #000) 0%, transparent 100%)",
        }}
      />

      <div
        ref={viewportRef}
        className="relative w-full select-none cursor-grab overflow-hidden active:cursor-grabbing"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onDragStart={preventDragStart}
        style={{ touchAction: "none" }}
      >
        <div
          ref={trackRef}
          className="flex w-24 whitespace-nowrap will-change-transform"
        >
          {Array.from({ length: COPY_COUNT }).map((_, copyIndex) => (
            <div
              key={copyIndex}
              ref={copyIndex === 0 ? sequenceRef : null}
              className="flex shrink-0 items-center gap-6 pr-6"
              aria-hidden={copyIndex !== 0}
            >
              {memoizedList.map((role, roleIndex) => (
                <span
                  key={`${copyIndex}-${roleIndex}`}
                  className="text-white w-full jb-mono text-center
                  text-[clamp(0.65rem,2.5vw,0.875rem)]"
                >
                  {role}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Role;
