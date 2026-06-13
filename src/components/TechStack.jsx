// src/components/TechStack.jsx
import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaPython,
  FaGitAlt,
  FaFigma,
  FaRust,
  FaNpm,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { RiTailwindCssFill } from "react-icons/ri";
import {
  SiExpress,
  SiScikitlearn,
  SiTensorflow,
  SiPytorch,
  SiSelenium,
  SiActix,
  SiSvelte,
} from "react-icons/si";
import { TbBrandAdobeIllustrator } from "react-icons/tb";

export function Icon({
  children,
  icon: IconComponent,
  className = "",
  ...props
}) {
  return (
    <div
      className={`inline-flex items-center justify-center transition-all font-semibold text-white shadow-sm select-none cursor-default ${className}`}
      {...props}
    >
      {IconComponent && <IconComponent className="w-4 h-4 shrink-0" />}
      {children}
    </div>
  );
}

const DEFAULT_ICONS = [
  { name: "html5", icon: FaHtml5, color: "text-white/50" },
  { name: "css3", icon: FaCss3Alt, color: "text-white/50" },
  { name: "js", icon: FaJs, color: "text-white/50" },
  { name: "react", icon: FaReact, color: "text-white/50" },
  { name: "svelte", icon: SiSvelte, color: "text-white/50" },
  { name: "tailwind", icon: RiTailwindCssFill, color: "text-white/50" },
  { name: "npm", icon: FaNpm, color: "text-white/50" },
  { name: "nodejs", icon: FaNodeJs, color: "text-white/50" },
  { name: "express", icon: SiExpress, color: "text-white/50" },
  { name: "python", icon: FaPython, color: "text-white/50" },
  { name: "sklearn", icon: SiScikitlearn, color: "text-white/50" },
  { name: "pytorch", icon: SiPytorch, color: "text-white/50" },
  { name: "tensorflow", icon: SiTensorflow, color: "text-white/50" },
  { name: "git", icon: FaGitAlt, color: "text-white/50" },
  { name: "selenium", icon: SiSelenium, color: "text-white/50" },
  { name: "figma", icon: FaFigma, color: "text-white/50" },
  {
    name: "illustrator",
    icon: TbBrandAdobeIllustrator,
    color: "text-white/50",
  },
  { name: "rust", icon: FaRust, color: "text-white/50" },
  { name: "actix", icon: SiActix, color: "text-white/50" },
];

