// src/components/Counter.jsx
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import CounterBox from "./CounterBox";

async function getGithubRepos(username) {
  const res = await fetch(`https://api.github.com/users/${username}`);
  const user = await res.json();

  return user.public_repos;
}

async function getTotalStars(username) {
  let page = 1;
  let totalStars = 0;

  while (true) {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&page=${page}`,
    );

    const repos = await res.json();

    if (repos.length === 0) break;

    totalStars += repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    page++;
  }

  return totalStars;
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
