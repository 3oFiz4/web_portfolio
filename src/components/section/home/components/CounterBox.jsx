// src/components/CounterBox.jsx
import React, { useRef, useMemo, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function CounterBox({
  title,
  Title,
  value,
  Value,
  is_certain,
  isCertain,
  add_value,
  addValue,
  delay = 0,
  className = "",
  borderClassName = "border-white",
  ...props
}) {
  // Support both prop naming styles (camelCase / snake_case / PascalCase)
  const finalTitle =
    Title !== undefined ? Title : title !== undefined ? title : "Experience";
  const finalValue =
    Value !== undefined ? Value : value !== undefined ? value : "4";
  const finalAddValue =
    add_value !== undefined
      ? add_value
      : addValue !== undefined
        ? addValue
        : "years";

  // Default to false so '+' is shown when no props or false are passed
  const parsedIsCertain =
    is_certain !== undefined
      ? is_certain === "false"
        ? false
        : Boolean(is_certain)
      : isCertain !== undefined
        ? isCertain === "false"
          ? false
          : Boolean(isCertain)
        : false;

  const finalDelay = Number(delay) || 0;

  const containerRef = useRef(null);
  const displayRef = useRef(null);
  const animationStateRef = useRef({
    isVisible: true,
    settledIndex: 0,
    isAnimating: false,
  });

  // Memoize processed target value to prevent recalculation
  const processedValue = useMemo(() => {
    const valStr = String(finalValue);
    const chars = valStr.split("");
    const totalChars = valStr.length;

    return {
      valStr,
      chars,
      totalChars,
      digitIndices: chars
        .map((char, idx) => (/\d/.test(char) ? idx : -1))
        .filter((idx) => idx !== -1),
    };
  }, [finalValue]);

  // Pre-generate random digits pool for better performance
  const randomDigitPool = useMemo(() => {
    return Array.from({ length: 100 }, () => Math.floor(Math.random() * 10));
  }, []);

  // Optimized scramble function using cached random values
  const scrambleDigits = useCallback(
    (settledIndex) => {
      const { chars } = processedValue;
      let randomPoolIndex = Math.floor(Math.random() * 50); // Start from random position

      return chars
        .map((char, idx) => {
          if (idx < settledIndex) return char;
          if (/\d/.test(char)) {
            const randomDigit =
              randomDigitPool[randomPoolIndex % randomDigitPool.length];
            randomPoolIndex++;
            return randomDigit;
          }
          return char;
        })
        .join("");
    },
    [processedValue, randomDigitPool],
  );

  const { contextSafe } = useGSAP(
    () => {
      const display = displayRef.current;
      const container = containerRef.current;
      if (!display || !container) return;

      const state = animationStateRef.current;
      const { valStr, totalChars } = processedValue;

      // Use GSAP quickSetter for optimal DOM performance
      const setText = gsap.quickSetter(display, "textContent");

      // Initialize animation state
      setText(scrambleDigits(0));
      state.settledIndex = 0;
      state.isAnimating = true;

      // Create coordinated timeline
      const tl = gsap.timeline({
        delay: finalDelay,
        paused: !state.isVisible, // Start paused if not visible
        onComplete: () => {
          state.isAnimating = false;
          state.settledIndex = totalChars;
          setText(valStr); // Guarantee final precision
        },
      });

      // Animation progress object
      const animObj = { progress: 0 };
      const duration = 1.0 + totalChars * 0.15;

      tl.to(animObj, {
        progress: 1,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          if (!state.isVisible) return;

          const newSettledIndex = Math.floor(animObj.progress * totalChars);

          // Only update when settled index actually changes
          if (newSettledIndex !== state.settledIndex) {
            state.settledIndex = newSettledIndex;
          }
        },
      });

      // Use GSAP ticker instead of setInterval for better performance
      let tickerFrameCount = 0;
      const scrambleTicker = () => {
        if (!state.isAnimating || !state.isVisible) return;

        // Throttle to every 3rd frame for ~20fps scrambling (smoother than 50ms interval)
        tickerFrameCount++;
        if (tickerFrameCount % 3 !== 0) return;

        if (state.settledIndex < totalChars) {
          setText(scrambleDigits(state.settledIndex));
        }
      };

      gsap.ticker.add(scrambleTicker);

      // Intersection Observer for performance optimization
      const io = new IntersectionObserver(
        (entries) => {
          const isVisible = entries[0].isIntersecting;
          if (state.isVisible !== isVisible) {
            state.isVisible = isVisible;

            // Control timeline playback based on visibility
            if (isVisible) {
              tl.play();
            } else {
              tl.pause();
            }
          }
        },
        { threshold: 0, rootMargin: "100px" },
      );

      io.observe(container);

      return () => {
        io.disconnect();
        gsap.ticker.remove(scrambleTicker);
        tl.kill();
      };
    },
    {
      scope: containerRef,
      dependencies: [finalValue, finalDelay],
    },
  );

  return (
    <div
      ref={containerRef}
      className={`relative border-l-[4px] pl-2 w-full h-auto py-1 ${borderClassName} text-white transition-all ${className}`}
      {...props}
    >
      {/* Title */}
      <h2 className="jb-mono text-[clamp(0.5rem,2vw,0.75rem)] font-medium tracking-wider uppercase">
        {finalTitle}
      </h2>

      {/* Number and signs */}
      <div className="jb-mono flex items-baseline mt-0.5 relative flex-wrap">
        <span
          ref={displayRef}
          className="jb-mono font-bold text-[clamp(.9rem,3vw,1.75rem)] leading-none tracking-tight text-white"
        >
          {processedValue.valStr}
        </span>
        {!parsedIsCertain && (
          <span className="text-[clamp(.8rem,3vw,1.75rem)] font-light ml-0.5 self-start -mt-0.5 leading-none select-none">
            +
          </span>
        )}
      </div>

      {/* Add Value (if empty "" then none rendered) */}
      {finalAddValue !== "" && (
        <div className="absolute right-1 bottom-1 text-[clamp(0.4rem,1.5vw,0.7rem)] font-light tracking-wider uppercase select-none opacity-80">
          {finalAddValue}
        </div>
      )}
    </div>
  );
}

export default CounterBox;
