// src/components/Contact.jsx
import React from "react";
import ButtonFrame from "./ButtonFrame";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { track } from "@vercel/analytics";

const openInbound = async (e, url, platform) => {
  e.preventDefault(); // Stop immediate navigation

  try {
    // Tracks exactly which platform was clicked dynamically!
    await track("Outbound Link Clicked", { platform: platform });
  } catch (error) {
    console.error("Analytics failed", error);
  } finally {
    // Opens the specific URL passed to the function
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

// complete - mobie responsive
function Contact() {
  const resize_equation = "clamp(20px, 6vw, 30px)";
  return (
    <div className="h-10">
      <div className="w-full h-full flex flex-row items-center">
        <ButtonFrame
          className="w-full h-full"
          onClick={(e) => openInbound(e, "https://github.com/3oFiz4", "GitHub")}
        >
          <a
            onClick={(e) =>
              openInbound(e, "https://github.com/3oFiz4", "GitHub")
            }
            href="https://github.com/3oFiz4"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
          >
            <FaGithub
              className="text-white"
              onClick={(e) =>
                openInbound(e, "https://github.com/3oFiz4", "GitHub")
              }
              style={{
                fontSize: resize_equation,
              }}
            />
          </a>
        </ButtonFrame>
        <ButtonFrame className="w-full h-full">
          {/*no track this*/}
          <a
            onClick={(e) =>
              openInbound(e, "mailto:3ofiz4gr@gmail.com", "Gmail")
            }
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
          onClick={(e) =>
            openInbound(
              e,
              "https://www.linkedin.com/in/jordan-cora-5a4719413/",
              "Linkedin",
            )
          }
        >
          <a
            onClick={(e) =>
              openInbound(
                e,
                "https://www.linkedin.com/in/jordan-cora-5a4719413/",
                "Linkedin",
              )
            }
            href="https://www.linkedin.com/in/jordan-cora-5a4719413/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Linkedin Profile"
            className="text-3xl hover:scale-110 transition"
          >
            <FaLinkedin
              className="text-white"
              onClick={(e) =>
                openInbound(
                  e,
                  "https://www.linkedin.com/in/jordan-cora-5a4719413/",
                  "Linkedin",
                )
              }
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
