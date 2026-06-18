// src/components/NavBar.jsx
import React from "react";
import NavItem from "./NavItem";
import { track } from "@vercel/analytics";

const openInbound = async (e, url, platform) => {
  e.preventDefault(); // Stop immediate navigation

  try {
    // Tracks exactly which platform was clicked dynamically!
    await track("Outbound Link Clicked", { platform: platform });
  } catch (error) {
    console.error("Analytics failed", error);
  } finally {
    // Opens the specific URL passed to the function
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

const currentHash = window.location.hash;

function NavBar({ items }) {
  return (
    <div className="outer nav-container">
      <div className="inner nav-container">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={`
              text-white uppercase w-full jb-mono text-center
              text-sm sm:text-base md:text-lg lg:text-xl
              ${index > 0 ? "border-l-4 border-white" : ""}
            `}
          >
            <NavItem
              onClick={(e) => openInbound(e, item.label, item.label)}
              label={item.label}
              href={item.label}
              isActive={currentHash}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default NavBar;
