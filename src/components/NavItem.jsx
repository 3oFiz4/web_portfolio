// src/components/NavItem.jsx
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

const STRIPE_SVG = (
  <svg
    viewBox="0 0 216.79 15"
    preserveAspectRatio="none"
    style={{ display: "block", flexShrink: 0, height: "100%", width: "auto" }}
  >
    <g opacity=".15">
      <polygon fill="#fff" points="14.11 0 5.29 15 0 15 8.82 0 14.11 0" />
      <polygon fill="#fff" points="26.77 0 17.95 15 12.66 15 21.49 0 26.77 0" />
      <polygon fill="#fff" points="39.44 0 30.62 15 25.33 15 34.16 0 39.44 0" />
      <polygon fill="#fff" points="52.11 0 43.29 15 38 15 46.83 0 52.11 0" />
      <polygon fill="#fff" points="64.78 0 55.96 15 50.67 15 59.49 0 64.78 0" />
      <polygon fill="#fff" points="77.45 0 68.63 15 63.34 15 72.16 0 77.45 0" />
      <polygon fill="#fff" points="90.12 0 81.3 15 76.01 15 84.83 0 90.12 0" />
      <polygon
        fill="#fff"
        points="102.78 0 93.96 15 88.67 15 97.49 0 102.78 0"
      />
      <polygon
        fill="#fff"
        points="115.45 0 106.63 15 101.34 15 110.16 0 115.45 0"
      />
      <polygon
        fill="#fff"
        points="128.12 0 119.3 15 114.01 15 122.84 0 128.12 0"
      />
      <polygon
        fill="#fff"
        points="140.79 0 131.96 15 126.68 15 135.5 0 140.79 0"
      />
      <polygon
        fill="#fff"
        points="153.46 0 144.63 15 139.35 15 148.17 0 153.46 0"
      />
      <polygon
        fill="#fff"
        points="166.13 0 157.31 15 152.02 15 160.84 0 166.13 0"
      />
      <polygon
        fill="#fff"
        points="178.79 0 169.97 15 164.68 15 173.5 0 178.79 0"
      />
      <polygon
        fill="#fff"
        points="191.46 0 182.64 15 177.35 15 186.17 0 191.46 0"
      />
      <polygon
        fill="#fff"
        points="204.13 0 195.31 15 190.02 15 198.84 0 204.13 0"
      />
      <polygon
        fill="#fff"
        points="216.79 0 207.97 15 202.69 15 211.51 0 216.79 0"
      />
      <polygon
        fill="#fff"
        fillOpacity="0.5"
        points="186.17 0 177.35 15 169.97 15 178.79 0 186.17 0"
      />
      <polygon
        fill="#fff"
        fillOpacity="0.5"
        points="211.51 0 202.69 15 195.31 15 204.13 0 211.51 0"
      />
      <polygon
        fill="#fff"
        fillOpacity="0.5"
        points="198.84 0 190.02 15 182.64 15 191.46 0 198.84 0"
      />
      <polygon
        fill="#fff"
        fillOpacity="0.5"
        points="173.5 0 164.68 15 157.31 15 166.13 0 173.5 0"
      />
      <polygon
        fill="#fff"
        fillOpacity="0.5"
        points="160.84 0 152.02 15 144.63 15 153.46 0 160.84 0"
      />
      <polygon
        fill="#fff"
        fillOpacity="0.5"
        points="148.17 0 139.35 15 131.96 15 140.79 0 148.17 0"
      />
      <polygon
        fill="#fff"
        fillOpacity="0.5"
        points="135.5 0 126.68 15 119.3 15 128.12 0 135.5 0"
      />
      <polygon
        fill="#fff"
        fillOpacity="0.5"
        points="122.84 0 114.01 15 106.63 15 115.45 0 122.84 0"
      />
      <polygon
        fill="#fff"
        fillOpacity="0.5"
        points="110.16 0 101.34 15 93.96 15 102.78 0 110.16 0"
      />
      <polygon
        fill="#fff"
        fillOpacity="0.5"
        points="97.49 0 88.67 15 81.3 15 90.12 0 97.49 0"
      />
      <polygon
        fill="#fff"
        fillOpacity="0.5"
        points="84.83 0 76.01 15 68.63 15 77.45 0 84.83 0"
      />
      <polygon
        fill="#fff"
        fillOpacity="0.5"
        points="72.16 0 63.34 15 55.96 15 64.78 0 72.16 0"
      />
      <polygon
        fill="#fff"
        fillOpacity="0.5"
        points="59.49 0 50.67 15 43.29 15 52.11 0 59.49 0"
      />
      <polygon
        fill="#fff"
        fillOpacity="0.5"
        points="46.83 0 38 15 30.62 15 39.44 0 46.83 0"
      />
      <polygon
        fill="#fff"
        fillOpacity="0.5"
        points="34.16 0 25.33 15 17.95 15 26.77 0 34.16 0"
      />
      <polygon
        fill="#fff"
        fillOpacity="0.5"
        points="21.49 0 12.66 15 5.29 15 14.11 0 21.49 0"
      />
    </g>
  </svg>
);

const COPIES = 6;

function NavItem({ label, href }) {
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
          { x: 0, duration: 20, ease: "none" }
        );

        // Scroll loop — mask track
        scrollMaskTlRef.current = gsap.timeline({ repeat: -1 });
        scrollMaskTlRef.current.fromTo(
          mask,
          { x: -singleWidth },
          { x: 0, duration: 20, ease: "none" }
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
