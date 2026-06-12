// src/components/components/NavBar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import NavItem from "./NavItem";

function NavBar({ items }) {
  const location = useLocation();

  return (
    <div className="outer nav-container">
      <div className="inner nav-container">
        {/* Home Link */}
        <div
          className={`
            text-white uppercase w-full jb-mono text-center
            text-sm sm:text-base md:text-lg lg:text-xl
          `}
        >
          <Link to="/">
            <NavItem
              label="home"
              href="/"
              isActive={location.pathname === "/"}
            />
          </Link>
        </div>

        {/* Other Nav Items */}
        {items.map((item) => (
          <div
            key={item.label}
            className={`
              text-white uppercase w-full jb-mono text-center
              text-sm sm:text-base md:text-lg lg:text-xl
              border-l-4 border-white
            `}
          >
            <Link to={item.href}>
              <NavItem
                label={item.label}
                href={item.href}
                isActive={location.pathname === item.href}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NavBar;
