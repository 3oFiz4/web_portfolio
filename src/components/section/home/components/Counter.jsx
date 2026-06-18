// src/components/Counter.jsx
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import CounterBox from "./CounterBox";

import { getGithubStats } from "../components/script/github-stats";
const name = "3oFiz4";

// Get both stats at once (recommended - single cache check)
const stats = await getGithubStats(name);
const project_total = stats.repos;
const stars = stats.stars;

function Counter({ children, className = "" }) {
  return (
    <div
      className={`grid grid-cols-4 gap-[clamp(0.25rem,1.5vw,0.5rem)] w-full items-center ${className}`}
    >
      {children ? (
        children
      ) : (
        <>
          <CounterBox
            Title="Exp."
            Value="6"
            is_certain={false}
            add_value="years"
            delay={0}
          />
          <CounterBox
            Title="Proj."
            Value={project_total}
            is_certain={true}
            delay={0.2}
            add_value=""
          />
          <CounterBox
            Title="Commits"
            Value="200"
            is_certain={false}
            add_value=""
            delay={0.4}
          />
          <CounterBox
            Title="Stars"
            Value={stars}
            is_certain={true}
            add_value=""
            delay={0.6}
          />
        </>
      )}
    </div>
  );
}

export default Counter;