function TechStack({ children, chunk_by, chunkBy, className = "" }) {
  const rawChunkSize = chunk_by !== undefined ? chunk_by : chunkBy;
  const chunkSize = parseInt(rawChunkSize, 10) || 5;

  const containerRef = useRef(null);
  const trackRef = useRef(null);
  // Store chunk DOM refs in a stable ref-map keyed by index
  const chunkRefsMap = useRef({});
  // Ref to hold the active GSAP pop-in tween so we can kill it before re-running
  const popTweenRef = useRef(null);
  // Ref to hold the auto-advance interval id
  const intervalRef = useRef(null);

  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

  // Stable ref for currentChunkIndex so interval callback never stales
  const currentChunkIndexRef = useRef(currentChunkIndex);
  useEffect(() => {
    currentChunkIndexRef.current = currentChunkIndex;
  }, [currentChunkIndex]);

  const items = useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    if (childrenArray.length > 0) return childrenArray;

    return DEFAULT_ICONS.map((item) => (
      <Icon
        key={item.name}
        className="sm:gap-3.2 gap-1 text-xs md:text-base sm:px-6 px-[clamp(0.3rem,1vw,1rem)] py-1"
      >
        <item.icon className={`text-[clamp(1rem,3vw,1.8rem)] ${item.color}`} />
      </Icon>
    ));
  }, [children]);

  const chunks = useMemo(() => {
    const result = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      result.push(items.slice(i, i + chunkSize));
    }
    return result;
  }, [items, chunkSize]);

  const totalChunks = chunks.length;

  // Stable ref for totalChunks so interval callback never stales
  const totalChunksRef = useRef(totalChunks);
  useEffect(() => {
    totalChunksRef.current = totalChunks;
  }, [totalChunks]);

  // Clamp index when chunks shrink
  useEffect(() => {
    if (currentChunkIndex >= totalChunks && totalChunks > 0) {
      setCurrentChunkIndex(0);
    }
  }, [totalChunks, currentChunkIndex]);

  // Stable chunk ref callback - avoids rebuilding on every render
  const setChunkRef = useCallback((el, idx) => {
    if (el) {
      chunkRefsMap.current[idx] = el;
    } else {
      delete chunkRefsMap.current[idx];
    }
  }, []);

  // GSAP slide + pop-in - runs whenever currentChunkIndex changes
  const { contextSafe } = useGSAP(
    () => {
      if (!trackRef.current || totalChunks === 0) return;

      // Kill any in-progress pop-in to prevent overlapping tweens
      if (popTweenRef.current) {
        popTweenRef.current.kill();
        popTweenRef.current = null;
      }

      // Slide the track
      gsap.to(trackRef.current, {
        xPercent: -100 * currentChunkIndex,
        duration: 0.6,
        ease: "power3.inOut",
        overwrite: "auto",
      });

      // Pop-in children of the active chunk
      const activeChunk = chunkRefsMap.current[currentChunkIndex];
      if (activeChunk?.children?.length) {
        popTweenRef.current = gsap.fromTo(
          Array.from(activeChunk.children),
          { scale: 0.85, opacity: 0.6 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: "back.out(1.5)",
            stagger: 0.05,
            overwrite: "auto",
            onComplete: () => {
              popTweenRef.current = null;
            },
          },
        );
      }
    },
    // Scope to container, re-run when index or chunk count changes
    { scope: containerRef, dependencies: [currentChunkIndex, totalChunks] },
  );

  const handleNext = contextSafe(
    useCallback(() => {
      if (totalChunksRef.current <= 1) return;
      setCurrentChunkIndex((prev) => (prev + 1) % totalChunksRef.current);
    }, []),
  );

  const handlePrev = contextSafe(
    useCallback(() => {
      if (totalChunksRef.current <= 1) return;
      setCurrentChunkIndex(
        (prev) => (prev - 1 + totalChunksRef.current) % totalChunksRef.current,
      );
    }, []),
  );

  // Auto-advance - stable interval that never re-registers on index change
  useEffect(() => {
    if (totalChunks <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentChunkIndex((prev) => (prev + 1) % totalChunksRef.current);
    }, 5000);

    return () => clearInterval(intervalRef.current);
    // Only re-register if totalChunks itself changes, not on every index tick
  }, [totalChunks]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center w-full max-w-4xl mx-auto ${className}`}
    >
      {/* Horizontal bar containing arrows and icon chunks */}
      <div className="w-full h-auto min-h-[1rem] md:min-h-[1.5rem] flex flex-row items-center justify-between text-white">
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          disabled={totalChunks <= 1}
          className="shrink-0 z-10 flex items-center justify-center w-4 h-4 sm:w-11 sm:h-11 active:scale-90 transition-all text-white/5 active:text-white cursor-pointer disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed"
          aria-label="Previous tech stack chunk"
        >
          <FaChevronLeft className="w-3 h-3 sm:w-5 sm:h-5" />
        </button>

        {/* Carousel Viewport */}
        <div className="overflow-hidden w-full flex items-center">
          <div
            ref={trackRef}
            className="flex flex-row items-center w-full will-change-transform"
          >
            {chunks.map((chunk, chunkIdx) => (
              <div
                key={chunkIdx}
                ref={(el) => setChunkRef(el, chunkIdx)}
                className="w-full shrink-0 flex flex-row flex-wrap items-center justify-center gap-1 md:gap-4"
              >
                {chunk.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-center justify-center"
                  >
                    {item}
                  </div>
                ))}
              </div>
            ))}
            {chunks.length === 0 && (
              <div className="w-full flex items-center justify-center text-sm font-medium text-white/80 py-2">
                No icons to display
              </div>
            )}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          disabled={totalChunks <= 1}
          className="shrink-0 z-10 flex items-center justify-center w-4 h-4 sm:w-11 sm:h-11 active:scale-90 transition-all text-white/5 active:text-white cursor-pointer disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed"
          aria-label="Next tech stack chunk"
        >
          <FaChevronRight className="w-3 h-3 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Chunk indicators / Pagination dots */}
      {totalChunks > 1 && (
        <div className="flex justify-center items-center gap-2">
          {chunks.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentChunkIndex(idx)}
              className={`h-[0.2rem] transition-all cursor-pointer ${
                currentChunkIndex === idx ? "w-8 bg-white/10" : "w-2 bg-white/5"
              }`}
              aria-label={`Show chunk ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TechStack;
