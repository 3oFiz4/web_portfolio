import React, { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const defaultExperience = {
  company: "Vercel",
  role: "Freelance Front-End Developer",
  period: "2020 — Present",
  description:
    "I do this to get ez money. Architecting the next generation of web development tools. Leading performance optimizations for Next.js rendering pipelines and improving developer experience metrics.",
  tags: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
};

const ExperienceCard = ({
  experience,
  company,
  role,
  period,
  description,
  tags,
  link,
  className = "",
}) => {
  const cardRef = useRef(null);
  const rippleLayerRef = useRef(null);
  const idleTimeoutRef = useRef(null);
  const activeRipplesRef = useRef(0);

  const card = useMemo(
    () => ({
      ...defaultExperience,
      ...(experience || {}),
      ...(company !== undefined ? { company } : {}),
      ...(role !== undefined ? { role } : {}),
      ...(period !== undefined ? { period } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(tags !== undefined ? { tags } : {}),
      ...(link !== undefined ? { link } : {}),
    }),
    [experience, company, role, period, description, tags, link],
  );

  const { contextSafe } = useGSAP({ scope: cardRef });

  useGSAP(
    () => {
      const cardEl = cardRef.current;
      const layerEl = rippleLayerRef.current;
      if (!cardEl || !layerEl) return;

      const MAX_ACTIVE_RIPPLES = 5; // have to limit incase user is spam click
      const IDLE_DELAY = 5000;
      const SAFE_PADDING = 1;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const getMaxRadius = (x, y, width, height) =>
        Math.max(
          Math.hypot(x, y),
          Math.hypot(width - x, y),
          Math.hypot(x, height - y),
          Math.hypot(width - x, height - y),
        );

      const createRipple = (x, y) => {
        if (activeRipplesRef.current >= MAX_ACTIVE_RIPPLES) return;

        activeRipplesRef.current += 1;

        const { width, height } = cardEl.getBoundingClientRect();
        const radius = getMaxRadius(x, y, width, height);
        const size = radius * 2;

        const core = document.createElement("span");
        const ring = document.createElement("span");

        Object.assign(core.style, {
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          width: "10px",
          height: "10px",
          borderRadius: "9999px",
          background: "rgba(255,255,255,0.95)",
          opacity: "0",
          pointerEvents: "none",
          transform: "translate(-50%, -50%) scale(0)",
          willChange: "transform, opacity",
        });

        Object.assign(ring.style, {
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "9999px",
          border: "1px solid rgba(255,255,255,0.9)",
          background: "transparent",
          opacity: "0.9",
          pointerEvents: "none",
          transform: "translate(-50%, -50%) scale(0.08)",
          willChange: "transform, opacity",
        });

        layerEl.appendChild(ring);
        layerEl.appendChild(core);

        gsap
          .timeline({
            defaults: { force3D: true },
            onComplete: () => {
              core.remove();
              ring.remove();
              activeRipplesRef.current = Math.max(
                0,
                activeRipplesRef.current - 1,
              );
            },
          })
          .to(
            core,
            {
              scale: 1,
              opacity: 0.95,
              duration: 0.14,
              ease: "power2.out",
            },
            0,
          )
          .to(
            core,
            {
              scale: 0.35,
              opacity: 0,
              duration: 2.45,
              ease: "power1.out",
            },
            0.12,
          )
          .to(
            ring,
            {
              scale: 1,
              opacity: 0,
              duration: prefersReducedMotion ? 5.85 : 1.35,
              ease: "power3.out",
            },
            0,
          );
      };

      const spawnRandomRipple = contextSafe(() => {
        const rect = cardEl.getBoundingClientRect();

        const x =
          rect.width > SAFE_PADDING * 2
            ? gsap.utils.random(SAFE_PADDING, rect.width - SAFE_PADDING)
            : rect.width / 2;

        const y =
          rect.height > SAFE_PADDING * 2
            ? gsap.utils.random(SAFE_PADDING, rect.height - SAFE_PADDING)
            : rect.height / 2;

        createRipple(x, y);
      });

      const scheduleIdleRipple = () => {
        window.clearTimeout(idleTimeoutRef.current);

        idleTimeoutRef.current = window.setTimeout(() => {
          spawnRandomRipple();
          scheduleIdleRipple();
        }, IDLE_DELAY);
      };

      const handleClick = contextSafe((event) => {
        const rect = cardEl.getBoundingClientRect();
        const isKeyboardClick = event.clientX === 0 && event.clientY === 0;

        const x = isKeyboardClick
          ? rect.width / 2
          : gsap.utils.clamp(0, rect.width, event.clientX - rect.left);

        const y = isKeyboardClick
          ? rect.height / 2
          : gsap.utils.clamp(0, rect.height, event.clientY - rect.top);

        createRipple(x, y);
        scheduleIdleRipple();
      });

      cardEl.addEventListener("click", handleClick);
      scheduleIdleRipple();

      return () => {
        window.clearTimeout(idleTimeoutRef.current);
        cardEl.removeEventListener("click", handleClick);
        layerEl.innerHTML = "";
        activeRipplesRef.current = 0;
      };
    },
    { scope: cardRef },
  );

  const CardTag = card.link ? "a" : "div";

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardTag
        ref={cardRef}
        {...(card.link
          ? {
              href: card.link,
              target: "_blank",
              rel: "noopener noreferrer",
            }
          : {})}
        className="group relative block h-auto w-full overflow-hidden border border-neutral-800 bg-black p-4 transition-all duration-300 hover:border-neutral-700 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]"
      >
        {/* Hover light */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-neutral-800/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Ripple layer */}
        <div
          ref={rippleLayerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        />

        {/* Card content */}
        <div className="relative z-10 flex h-full flex-col">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="tracking-tight text-lg font-medium text-neutral-100">
                  {card.role}
                </h3>
                <p className="mt-0.5 text-sm text-neutral-400">
                  {card.company}
                </p>
              </div>

              <span className="pt-1 font-mono text-xs text-neutral-500">
                {card.period}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-neutral-400 transition-colors duration-300 line-clamp-3 group-hover:text-neutral-300">
              {card.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            {(card.tags || []).map((tag, index) => (
              <span
                key={index}
                className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-0.5 font-mono text-xs text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </CardTag>
    </div>
  );
};

export default ExperienceCard;
