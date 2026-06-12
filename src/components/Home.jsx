// src/App.jsx
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import ContentGrid from "./section_home/ContentGrid";
import ProfileImage from "./section_home/ProfileImage";
import Biography from "./section_home/Biography";
import Contact from "./section_home/Contact";
import TechStack from "./section_home/TechStack";
import Title from "./section_home/Title";
import Terminal from "./section_home/Terminal";
import Counter from "./section_home/Counter";
// dont add music, its a bit ugly.
import Quote from "./section_home/Quote";

function Home() {
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
    <div className="home">
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
          <TechStack className="" />
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer footer-grid">
        <div className="title-top py-4">
          <Title className="w-full title-top jb-mono border-white border-r-2 border-l-2">
            More About Me
          </Title>
        </div>
        <div className="terminal">
          <Terminal />
        </div>
        <div className="counter px-2">
          <Counter />
        </div>
        <div className="title-bottom py-4">
          <Title className="w-full title-top jb-mono border-white border-r-2 border-l-2">
            Thank you for Reading {"<3!"}
          </Title>
        </div>
        <div className="quote">
          <Quote
            text="Wonder is the beginning of wisdom."
            origin="Socrates"
          />
        </div>
      </div>
    <div/>
  );
}

export default Home;
