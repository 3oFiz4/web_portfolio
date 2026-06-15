// src/App.jsx
import React, { useRef, useEffect } from "react";
import Home from "./components/section/home/Home";
import Card from "./components/main_components/Card";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const NAV_LINKS = [
  { label: "project", href: "#project" },
  { label: "about", href: "#about" },
  { label: "contact", href: "#contact" },
];

function App() {
  const cardRef = useRef(null);

  useGSAP(() => {
    // Card entrance animation
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        yPercent: 5,
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="center w-screen h-screen bg-black">
      <Card ref={cardRef}>
        <div className="main-grid w-full h-[100dvh] max-h-[100dvh] overflow-y-auto px-4 pb-12 box-border">
          {/* HEADER */}
          {/* <div className="header"> */}
          {/*   <NavBar items={NAV_LINKS} /> */}
          {/* </div> */}
          <Home />
        </div>
      </Card>
      <div></div>
    </div>
  );
}

export default App;
