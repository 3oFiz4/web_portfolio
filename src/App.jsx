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
import Title from "./components/Title";
import Terminal from "./components/Terminal";
import Counter from "./components/Counter";
// dont add music, its a bit ugly.
import Quote from "./components/Quote";

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
          {/* <div className="header"> */}
          {/*   <NavBar items={NAV_LINKS} /> */}
          {/* </div> */}

          {/* CONTENT */}
          <div className="content content-grid">
            <div className="profile">
              <div className="profile">
                <ProfileImage src="../src/assets/pfp.jpg" alt="Profile" />
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
                text="The only true wisdom is in knowing you know nothing"
                origin="Socrates"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default App;
