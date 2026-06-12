// src/components/Name.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

function Name({ name, age }) {
  const nameRef = useRef(null);
  const ageRef = useRef(null);

  useEffect(() => {
    // Character pools
    const nameChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:',.<>?/~`";
    const ageChars = "0123456789";

    const duration = 2; // Total duration in seconds
    const frameRate = 30; // Scramble updates per second

    // Scramble animation function
    const scrambleText = (element, text, charPool) => {
      if (!element || !text) return [];

      const textChars = text.toString().split("");
      const charCount = textChars.length;

      // Clear and create span elements
      element.innerHTML = "";

      const spanElements = textChars.map((char) => {
        const span = document.createElement("span");
        span.textContent =
          charPool[Math.floor(Math.random() * charPool.length)];
        span.style.display = "inline-block";
        element.appendChild(span);
        return span;
      });

      const intervals = [];

      // Animate each character
      spanElements.forEach((span, index) => {
        // Staggered lock-in time
        const lockInTime = (duration * (index + 1)) / charCount;

        // Scramble interval
        const scrambleInterval = setInterval(() => {
          span.textContent =
            charPool[Math.floor(Math.random() * charPool.length)];
        }, 1000 / frameRate);

        intervals.push(scrambleInterval);

        // Lock in the correct character
        gsap.delayedCall(lockInTime, () => {
          clearInterval(scrambleInterval);
          span.textContent = textChars[index];

          // Pop animation on lock-in
          gsap.fromTo(
            span,
            { scale: 1.6, color: "#00ff88" },
            {
              scale: 1,
              color: "inherit",
              duration: 0.3,
              ease: "back.out(2)",
            }
          );
        });
      });

      return { spanElements, intervals };
    };

    // Apply scramble to name and age
    const nameAnimation = scrambleText(nameRef.current, name, nameChars);
    const ageAnimation = scrambleText(ageRef.current, age, ageChars);

    // Cleanup on unmount
    return () => {
      // Clear all intervals
      [
        ...(nameAnimation.intervals || []),
        ...(ageAnimation.intervals || []),
      ].forEach((interval) => clearInterval(interval));

      // Kill GSAP tweens
      [
        ...(nameAnimation.spanElements || []),
        ...(ageAnimation.spanElements || []),
      ].forEach((span) => gsap.killTweensOf(span));
    };
  }, [name, age]);

  return (
    <div className="name-container">
      <h1
        className="text-white w-full jb-mono
              text-sm sm:text-base md:text-lg lg:text-xl"
      >
        <span ref={nameRef} className="scramble-text"></span>
        {age && (
          <>
            <span className="separator"> </span>[
            <span ref={ageRef} className="scramble-text"></span>]
          </>
        )}
      </h1>
    </div>
  );
}

export default Name;
