// src/components/Counter.jsx
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import CounterBox from "./CounterBox";

async function getGithubRepos(username) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`);

    if (!res.ok) throw new Error("GitHub API failed");

    const user = await res.json();

    return user.public_repos;
  } catch (err) {
    console.warn("Failed to fetch repos:", err);
    return 12; // fallback
  }
}

async function getTotalStars(username) {
  try {
    let page = 1;
    let totalStars = 0;

    while (true) {
      const res = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&page=${page}`,
      );

      if (!res.ok) throw new Error("GitHub API failed");

      const repos = await res.json();

      if (repos.length === 0) break;

      totalStars += repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

      page++;
    }

    return totalStars;
  } catch (err) {
    console.warn("Failed to fetch stars:", err);
    return 25; // fallback
  }
}

const name = "3oFiz4";
const project_total = await getGithubRepos(name);
const stars = await getTotalStars(name);

function Counter({ children, className = "" }) {
  return (
    <div
      className={`flex gap-1 md:gap-1 flex-row h-full items-center justify-center w-full mx-auto ${className}`}
    >
      {children ? (
        children
      ) : (
        <>
          <CounterBox
            Title="Exp."
            Value="4"
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
