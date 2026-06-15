import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const NAME_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:',.<>?/~`";

const AGE_CHARS = "0123456789";

function randomChar(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

function Name({ name, age }) {
  const nameRef = useRef(null);
  const ageRef = useRef(null);

  useGSAP(
    () => {
      const delayedCalls = [];

      const scrambleText = (element, text, charPool) => {
        if (!element || !text) {
          return {
            spans: [],
            intervals: [],
          };
        }

        const chars = String(text).split("");

        element.innerHTML = "";

        const spans = chars.map(() => {
          const span = document.createElement("span");

          span.style.display = "inline-block";

          span.textContent = randomChar(charPool);

          element.appendChild(span);

          return span;
        });

        const intervals = [];

        spans.forEach((span, index) => {
          const interval = setInterval(() => {
            span.textContent = randomChar(charPool);
          }, 33);

          intervals.push(interval);

          const delayed = gsap.delayedCall(
            (2 * (index + 1)) / chars.length,
            () => {
              clearInterval(interval);

              span.textContent = chars[index];

              gsap.fromTo(
                span,
                {
                  scale: 1.6,
                  color: "#00ff88",
                },
                {
                  scale: 1,
                  color: "#ffffff",
                  duration: 0.3,
                  ease: "back.out(2)",
                },
              );
            },
          );

          delayedCalls.push(delayed);
        });

        return {
          spans,
          intervals,
        };
      };

      const nameAnim = scrambleText(nameRef.current, name, NAME_CHARS);

      const ageAnim = scrambleText(ageRef.current, age, AGE_CHARS);

      return () => {
        nameAnim.intervals.forEach(clearInterval);

        ageAnim.intervals.forEach(clearInterval);

        delayedCalls.forEach((d) => d.kill());

        nameAnim.spans.forEach((span) => gsap.killTweensOf(span));

        ageAnim.spans.forEach((span) => gsap.killTweensOf(span));
      };
    },
    {
      dependencies: [name, age],
    },
  );

  return (
    <div className="name-container w-full max-w-full overflow-hidden">
      <h1 className="text-white w-full jb-mono text-[clamp(0.8rem,2vw,1.2rem)] whitespace-nowrap md:whitespace-normal">
        <span ref={nameRef} className="scramble-text" />

        {age && (
          <>
            <span> </span>[
            <span ref={ageRef} className="scramble-text" />]
          </>
        )}
      </h1>
    </div>
  );
}

export default React.memo(Name);
