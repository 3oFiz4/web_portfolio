// src/components/Contact.jsx
import React from "react";
import ButtonFrame from "./ButtonFrame";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

let goToLink = (link) => {
  if (link) window.open(link, "_blank");
};

function Contact() {
  return (
    <div className="h-10">
      <div className="w-full h-full flex flex-row items-center">
        <ButtonFrame className="w-full h-full flex justify-center items-center gap-2">
          <a
            href="https://github.com/3oFiz4"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="text-3xl hover:scale-110 transition"
          >
            <FaGithub
              className="text-white cursor-pointer"
              onClick={() => window.open("https://github.com/3oFiz4", "_blank")}
            />
          </a>
        </ButtonFrame>
        <ButtonFrame className="w-full h-full flex justify-center items-center gap-2">
          <a
            href="mailto:3ofiz4gr@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Gmail Profile"
            className="text-3xl hover:scale-110 transition"
          >
            <MdEmail className="text-white text-3xl" />
          </a>
        </ButtonFrame>
        <ButtonFrame className="w-full h-full flex justify-center items-center gap-2">
          <a
            href="https://www.linkedin.com/in/infdev-cora-5a4719413/?skipRedirect=true"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Linkedin Profile"
            className="text-3xl hover:scale-110 transition"
          >
            <FaLinkedin
              className="text-white cursor-pointer"
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/in/jordan-cora-5a4719413/",
                  "_blank",
                )
              }
            />
          </a>
        </ButtonFrame>
      </div>
    </div>
  );
}

export default Contact;
