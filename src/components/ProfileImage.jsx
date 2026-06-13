// src/components/ProfileImage.jsx
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// complete - mobie responsive
// replace gsap with useGsap from react
// improved overall performance side
function ProfileImage({ src, alt = "" }) {
  // gspa vars
  const containerRef = useRef(null);
  const shineRef = useRef(null);
  const starRef = useRef(null);

  // svg vars
  const starSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 31.79 31.78"
      style={{ width: "100%", height: "100%" }}
    >
      <path
        fill="#bbb5"
        d="m31.29,16.52c-7.23,1.84-12.93,7.53-14.77,14.77-.17.66-1.1.66-1.26,0-1.84-7.23-7.53-12.92-14.77-14.77-.66-.17-.66-1.1,0-1.26C7.72,13.42,13.42,7.72,15.26.49c.17-.66,1.1-.66,1.26,0,1.84,7.23,7.54,12.93,14.77,14.77.66.17.66,1.1,0,1.26Z"
      />
    </svg>
  );

  // useGSAP automatically handles cleanup, kills timelines, and clears delayedCalls on unmount.
  useGSAP(
    () => {
      /* 
       1. SHINE ANIMATION
        */
      if (shineRef.current) {
        // Animate xPercent instead of 'left' to use GPU acceleration (Compositor only)
        gsap
          .timeline({ repeat: -1, repeatDelay: 3 })
          .set(shineRef.current, { xPercent: -50, opacity: 0 })
          .to(shineRef.current, {
            xPercent: 500,
            opacity: 1,
            duration: 1,
            ease: "power2.inOut",
          })
          .to(
            shineRef.current,
            {
              opacity: 0,
              duration: 0.2,
            },
            "-=0.2",
          ); // Slightly overlap the fade-out for a smoother look
      }

      /* 
       2. STAR ANIMATION
        */
      if (containerRef.current && starRef.current) {
        const container = containerRef.current;
        const star = starRef.current;

        const animateStar = () => {
          // Use offsetWidth/Height instead of getBoundingClientRect() to avoid Layout Thrashing
          const { offsetWidth, offsetHeight } = container;
          const padding = 30;

          // Ensure padding doesn't exceed container size
          const maxX = Math.max(padding, offsetWidth - padding);
          const maxY = Math.max(padding, offsetHeight - padding);

          // Calculate random variables
          const size = gsap.utils.random(22, 54);
          const startX = gsap.utils.random(padding, maxX);
          const startY = gsap.utils.random(padding, maxY);
          const driftX = gsap.utils.random(-45, 45);
          const driftY = gsap.utils.random(-45, 45);

          // Apply starting position BEFORE animating
          gsap.set(star, {
            x: startX,
            y: startY,
            width: size,
            height: size,
            opacity: 0,
            scale: 0.3, // Start slightly smaller
          });

          // The timeline triggers the next loop automatically
          const tl = gsap.timeline({
            onComplete: () => {
              gsap.delayedCall(gsap.utils.random(2, 6), animateStar);
            },
          });

          // Phase 1: Pop in
          tl.to(star, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.5)", // Gives it a nice "pop" effect
          })
            // Phase 2: Drift (Accelerate, coast, and brake naturally using an 'inOut' ease)
            .to(
              star,
              {
                x: `+=${driftX}`,
                y: `+=${driftY}`,
                duration: 1.3,
                ease: "sine.inOut", // Replaces the 3 chained manual math tweens with a perfect physics curve
              },
              0,
            ) // Start at time 0 (with the pop-in)
            // Phase 3: Fade out while braking
            .to(
              star,
              {
                opacity: 0,
                scale: 0.5,
                duration: 0.4,
                ease: "power2.in",
              },
              "-=0.4",
            ); // Run in the last 0.4 seconds of the drift
        };

        // Start the loop
        animateStar();
      }
    },
    { scope: containerRef },
  ); // Scope optimizes selector queries and bounds memory management

  return (
    <div className="profile-container max-w-md mx-auto p-2 w-full h-full">
      <div
        ref={containerRef}
        className="w-full aspect-square relative overflow-hidden"
      >
        {/* The image */}
        <img
          src={src}
          alt={alt}
          className="object-cover w-full h-full border-2 border-white"
        />

        {/* Shine effect */}
        <div
          ref={shineRef}
          style={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "30%",
            height: "200%",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.1) 55%, transparent 100%)",
            transform: "rotate(25deg)",
            pointerEvents: "none",
            opacity: 0,
          }}
        />

        {/* Star SVG with pop animation */}
        <div
          ref={starRef}
          style={{
            position: "absolute",
            width: 30,
            height: 30,
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        >
          {starSVG}
        </div>
      </div>
    </div>
  );
}

export default ProfileImage;
