import React, { useState } from "react";
import CertifCard from "./components/CertifCard";

// also, do not forget to put it from Year Latest to Year Oldest..
// only put COLLEGE certifs here.. not when high school
const certificates = [
  {
    id: 1,
    title: "Silver Medal - Interview",
    issuer: (
      <h3 className="text-xs">Indonesian Polytechnic English Championship</h3>
    ),
    year: 2026,
    description: (
      <>
        <img
          src={"../../../../certif_asset/ipec.avif"}
          className="object-cover w-64 h-64"
        />
        <br />
        <p className="">
          In this competition, every polytechnic in Indonesia gather on one
          place where we are separated by different segment, to decide who is
          the winner among them all.
        </p>
        <br />
        <p>
          This is one of the competition where my interview skill are highly
          honed to utmost level. I am very thanksful for the opportunity given
          from this competition!
        </p>
        <br />
        <a
          href="https://credsverse.com/credentials/c81a4c1e-12f2-4955-ba56-5c3cc9171b4a"
          className="underline text-cyan-500"
        >
          Evidence
        </a>
      </>
    ),
  },
  {
    id: 2,
    iconColor: "text-yellow-300",
    title: ".NET Framework Software Engineering - Highly Competent",
    issuer: <h3 className="text-xs">Sanata System</h3>,
    year: 2026,
    description: (
      <>
        <br />
        <p className="">
          In 2026, I participated in building and integrating .NET Framework
          based API using Swagger. My project are building a functional and
          working Queue program of a Hospital.
        </p>
        <br />
        <p>
          Previously, I did not know much about Back-End until I participate in
          this program and from that on, I started to learn more about Back-End
          concept and building web application with Actix (Rust). This, is the
          beginning of my Back-End journey.
        </p>
        <br />
        <a
          href="../../../../certif_asset/Jordan_NET_Framework_Certificate.pdf"
          className="underline text-cyan-500"
          download
        >
          Evidence
        </a>
      </>
    ),
  },
  {
    id: 3,
    title: "Cyber Breach and Response, SOC Manager - Participation",
    issuer: <h3 className="text-xs">Sawah Cyber Security</h3>,
    year: 2026,
    description: (
      <>
        <br />
        <p className="">
          In 2026, I have a question of how Cyber Security happens behind the
          process. So I participated in this program to learn more about Cyber
          Security, Common Website Vulnerabilities, How to prevent them, and a
          lot more!
        </p>
        <br />
        <p className="">
          This program is happened by a team of 4 people. Where I am taking the
          role of a SOC Manager, 3 of my friends are SOC Analayst, and the other
          is a supporter. This program taught me a lot about leadership and
          decision-making under pressure. Not only that, but we are also taught
          to avoid common cognitive bias, and to always present our case with a
          strong evidences.
        </p>
        <br />
        <p>
          Before, I only create website by assuming general standard, but after
          participating in this session, I started to realize that the website
          security itself is a complex management system. This program helped me
          a lot on how to think like a cyber security analyst, by assuming
          common flaws, and then finding a way to resolve them.
        </p>
        <br />
        <a
          href="../../../../certif_asset/Jordan_Cyber_Breach_Certificate.pdf.pdf"
          className="underline text-cyan-500"
          download
        >
          Evidence
        </a>
      </>
    ),
  },
];

const Certif = () => {
  const [selectedCertif, setSelectedCertif] = useState(certificates[0]);

  return (
    <div className="certif-content certif-content-grid">
      <div className="w-full">
        <div className="flex flex-col h-full w-full">
          {certificates.map((cert) => (
            <CertifCard
              key={cert.id}
              title={cert.title}
              issuer={cert.issuer}
              year={cert.year}
              iconColor={cert.iconColor}
              isActive={selectedCertif === cert}
              onClick={() => setSelectedCertif(cert)}
            />
          ))}
        </div>
      </div>

      <div className="w-full p-6 jb-mono overflow-y-auto scrollbar-thumb-white/5 scrollbar-track-black">
        <span className="text-md font-semibold text-white">
          {selectedCertif.title}
        </span>
        <span className="text-zinc-500 text-sm">{selectedCertif.issuer}</span>
        <span className="mt-4 text-white text-xs">
          {selectedCertif.description}
        </span>
      </div>
    </div>
  );
};

export default Certif;
