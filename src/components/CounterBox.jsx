// src/components/CounterBox.jsx
import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

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

  const valStr = String(finalValue);
  const totalChars = valStr.length;

  // Initialize state with randomized digits
  const [displayValue, setDisplayValue] = useState(() => {
    return valStr
      .split("")
      .map((char) => (/\d/.test(char) ? Math.floor(Math.random() * 10) : char))
      .join("");
  });

  const settledRef = useRef(0);

  useEffect(() => {
    settledRef.current = 0; // Reset on new target
    const chars = valStr.split("");

    // Fast ticker running every 50ms to rapidly scramble non-settled digits
    const interval = setInterval(() => {
      if (settledRef.current < totalChars) {
        setDisplayValue(() => {
          return chars
            .map((char, idx) => {
              if (idx < settledRef.current) return char;
              return /\d/.test(char) ? Math.floor(Math.random() * 10) : char;
            })
            .join("");
        });
      }
    }, 50);

    const tweenObj = { progress: 0 };
    const duration = 1.0 + totalChars * 0.15; // Smooth proportional duration

    // GSAP tween that gradually locks in digits from start to end after the delay
    const tween = gsap.to(tweenObj, {
      progress: 1,
      duration,
      delay: finalDelay,
      ease: "power2.out",
      onUpdate: () => {
        settledRef.current = Math.floor(tweenObj.progress * totalChars);
      },
      onComplete: () => {
        settledRef.current = totalChars;
        setDisplayValue(valStr); // Guarantee 100% precision
      },
    });

    return () => {
      clearInterval(interval);
      tween.kill();
    };
  }, [valStr, finalDelay, totalChars]);

  return (
    <div
      className={`relative border-l-[4px] pl-2 w-full h-auto py-1 ${borderClassName} text-white transition-all ${className}`}
      {...props}
    >
      {/* Title */}
      <h2 className="jb-mono text-[clamp(0.5rem,2vw,0.75rem)] font-medium tracking-wider uppercase">
        {finalTitle}
      </h2>

      {/* Number and signs */}
      <div className="jb-mono flex items-baseline mt-0.5 relative flex-wrap">
        <span className="jb-mono font-bold text-[clamp(.9rem,3vw,1.75rem)] leading-none tracking-tight text-white">
          {displayValue}
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
