// src/components/ProjectPage.jsx
import React from "react";
import ContentGrid from "./section_home/ContentGrid";
import Title from "./section_home/Title";
import Quote from "./section_home/Quote";

function ProjectPage() {
  return (
    <>
      {/* CONTENT */}
      <div className="content content-grid">
        <div className="profile">
          <h1 className="text-4xl font-bold text-white">My Projects</h1>
          {/* Add your project content here */}
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer footer-grid">
        <div className="title-top py-4">
          <Title className="w-full title-top jb-mono border-white border-r-2 border-l-2">
            Featured Work
          </Title>
        </div>
        <div className="quote">
          <Quote
            text="Code is like humor. When you have to explain it, it's bad."
            origin="Cory House"
          />
        </div>
      </div>
    </>
  );
}

export default ProjectPage;
