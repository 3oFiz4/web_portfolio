import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

function Terminal({ className = "" }) {
  return (
    <div
      className={`relative border border-white overflow-hidden w-full h-full ${className}`}
    >
      <pre className="jb-mono px-4 h-full text-[10px] font-light text-white overflow-y-scroll">
        v0.0.1
        <br />
        This website is still early, please wait for another feature! ty!
        <br />
        Coming soon:
        <br />
        [ ] Projects
        <br />
        [ ] About <br />
        [ ] ??? <br />
        [ ] Mobile-support
        <br />
      </pre>
    </div>
  );
}

export default Terminal;
