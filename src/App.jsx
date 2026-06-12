// src/App.jsx
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Card from "./components/Card";
import NavBar from "./components/NavBar";
import ContentGrid from "./components/ContentGrid";
import ProfileImage from "./components/ProfileImage";
import Biography from "./components/Biography";
import Contact from "./components/Contact";
import TechStack from "./components/TechStack";

const NAV_LINKS = [
  { label: "project", href: "#project" },
  { label: "about", href: "#about" },
  { label: "contact", href: "#contact" },
];

function App() {
  const cardRef = useRef(null);

  useEffect(() => {
    // Card entrance animation
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="center w-screen h-screen bg-black">
      <Card ref={cardRef}>
        <div className="main-grid">
          {/* HEADER */}
          <div className="header">
            <NavBar items={NAV_LINKS} />
          </div>

          {/* CONTENT */}
          <div className="content content-grid">
            <div className="profile">
              <div className="profile">
                <ProfileImage
                  src="https://i.pinimg.com/1200x/1d/b7/ba/1db7ba7225c3adbfe389b027fd8b7e7d.jpg"
                  alt="Profile"
                />
                <Contact />
              </div>
            </div>
            <div className="biography">
              <Biography />
            </div>
            <div className="tech_stack">
              <TechStack className="mt-1 border border-white/5" />
            </div>
          </div>

          {/* FOOTER */}
          <div className="footer"></div>
        </div>
      </Card>
    </div>
  );
}

export default App;
