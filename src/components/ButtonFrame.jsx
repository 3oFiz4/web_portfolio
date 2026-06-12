import { useRef, useEffect } from "react";
import { gsap } from "gsap";

function ButtonFrame({ children, className = "", ...props }) {
  const buttonRef = useRef(null);
  const bgRef = useRef(null);

  const tlRef = useRef(null);
  const trRef = useRef(null);
  const blRef = useRef(null);
  const brRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const paths = [tlRef.current, trRef.current, blRef.current, brRef.current];

    gsap.set(bgRef.current, { opacity: 0 });

    paths.forEach((path) => {
      if (!path) return;

      const length = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
    });

    const hoverTl = gsap.timeline({ paused: true });

    hoverTl
      .to(
        bgRef.current,
        {
          opacity: 1,
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
          stagger: {
            each: 0.05,
            from: "start",
          },
        },
        0,
      );

    const onEnter = () => hoverTl.play();
    const onLeave = () => hoverTl.reverse();

    button.addEventListener("mouseenter", onEnter);
    button.addEventListener("mouseleave", onLeave);

    return () => {
      button.removeEventListener("mouseenter", onEnter);
      button.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`relative inline-flex items-center justify-center cursor-pointer bg-transparent border-none outline-none ${className}`}
      {...props}
    >
      <div
        ref={bgRef}
        className="absolute inset-0 bg-white/20 rounded-sm pointer-events-none"
      />

      <svg
        className="absolute top-0 left-0 w-4 h-4 pointer-events-none"
        viewBox="0 0 60 60"
        preserveAspectRatio="none"
      >
        <path
          ref={tlRef}
          d="M0,20 L0,0 L20,0"
          stroke="white"
          strokeWidth="5"
          fill="none"
          strokeLinecap="square"
        />
      </svg>

      <svg
        className="absolute top-0 right-0 w-4 h-4 pointer-events-none"
        viewBox="0 0 60 60"
        preserveAspectRatio="none"
      >
        <path
          ref={trRef}
          d="M40,0 L60,0 L60,20"
          stroke="white"
          strokeWidth="5"
          fill="none"
          strokeLinecap="square"
        />
      </svg>

      <svg
        className="absolute bottom-0 left-0 w-4 h-4 pointer-events-none"
        viewBox="0 0 60 60"
        preserveAspectRatio="none"
      >
        <path
          ref={blRef}
          d="M0,40 L0,60 L20,60"
          stroke="white"
          strokeWidth="5"
          fill="none"
          strokeLinecap="square"
        />
      </svg>

      <svg
        className="absolute bottom-0 right-0 w-4 h-4 pointer-events-none"
        viewBox="0 0 60 60"
        preserveAspectRatio="none"
      >
        <path
          ref={brRef}
          d="M40,60 L60,60 L60,40"
          stroke="white"
          strokeWidth="5"
          fill="none"
          strokeLinecap="square"
        />
      </svg>

      <span className="relative z-10 pointer-events-none">{children}</span>
    </button>
  );
}

export default ButtonFrame;
