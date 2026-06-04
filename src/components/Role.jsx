// src/components/Role.jsx
import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

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

  const xRef = useRef(0);
  const currentSpeedRef = useRef(BASE_SPEED);
  const targetSpeedRef = useRef(BASE_SPEED);
  const sequenceWidthRef = useRef(0);

  const isHoveringRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragDistanceRef = useRef(0);

  useLayoutEffect(() => {
    if (!list.length) return;

    const viewport = viewportRef.current;
    const track = trackRef.current;
    const sequence = sequenceRef.current;
    if (!viewport || !track || !sequence) return;

    const setX = gsap.quickSetter(track, "x", "px");

    const measure = () => {
      const width = sequence.offsetWidth;
      if (!width) return;

      sequenceWidthRef.current = width;

      if (xRef.current === 0) {
        xRef.current = -width;
        setX(xRef.current);
      } else {
        while (xRef.current >= 0) xRef.current -= width;
        while (xRef.current <= -2 * width) xRef.current += width;
        setX(xRef.current);
      }
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    ro.observe(sequence);

    const tick = (_, deltaTime) => {
      const width = sequenceWidthRef.current;
      if (!width) return;

      if (isDraggingRef.current) {
        targetSpeedRef.current = gsap.utils.clamp(
          -MAX_DRAG_SPEED,
          MAX_DRAG_SPEED,
          dragDistanceRef.current * DRAG_MULTIPLIER
        );
      } else if (isHoveringRef.current) {
        targetSpeedRef.current = 0;
      } else {
        targetSpeedRef.current = BASE_SPEED;
      }

      currentSpeedRef.current = gsap.utils.interpolate(
        currentSpeedRef.current,
        targetSpeedRef.current,
        isDraggingRef.current ? 0.18 : SMOOTHNESS
      );

      xRef.current += currentSpeedRef.current * (deltaTime / 1000);

      if (xRef.current >= 0) xRef.current -= width;
      if (xRef.current <= -2 * width) xRef.current += width;

      setX(xRef.current);
    };

    gsap.ticker.add(tick);

    return () => {
      ro.disconnect();
      gsap.ticker.remove(tick);
    };
  }, [list]);

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragDistanceRef.current = 0;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    dragDistanceRef.current = e.clientX - dragStartXRef.current;
  };

  const stopDragging = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    dragDistanceRef.current = 0;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  if (!list.length) return null;

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={{
        overflow: "hidden",
      }}
    >
      {/* Left fade overlay */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-10 h-full"
        style={{
          width: "24px",
          background:
            "linear-gradient(to right, var(--fade-bg, #000) 0%, transparent 100%)",
        }}
      />

      {/* Right fade overlay */}
      <div
        className="pointer-events-none absolute right-0 top-0 z-10 h-full"
        style={{
          width: "24px",
          background:
            "linear-gradient(to left, var(--fade-bg, #000) 0%, transparent 100%)",
        }}
      />

      <div
        ref={viewportRef}
        className="relative select-none cursor-grab overflow-hidden active:cursor-grabbing"
        onMouseEnter={() => (isHoveringRef.current = true)}
        onMouseLeave={() => (isHoveringRef.current = false)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onDragStart={(e) => e.preventDefault()}
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
              {list.map((role, roleIndex) => (
                <span
                  key={`${copyIndex}-${roleIndex}`}
                  className="text-white w-full jb-mono text-center
                  text-xs md:text-sm lg:text-sm"
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
