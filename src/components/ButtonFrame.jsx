import { useCallback, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const PATH_LENGTH = 40;
const BASE_CLASS =
  "relative inline-flex items-center justify-center cursor-pointer bg-transparent border-none outline-none";

function ButtonFrame({
  children,
  className = "",
  onMouseEnter,
  onMouseLeave,
  ...props
}) {
  const buttonRef = useRef(null);
  const bgRef = useRef(null);
  const hoverTl = useRef(null);

  const tlRef = useRef(null);
  const trRef = useRef(null);
  const blRef = useRef(null);
  const brRef = useRef(null);

  const pathRefs = useMemo(() => [tlRef, trRef, blRef, brRef], []);
  const buttonClassName = useMemo(
    () => `${BASE_CLASS} ${className}`.trim(),
    [className],
  );

  useGSAP(
    () => {
      const bg = bgRef.current;
      const paths = pathRefs.map((ref) => ref.current).filter(Boolean);

      if (!bg || paths.length !== 4) return;

      // useGSAP already uses gsap.context internally and cleans up on unmount.
      hoverTl.current = gsap.timeline({ paused: true });

      hoverTl.current
        .to(
          bg,
          {
            autoAlpha: 1,
            duration: 0.2,
            ease: "power2.out",
          },
          0,
        )
        .to(
          paths,
          {
            strokeDashoffset: 0,
            duration: 0.05,
            ease: "power2.out",
            stagger: 0.05,
          },
          0,
        );

      return () => {
        hoverTl.current?.kill();
        hoverTl.current = null;
      };
    },
    { scope: buttonRef },
  );

  const playHover = useCallback(() => {
    hoverTl.current?.play();
  }, []);

  const reverseHover = useCallback(() => {
    hoverTl.current?.reverse();
  }, []);

  const handleMouseEnter = useCallback(
    (event) => {
      playHover();
      onMouseEnter?.(event);
    },
    [onMouseEnter, playHover],
  );

  const handleMouseLeave = useCallback(
    (event) => {
      reverseHover();
      onMouseLeave?.(event);
    },
    [onMouseLeave, reverseHover],
  );

  return (
    <button
      ref={buttonRef}
      className={buttonClassName}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-0 bg-white/20 rounded-sm opacity-0 invisible"
      />

      <svg
        className="pointer-events-none absolute top-0 left-0 w-4 h-4"
        viewBox="0 0 60 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          ref={tlRef}
          d="M0,20 L0,0 L20,0"
          stroke="white"
          strokeWidth="5"
          fill="none"
          strokeLinecap="square"
          strokeDasharray={PATH_LENGTH}
          strokeDashoffset={PATH_LENGTH}
        />
      </svg>

      <svg
        className="pointer-events-none absolute top-0 right-0 w-4 h-4"
        viewBox="0 0 60 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          ref={trRef}
          d="M40,0 L60,0 L60,20"
          stroke="white"
          strokeWidth="5"
          fill="none"
          strokeLinecap="square"
          strokeDasharray={PATH_LENGTH}
          strokeDashoffset={PATH_LENGTH}
        />
      </svg>

      <svg
        className="pointer-events-none absolute bottom-0 left-0 w-4 h-4"
        viewBox="0 0 60 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          ref={blRef}
          d="M0,40 L0,60 L20,60"
          stroke="white"
          strokeWidth="5"
          fill="none"
          strokeLinecap="square"
          strokeDasharray={PATH_LENGTH}
          strokeDashoffset={PATH_LENGTH}
        />
      </svg>

      <svg
        className="pointer-events-none absolute bottom-0 right-0 w-4 h-4"
        viewBox="0 0 60 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          ref={brRef}
          d="M40,60 L60,60 L60,40"
          stroke="white"
          strokeWidth="5"
          fill="none"
          strokeLinecap="square"
          strokeDasharray={PATH_LENGTH}
          strokeDashoffset={PATH_LENGTH}
        />
      </svg>

      <span className="relative z-10">{children}</span>
    </button>
  );
}

export default ButtonFrame;
