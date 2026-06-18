import React, { useState } from "react";
import ExperienceCard from "./components/ExperienceCard";

const experiences = [
  {
    company: "Bali State Polytechnic",
    role: "Information Management, Comp. Sci",
    period: (
      <p className="block bg-green-950 py-1 px-2 border-green-500 border rounded-lg text-green-500">
        2025 — Now
      </p>
    ),
    description:
      "This is the College where I am taking part of. I am aiming for Information Management, but to be specific, I am aiming for Deep Learning for Quantitative Finance. And soon, I might take Master degree on Finance as well. Wish me luck!",
    tags: ["College", "Information Management"],
    link: "https://www.pnb.ac.id",
  },
  {
    rippleDelay: 2,
    company: "Freelancer",
    role: "Front-End Developer",
    period: "2020 — 2025",
    description:
      "This is a part of my hobby, where I contribute to other websites improving from performance, UI/UX aesthetic and also interactivity. ",
    tags: [
      "JS/TS",
      "Adobe Illustrator",
      "React",
      "Svelte",
      "SvelteKit",
      "Actix",
      "Tokio",
      "TailwindCSS",
      "SCSS",
      "Next.js",
      "GSAP",
    ],
    link: "https://www.freelancer.com",
  },
];

const Experience = () => {
  return (
    <div className="experience-content experience-content-grid">
      <div className="w-full h-full bg-black">
        {experiences.map((experience) => (
          <ExperienceCard
            key={experience.company}
            experience={experience}
            company={experience.company}
            role={experience.role}
            period={experience.period}
            description={experience.description}
            tags={experience.tags}
            link={experience.link}
          />
        ))}
      </div>
    </div>
  );
};

export default Experience;
