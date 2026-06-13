// src/components/Biography.jsx
import React from "react";
import Name from "./Name.jsx";
import Role from "./Role.jsx";
import Intro from "./Intro.jsx";

function Biography() {
  const list = ["Developer", "Analyst", "Designer"];
  return (
    <>
      <div className="bio-header w-full">
        <div className="name w-full h-full pl-3 pt-1 min-w-0">
          <Name name="Jordan&nbsp;(Yor)" age="18" />
          <Role list={list} />
        </div>
      </div>
      <div className="bio-content w-full h-full min-w-0">
        <Intro />
      </div>
    </>
  );
}

export default Biography;
