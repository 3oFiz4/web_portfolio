// src/App.jsx
import React, { useRef, useEffect, useState } from "react";
import Home from "./components/section/home/Home";
import Certif from "./components/section/certif/Certif";
import Experience from "./components/section/experience/Experience";
import Card from "./components/main_components/Card";
import NavBar from "./components/main_components/NavBar";
import { Analytics, track } from "@vercel/analytics/react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// map first
const COMPONENT_MAP = {
  "#home": Home,
  "#certificate": Certif,
  "#experience": Experience,
};
// then links
const NAV_LINKS = [
  { label: "home", href: "#home" },
  { label: "certificate", href: "#certificate" },
  { label: "experience", href: "#experience" },
];

function App() {
  const cardRef = useRef(null);
  const overlayRef = useRef(null);

  // track the hashes
  const currentHashRef = useRef(window.location.hash || "#home");
  const [displayHash, setDisplayHash] = useState(currentHashRef.current);
  const isAnimating = useRef(false);

  // uses `useGSAP` handles context cleanup automatically
  const { contextSafe } = useGSAP(() => {
    // 0. set overlay initially off-screen to the right
    gsap.set(overlayRef.current, { xPercent: 100 });

    // card entrance animation
    gsap.from(cardRef.current, {
      yPercent: 5,
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
    });
  }, []);

  // contextSafe here allows trigger GSAP animations inside event listeners safely
  const handleTransition = contextSafe((newHash) => {
    // avoid click animation spam or animating to the same page
    if (isAnimating.current || newHash === currentHashRef.current) return;

    isAnimating.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        // 3. clear animation: Reset position hidden on the right
        gsap.set(overlayRef.current, { xPercent: 100 });
      },
    });

    // 1. first, slide in from the right to cover the page grid
    tl.to(overlayRef.current, {
      xPercent: 0,
      duration: 0.4,
      ease: "power3.inOut",
      onComplete: () => {
        // 2. then, change component when overlay covers the screen entirely
        currentHashRef.current = newHash;
        setDisplayHash(newHash);
      },
    })
      // 3. finally, slide out to the left end
      .to(overlayRef.current, {
        xPercent: -100,
        duration: 0.5,
        ease: "power3.inOut",
      });
  });

  // EVENT DELEGATION
  useEffect(() => {
    const onHashChange = () => {
      const newHash = window.location.hash || "#home";
      if (COMPONENT_MAP[newHash]) {
        track("Page Viewed", { page: newHash });
        handleTransition(newHash);
      }
    };

    // --- 2. Global Outbound & Download Click Tracker ---
    const handleGlobalClick = (e) => {
      // Find the closest anchor tag from what was actually clicked (handles SVGs/nested text)
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Check if it's a download link or an external link
      const isDownload =
        anchor.hasAttribute("download") ||
        href.match(/\.(pdf|zip|docx|png|jpg|mp4)$/i);
      const isExternal =
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:");

      if (isDownload) {
        track("File Downloaded", {
          url: href,
          fileName: anchor.getAttribute("download") || href.split("/").pop(),
        });
      } else if (isExternal) {
        track("Outbound Link Clicked", {
          url: href,
          text:
            anchor.innerText ||
            anchor.getAttribute("aria-label") ||
            "Unknown Link",
        });
      }
    };

    // Event Listeners
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", handleGlobalClick);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  // Determine what to render based on State (default to Home if invalid)
  const CurrentPage = COMPONENT_MAP[displayHash] || Home;

  return (
    <div className="center w-screen h-screen bg-black">
      <Card ref={cardRef}>
        <div className="main-grid w-full h-[100dvh] max-h-[100dvh] overflow-y-auto px-4 pb-12 box-border flex flex-col">
          {/* HEADER */}
          <div className="header flex-none">
            <NavBar items={NAV_LINKS} isAnimating={isAnimating} />
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
      <Analytics />
      <div></div>
    </div>
  );
}

export default App;
