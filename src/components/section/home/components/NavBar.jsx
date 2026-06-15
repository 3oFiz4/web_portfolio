// src/components/NavBar.jsx
import React from "react";
import NavItem from "./NavItem";

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
