// src/components/Contact.jsx
import React from "react";
import ButtonFrame from "./ButtonFrame";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

// complete - mobie responsive
function Contact() {
  const resize_equation = "clamp(20px, 6vw, 30px)";
  return (
    <div className="h-10">
      <div className="w-full h-full flex flex-row items-center">
        <ButtonFrame
          className="w-full h-full"
          onClick={() => window.open("https://github.com/3oFiz4", "_blank")}
        >
          <a
            href="https://github.com/3oFiz4"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
          >
            <FaGithub
              className="text-white"
              onClick={() => window.open("https://github.com/3oFiz4", "_blank")}
              style={{
                fontSize: resize_equation,
              }}
            />
          </a>
        </ButtonFrame>
        <ButtonFrame className="w-full h-full">
          <a
            href="mailto:3ofiz4gr@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Gmail Profile"
            className="text-3xl hover:scale-110 transition"
          >
            <MdEmail
              className="text-white"
              style={{
                fontSize: resize_equation,
              }}
            />
          </a>
        </ButtonFrame>
        <ButtonFrame
          className="w-full h-full"
          onClick={() =>
            window.open(
              "https://www.linkedin.com/in/jordan-cora-5a4719413/",
              "_blank",
            )
          }
        >
          <a
            href="https://www.linkedin.com/in/jordan-cora-5a4719413/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Linkedin Profile"
            className="text-3xl hover:scale-110 transition"
          >
            <FaLinkedin
              className="text-white"
              style={{
                fontSize: resize_equation,
              }}
            />
          </a>
        </ButtonFrame>
      </div>
    </div>
  );
}

export default Contact;
