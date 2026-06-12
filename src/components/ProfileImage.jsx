// src/components/ProfileImage.jsx
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

function ProfileImage({ src, alt = "" }) {
  const containerRef = useRef(null);
  const shineRef = useRef(null);
  const starRef = useRef(null);
  const [squareStyle, setSquareStyle] = useState({ top: 100, left: 120 });

  // Shine animation — every 4 seconds
  useEffect(() => {
    const shine = shineRef.current;
    if (!shine) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });

    tl.set(shine, { left: "-50%", opacity: 0 })
      .to(shine, {
        left: "150%",
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
      })
      .to(shine, {
        opacity: 0,
        duration: 0.2,
      });

    return () => tl.kill();
  }, []);

  // Star pop-in animation
  // Random animated star
  useEffect(() => {
    const container = containerRef.current;
    const star = starRef.current;

    if (!container || !star) return;

    let tl;

    const animateStar = () => {
      const rect = container.getBoundingClientRect();

      // Bigger size variation
      const size = gsap.utils.random(22, 54);

      // Keep away from edges
      const padding = 30;

      const x = gsap.utils.random(padding, rect.width - padding);

      const y = gsap.utils.random(padding, rect.height - padding);

      // Very subtle floating
      const driftX = gsap.utils.random(-45, 45);
      const driftY = gsap.utils.random(-45, 45);
      const scaleT = gsap.utils.random(-4, 4);

      tl = gsap.timeline({
        onComplete: () => {
          gsap.delayedCall(gsap.utils.random(2, 6), animateStar);
        },
      });

      tl.to(star, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "sine.out",
      })

        // accelerate slowly
        .to(
          star,
          {
            x: `+=${driftX * 0.6}`,
            y: `+=${driftY * 0.6}`,
            scale: `+${scaleT * 0.6}`,
            duration: 0.4,
            ease: "power1.out",
          },
          0,
        )

        // coast
        .to(star, {
          x: `+=${driftX * 0.3}`,
          y: `+=${driftY * 0.3}`,
          scale: `+${scaleT * 0.3}`,
          duration: 0.3,
          ease: "none",
        })

        // brake naturally
        .to(star, {
          x: `+=${driftX * 0.1}`,
          y: `+=${driftY * 0.1}`,
          scale: `+${scaleT * 0.0}`,
          duration: 0.2,
          ease: "power2.out",
        })

        // fade while braking
        .to(
          star,
          {
            opacity: 0,
            scale: 0,
            duration: 0.4,
            ease: "sine.out",
          },
          "-=1.8",
        );
    };

    animateStar();

    return () => {
      if (tl) tl.kill();
    };
  }, []);

  return (
    <div className="profile-container p-2 w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full relative overflow-hidden"
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
            top: squareStyle.top,
            left: squareStyle.left,
            width: 30,
            height: 30,
            pointerEvents: "none",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 31.79 31.78"
            style={{ width: "100%", height: "100%" }}
          >
            <g>
              <path
                fill="#bbb5"
                d="m31.29,16.52c-7.23,1.84-12.93,7.53-14.77,14.77-.17.66-1.1.66-1.26,0-1.84-7.23-7.53-12.92-14.77-14.77-.66-.17-.66-1.1,0-1.26C7.72,13.42,13.42,7.72,15.26.49c.17-.66,1.1-.66,1.26,0,1.84,7.23,7.54,12.93,14.77,14.77.66.17.66,1.1,0,1.26Z"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default ProfileImage;
