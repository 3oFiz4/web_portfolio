// src/App.jsx
import React, { useRef, useState, useEffect } from "react";
import Card from "./components/main_components/Card";
import NavBar from "./components/main_components/NavBar";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Swap these out for your real component imports later!
import Home from "./components/section/home/Home"; // Your exact Home component
const Contact = () => (
  <div className="content p-8 text-white text-2xl">Contact Page</div>
);
const Project = () => (
  <div className="content p-8 text-white text-2xl">Projects Page</div>
);
const About = () => (
  <div className="content p-8 text-white text-2xl">About Page</div>
);

// Using your clean labels without explicit hashes
const NAV_LINKS = [
  { label: "home", href: "home" },
  { label: "project", href: "project" },
  { label: "about", href: "about" },
  { label: "contact", href: "contact" },
];

function App() {
  const cardRef = useRef(null);
  const overlayRef = useRef(null);

  //#BUG: minor
  // revamp this, idk why but # keeps appearing instead of just '/'
  const getHashName = () => {
    const hash = window.location.hash.replace("#", "");
    return hash || "home";
  };

  const [activeHash, setActiveHash] = useState(getHashName());
  const [displayPage, setDisplayPage] = useState(getHashName());

  // Listen to your existing NavItem hash triggers smoothly
  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(getHashName());
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Card initial entry animation
  useGSAP(() => {
    gsap.from(cardRef.current, {
      yPercent: 5,
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
    });
  }, []);

  // Coordinate the slide transition
  useEffect(() => {
    gsap.set(overlayRef.current, { xPercent: -100 });
    if (activeHash !== displayPage) {
      // Phase A: Slide covers the exact space occupied by the content + footer
      gsap.to(overlayRef.current, {
        onStart: () => {},
        xPercent: 100,
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: () => {
          // Phase B: Swap the view state instantly while completely covered
          setDisplayPage(activeHash);

          // Phase C: Push the slide onward to the right to reveal the new layout
          gsap.to(overlayRef.current, {
            xPercent: 200,
            duration: 0.5,
            ease: "power3.inOut",
            onComplete: () => {
              // Reset positioning invisibly back to the left side
              gsap.set(overlayRef.current, { xPercent: -100 });
            },
          });
        },
      });
    }
  }, [activeHash, displayPage]);

  // Conditional state router mapping
  const renderCurrentPage = () => {
    switch (displayPage) {
      case "home":
        return <Home />;
      case "project":
        return <Project />;
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="center w-full h-screen bg-black overflow-x-hidden ">
      <Card ref={cardRef}>
        {/* Your original main layout grid setup */}
        <div className="main-grid w-full h-[100dvh] max-h-[100dvh] mx-4 pb-12 box-border relative overflow-x-hidden ">
          {/* HEADER (Row 1) */}
          <div className="header">
            <NavBar items={NAV_LINKS} />
          </div>

          {/* THE SLIDING OVERLAY */}
          {/* Sits beautifully inside your CSS grid, scaling perfectly with content + footer heights */}
          {/*BUG: Given mobile viewport, the slider only takes HALF of the card*/}
          <div
            ref={overlayRef}
            className="slider absolute inset-0 bg-white z-50 pointer-events-none"
            style={{
              gridColumn: "1 / 7",
              gridRow: "2 / 12",
              width: "100vw",
              height: "100%",
              transform: "translateX(-100%)",
            }}
          />

          {/* RENDERS PAGES (Direct children to protect the layout row mappings) */}
          {renderCurrentPage()}
        </div>
      </Card>
    </div>
  );
}

export default App;
