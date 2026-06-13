// src/components/TechStack.jsx
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import gsap from "gsap";
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
import { RiTailwindCssFill } from "react-icons/ri"; // special kid :sob:
import {
  SiExpress,
  SiScikitlearn,
  SiTensorflow,
  SiPytorch,
  SiSelenium,
  SiActix,
  SiSvelte,
} from "react-icons/si"; // special kid too
import { TbBrandAdobeIllustrator } from "react-icons/tb"; // even special kid
import { MdEmail } from "react-icons/md";

// Exporting Icon helper so users can easily use <Icon>Hi</Icon> or custom icons
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

// const DEFAULT_ICONS = [
//   { name: "", icon: FaHtml5, color: "text-orange-500" },
//   { name: "", icon: FaCss3Alt, color: "text-blue-300" },
//   { name: "", icon: FaJs, color: "text-yellow-300" },
//   { name: "", icon: FaReact, color: "text-cyan-300" },
//   { name: "", icon: SiSvelte, color: "text-orange-500" },
//   { name: "", icon: RiTailwindCssFill, color: "text-sky-300" },
//   { name: "", icon: FaNpm, color: "text-red-300" },
//   { name: "", icon: FaNodeJs, color: "text-emerald-300" },
//   { name: "", icon: SiExpress, color: "text-emerald-300" },
//   { name: "", icon: FaPython, color: "text-blue-300" },
//   { name: "", icon: SiScikitlearn, color: "text-amber-200" },
//   { name: "", icon: SiPytorch, color: "text-orange-600" },
//   { name: "", icon: SiTensorflow, color: "text-orange-400" },
//   { name: "", icon: FaGitAlt, color: "text-red-300" },
//   { name: "", icon: SiSelenium, color: "text-gray-400" },
//   { name: "", icon: FaFigma, color: "text-orange-500" },
//   { name: "", icon: TbBrandAdobeIllustrator, color: "text-orange-400" },
//   { name: "", icon: FaRust, color: "text-orange-800" },
//   { name: "", icon: SiActix, color: "text-orange-300" },
// ];
//
const DEFAULT_ICONS = [
  { name: "", icon: FaHtml5, color: "text-white/50" },
  { name: "", icon: FaCss3Alt, color: "text-white/50" },
  { name: "", icon: FaJs, color: "text-white/50" },
  { name: "", icon: FaReact, color: "text-white/50" },
  { name: "", icon: SiSvelte, color: "text-white/50" },
  { name: "", icon: RiTailwindCssFill, color: "text-white/50" },
  { name: "", icon: FaNpm, color: "text-white/50" },
  { name: "", icon: FaNodeJs, color: "text-white/50" },
  { name: "", icon: SiExpress, color: "text-white/50" },
  { name: "", icon: FaPython, color: "text-white/50" },
  { name: "", icon: SiScikitlearn, color: "text-white/50" },
  { name: "", icon: SiPytorch, color: "text-white/50" },
  { name: "", icon: SiTensorflow, color: "text-white/50" },
  { name: "", icon: FaGitAlt, color: "text-white/50" },
  { name: "", icon: SiSelenium, color: "text-white/50" },
  { name: "", icon: FaFigma, color: "text-white/50" },
  { name: "", icon: TbBrandAdobeIllustrator, color: "text-white/50" },
  { name: "", icon: FaRust, color: "text-white/50" },
  { name: "", icon: SiActix, color: "text-white/50" },
];

function TechStack({ children, chunk_by, chunkBy, className = "" }) {
  // Parse chunk size supporting both prop naming styles (e.g. chunk_by={2} or chunk_by="2")
  const rawChunkSize = chunk_by !== undefined ? chunk_by : chunkBy;
  const chunkSize = parseInt(rawChunkSize, 10) || 5;

  // Determine items: if children provided, use them. Otherwise use DEFAULT_ICONS.
  const items = useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    if (childrenArray.length > 0) {
      return childrenArray;
    }
    // Return default mapped icons
    return DEFAULT_ICONS.map((item) => (
      <Icon
        key={item.name}
        className="sm:gap-3.2 gap-1 text-xs md:text-base sm:px-6 px-[clamp(0.3rem,1vw,1rem)] py-1"
      >
        <item.icon className={`text-[clamp(1rem,3vw,1.8rem)] ${item.color}`} />
      </Icon>
    ));
  }, [children]);

  // Group items into chunks
  const chunks = useMemo(() => {
    const result = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      result.push(items.slice(i, i + chunkSize));
    }
    return result;
  }, [items, chunkSize]);

  const totalChunks = chunks.length;

  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const trackRef = useRef(null);
  const chunkRefs = useRef([]);
  chunkRefs.current = [];

  const addToChunkRefs = (el) => {
    if (el && !chunkRefs.current.includes(el)) {
      chunkRefs.current.push(el);
    }
  };

  // Ensure currentChunkIndex stays valid if items/chunks change
  useEffect(() => {
    if (currentChunkIndex >= totalChunks && totalChunks > 0) {
      setCurrentChunkIndex(0);
    }
  }, [totalChunks, currentChunkIndex]);

  // GSAP transition for track movement
  useEffect(() => {
    if (!trackRef.current || totalChunks === 0) return;

    // Animate the main carousel track sliding
    gsap.to(trackRef.current, {
      xPercent: -100 * currentChunkIndex,
      duration: 0.6,
      ease: "power3.inOut",
    });

    // Animate subtle pop-in effect for elements inside the currently active chunk
    if (chunkRefs.current[currentChunkIndex]) {
      const childrenElements = chunkRefs.current[currentChunkIndex].children;
      if (childrenElements && childrenElements.length > 0) {
        gsap.fromTo(
          childrenElements,
          { scale: 0.85, opacity: 0.6 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: "back.out(1.5)",
            stagger: 0.05,
          },
        );
      }
    }
  }, [currentChunkIndex, totalChunks]);

  const handleNext = useCallback(() => {
    if (totalChunks <= 1) return;
    setCurrentChunkIndex((prev) => (prev + 1) % totalChunks);
  }, [totalChunks]);

  const handlePrev = useCallback(() => {
    if (totalChunks <= 1) return;
    setCurrentChunkIndex((prev) => (prev - 1 + totalChunks) % totalChunks);
  }, [totalChunks]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (totalChunks <= 1) return;

    // Reset timer whenever currentChunkIndex changes (manual or automatic)
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [totalChunks, currentChunkIndex, handleNext]);

  return (
    <div
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
                ref={addToChunkRefs}
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
