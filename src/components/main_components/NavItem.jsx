// src/components/NavItem.jsx
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

const STRIPE_SVG = (
  <svg
    viewBox="0 0 215.35 15"
    preserveAspectRatio="none"
    style={{
      display: "block",
      flexShrink: 0,
      height: "100%",
      width: "auto",
      marginRight: "-0.5px", // hides tiny browser seam
    }}
  >
    <g opacity=".15">
      {[
        0, 12.66, 25.33, 38, 50.67, 63.34, 76.01, 88.67, 101.34, 114.01, 126.68,
        139.35, 152.02, 164.68, 177.35, 190.02, 202.69,
      ].map((x, i) => (
        <polygon
          key={i}
          fill="#fff"
          points={`${x + 14.11} 0 ${x + 5.29} 15 ${x} 15 ${x + 8.82} 0 ${x + 14.11} 0`}
        />
      ))}
    </g>
  </svg>
);

const COPIES = 6;

function NavItem({ label, href, isAnimating }) {
  const overlayRef = useRef(null);
  const navItemRef = useRef(null);
  const stripeTrackRef = useRef(null);
  const stripeMaskRef = useRef(null);
  const hoverTlRef = useRef(null);
  const scrollTlRef = useRef(null);
  const scrollMaskTlRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  // Listen for hash changes and check on mount
  useEffect(() => {
    const checkHash = () => {
      const currentHash = window.location.hash;
      const targetHash = `#${href}`;
      setIsActive(currentHash === targetHash);
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, [href]);

  // Hover timeline
  useEffect(() => {
    hoverTlRef.current = gsap.timeline({ paused: true });
    hoverTlRef.current.to(overlayRef.current, {
      height: "100%",
      duration: 0.2,
      ease: "power2.inOut",
    });

    return () => hoverTlRef.current?.kill();
  }, []);

  // Lock SVG heights after mount
  useEffect(() => {
    const lockHeights = () => {
      const navHeight = navItemRef.current?.getBoundingClientRect().height;
      if (!navHeight) return;

      [stripeTrackRef, stripeMaskRef].forEach((ref) => {
        if (!ref.current) return;
        ref.current.style.height = `${navHeight}px`;
        ref.current.querySelectorAll("svg").forEach((svg) => {
          svg.style.height = `${navHeight}px`;
          svg.style.width = "auto";
        });
      });
    };

    // Small delay to ensure layout is ready
    requestAnimationFrame(lockHeights);
  }, []);

  // Active state animation
  useEffect(() => {
    const track = stripeTrackRef.current;
    const mask = stripeMaskRef.current;
    if (!track || !mask) return;

    // Kill previous animations
    scrollTlRef.current?.kill();
    scrollMaskTlRef.current?.kill();

    if (isActive) {
      // Wait a frame so SVGs are rendered and measurable
      requestAnimationFrame(() => {
        const firstSvg = track.querySelector("svg");
        if (!firstSvg) return;
        const singleWidth = firstSvg.getBoundingClientRect().width;
        if (!singleWidth) return;

        // Fade in
        gsap.to(track, {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        });

        // Scroll loop — main track
        scrollTlRef.current = gsap.timeline({ repeat: -1 });
        scrollTlRef.current.fromTo(
          track,
          { x: -singleWidth },
          { x: 0, duration: 20, ease: "none" },
        );

        // Scroll loop — mask track
        scrollMaskTlRef.current = gsap.timeline({ repeat: -1 });
        scrollMaskTlRef.current.fromTo(
          mask,
          { x: -singleWidth },
          { x: 0, duration: 20, ease: "none" },
        );
      });
    } else {
      gsap.to(track, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(track, { x: 0 });
          gsap.set(mask, { x: 0 });
        },
      });
    }

    return () => {
      scrollTlRef.current?.kill();
      scrollMaskTlRef.current?.kill();
    };
  }, [isActive]);

  const handleMouseEnter = () => hoverTlRef.current?.play();
  const handleMouseLeave = () => hoverTlRef.current?.reverse();

  const handleClick = () => {
    if (isAnimating?.current) return;
    window.location.hash = `#${href}`;
  };

  return (
    <div
      className="nav-item"
      ref={navItemRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      {/* Stripe track — behind white text */}
      <div
        ref={stripeTrackRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "flex",
          flexDirection: "row",
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0,
          color: "red",
        }}
      >
        {Array.from({ length: COPIES }).map((_, i) => (
          <React.Fragment key={`track-${i}`}>{STRIPE_SVG}</React.Fragment>
        ))}
      </div>

      {/* White text */}
      <div style={{ color: "white", position: "relative", zIndex: 1 }}>
        {label}
      </div>

      {/* Mask overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "0%",
          backgroundColor: "white",
          overflow: "hidden",
          zIndex: 2,
        }}
      >
        {/* Stripe track — inside mask */}
        <div
          ref={stripeMaskRef}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            display: "flex",
            flexDirection: "row",
            zIndex: 0,
            pointerEvents: "none",
            color: "rgba(0,0,0,0.15)",
          }}
        >
          {Array.from({ length: COPIES }).map((_, i) => (
            <React.Fragment key={`mask-${i}`}>{STRIPE_SVG}</React.Fragment>
          ))}
        </div>

        {/* Black text */}
        <div
          style={{
            color: "black",
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            whiteSpace: "nowrap",
            boxSizing: "border-box",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

export default NavItem;
