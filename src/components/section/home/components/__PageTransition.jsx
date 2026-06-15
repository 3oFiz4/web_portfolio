// src/components/components/PageTransition.jsx
import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";

function PageTransition({ children }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const isInitialMount = useRef(true);
  const [displayChildren, setDisplayChildren] = useState(children);

  const location = useLocation();

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setDisplayChildren(children);
      return;
    }

    const overlay = overlayRef.current;
    const content = contentRef.current;

    const tl = gsap.timeline();

    // Phase 1: Overlay slides in from right (covering content)
    tl.fromTo(
      overlay,
      { x: "100%" },
      {
        x: "0%",
        duration: 0.6,
        ease: "power2.inOut",
      },
    )
      // Swap content when fully covered (at the peak)
      .call(() => {
        setDisplayChildren(children);
      })
      // Phase 2: Fade in new content
      .fromTo(content, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      // Phase 3: Overlay slides out to left
      .to(
        overlay,
        {
          x: "-100%",
          duration: 0.6,
          ease: "power2.inOut",
        },
        "-=0.1",
      );

    return () => tl.kill();
  }, [location.pathname]);

  return (
    <>
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          zIndex: 1000,
          transform: "translateX(100%)",
          pointerEvents: "none",
        }}
      />

      <div ref={contentRef} style={{ display: "contents" }}>
        {displayChildren}
      </div>
    </>
  );
}

export default PageTransition;
