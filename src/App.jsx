// src/App.jsx
import React, { useRef, useEffect, useState } from "react";
import Home from "./components/section/home/Home";
import Card from "./components/main_components/Card";
import NavBar from "./components/main_components/NavBar";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Contact component
const Contact = () => (
  <div className="p-8">
    <p className="text-white text-2xl">Hello World from Contact!</p>
  </div>
);

// Map the hash to the actual component
const COMPONENT_MAP = {
  "#home": Home,
  "#contact": Contact,
};

const NAV_LINKS = [
  { label: "home", href: "#home" },
  { label: "contact", href: "#contact" },
];

function App() {
  const cardRef = useRef(null);
  const overlayRef = useRef(null);

  // Track our hashes
  const currentHashRef = useRef(window.location.hash || "#home");
  const [displayHash, setDisplayHash] = useState(currentHashRef.current);
  const isAnimating = useRef(false);

  // useGSAP handles context cleanup automatically
  const { contextSafe } = useGSAP(() => {
    // 0. Set overlay initially off-screen to the right
    gsap.set(overlayRef.current, { xPercent: 100 });

    // Card entrance animation
    gsap.from(cardRef.current, {
      yPercent: 5,
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
    });
  }, []);

  // contextSafe allows us to trigger GSAP animations inside event listeners safely
  const handleTransition = contextSafe((newHash) => {
    // Prevent animation spam or animating to the same page
    if (isAnimating.current || newHash === currentHashRef.current) return;

    isAnimating.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        // 3. Clear animation: Reset position hidden on the right
        gsap.set(overlayRef.current, { xPercent: 100 });
      },
    });

    // 1. First! Slide in from the right to cover the page grid
    tl.to(overlayRef.current, {
      xPercent: 0,
      duration: 0.5,
      ease: "power3.inOut",
      onComplete: () => {
        // 2. Second! Instantly change component when overlay covers the screen entirely
        currentHashRef.current = newHash;
        setDisplayHash(newHash);
      },
    })
      // 3. Third! Slide out to the left end
      .to(overlayRef.current, {
        xPercent: -100,
        duration: 0.5,
        ease: "power3.inOut",
      });
  });

  useEffect(() => {
    const onHashChange = () => {
      const newHash = window.location.hash || "#home";
      // Trigger transition only if it's a valid mapped component
      if (COMPONENT_MAP[newHash]) {
        handleTransition(newHash);
      }
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Determine what to render based on State (default to Home if invalid)
  const CurrentPage = COMPONENT_MAP[displayHash] || Home;

  return (
    <div className="center w-screen h-screen bg-black">
      <Card ref={cardRef}>
        <div className="main-grid w-full h-[100dvh] max-h-[100dvh] overflow-y-auto px-4 pb-12 box-border flex flex-col">
          {/* HEADER */}
          <div className="header flex-none">
            <NavBar items={NAV_LINKS} />
          </div>
          {/* Added overflow-hidden to prevent the overlay sliding out of bounds */}
          <div className="page-grid relative flex-grow overflow-hidden">
            <CurrentPage />

            <div
              ref={overlayRef}
              className="
                main-slide-overlay
                z-10
                absolute inset-0
                bg-white
              "
            />
          </div>
        </div>
      </Card>
      <div></div>
    </div>
  );
}

export default App;
