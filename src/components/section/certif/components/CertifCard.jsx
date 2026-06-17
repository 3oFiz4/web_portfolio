import React, { useRef, useMemo, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FaTrophy } from "react-icons/fa";

function MovingGrid({ gridClassName = "", opacity = 0.12 }) {
  const columns = useMemo(
    () => Array.from({ length: 11 }, (_, idx) => idx * 40),
    [],
  );
  const rows = useMemo(() => [0, 20, 40], []);

  return (
    <svg
      viewBox="0 0 400 40"
      preserveAspectRatio="none"
      className={`block h-full shrink-0 pointer-events-none ${gridClassName}`}
      style={{ width: "auto", height: "100%", display: "block" }}
    >
      <g
        opacity={opacity}
        stroke="currentColor"
        fill="none"
        shapeRendering="crispEdges"
      >
        {columns.map((x) => (
          <line
            key={`v-${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2="40"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {rows.map((y) => (
          <line
            key={`h-${y}`}
            x1="0"
            y1={y}
            x2="400"
            y2={y}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
    </svg>
  );
}

function CertifCard({
  title,
  issuer,
  year,
  img,
  iconColor = "text-zinc-500",
  onClick,
  active,
  isActive,
  direction = "left",
  duration = 12,
  className = "",
  gridClassName = "text-white",
  gridOpacity = 0.12,
  ...props
}) {
  const cardActive = isActive ?? active ?? false;

  const containerRef = useRef(null);
  const gridTrackRef = useRef(null);
  const gridOverlayRef = useRef(null);
  const timelineRef = useRef(null);
  const activeRef = useRef(cardActive);

  activeRef.current = cardActive;

  const animationStateRef = useRef({
    containerHeight: 0,
    loopPixels: 0,
    isVisible: true,
    needsRefresh: true,
  });

  const calculateAnimationParams = useCallback(() => {
    const container = containerRef.current;
    if (!container) return null;

    const containerHeight = container.getBoundingClientRect().height || 80;

    if (
      containerHeight === animationStateRef.current.containerHeight &&
      !animationStateRef.current.needsRefresh
    ) {
      return {
        containerHeight: animationStateRef.current.containerHeight,
        loopPixels: animationStateRef.current.loopPixels,
      };
    }

    // SVG viewBox = 400 x 40, so width scales by 400/40 = 10x the height
    const loopPixels = containerHeight * 10;

    animationStateRef.current.containerHeight = containerHeight;
    animationStateRef.current.loopPixels = loopPixels;
    animationStateRef.current.needsRefresh = false;

    return { containerHeight, loopPixels };
  }, []);

  useGSAP(
    () => {
      const container = containerRef.current;
      const track = gridTrackRef.current;
      if (!container || !track) return;

      const state = animationStateRef.current;
      let resizeTimeout = null;

      const setupAnimation = () => {
        const params = calculateAnimationParams();
        if (!params) return;

        const { loopPixels } = params;

        timelineRef.current?.kill();

        const fromX = direction === "right" ? -loopPixels : 0;
        const toX = direction === "right" ? 0 : -loopPixels;

        timelineRef.current = gsap.timeline({
          repeat: -1,
          paused: !activeRef.current || !state.isVisible,
          defaults: { ease: "none" },
        });

        timelineRef.current.fromTo(
          track,
          { x: fromX },
          { x: toX, duration, ease: "none" },
        );
      };

      const debouncedSetup = () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => {
          animationStateRef.current.needsRefresh = true;
          setupAnimation();
        }, 100);
      };

      const io = new IntersectionObserver(
        (entries) => {
          const isVisible = entries[0]?.isIntersecting ?? false;

          if (state.isVisible !== isVisible) {
            state.isVisible = isVisible;

            if (timelineRef.current) {
              if (activeRef.current && isVisible) {
                timelineRef.current.play();
              } else {
                timelineRef.current.pause();
              }
            }
          }
        },
        { threshold: 0, rootMargin: "50px" },
      );

      const ro = new ResizeObserver(debouncedSetup);

      io.observe(container);
      ro.observe(container);
      setupAnimation();

      return () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        io.disconnect();
        ro.disconnect();
        timelineRef.current?.kill();
        timelineRef.current = null;
        gsap.killTweensOf(track);
      };
    },
    {
      scope: containerRef,
      dependencies: [direction, duration, gridClassName, gridOpacity],
    },
  );

  useGSAP(
    () => {
      const overlay = gridOverlayRef.current;
      if (!overlay) return;

      gsap.to(overlay, {
        autoAlpha: cardActive ? 1 : 0,
        duration: 0.25,
        ease: "power2.out",
      });

      if (timelineRef.current) {
        if (cardActive && animationStateRef.current.isVisible) {
          timelineRef.current.play();
        } else {
          timelineRef.current.pause();
        }
      }
    },
    {
      scope: containerRef,
      dependencies: [cardActive],
    },
  );

  const memoizedGridTrack = useMemo(
    () => (
      <>
        <MovingGrid gridClassName={gridClassName} opacity={gridOpacity} />
        <MovingGrid gridClassName={gridClassName} opacity={gridOpacity} />
      </>
    ),
    [gridClassName, gridOpacity],
  );

  return (
    <button
      ref={containerRef}
      type="button"
      onClick={onClick}
      aria-pressed={cardActive}
      data-active={cardActive}
      className={`relative isolate w-full overflow-hidden border-y border-white text-white p-4 transition-colors cursor-pointer ${
        cardActive ? "bg-white/5" : "hover:bg-white/5"
      } ${className}`}
      {...props}
    >
      {/* Active grid overlay */}
      <div
        ref={gridOverlayRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-0"
        style={{ visibility: "hidden" }}
      >
        <div
          ref={gridTrackRef}
          className={`absolute inset-y-0 left-0 flex flex-row items-center will-change-transform ${gridClassName}`}
        >
          {memoizedGridTrack}
        </div>

        {/* subtle fade/gloss */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.04] via-transparent to-white/[0.04]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center gap-4">
        {img ? (
          <img
            src={img}
            alt={issuer}
            className="w-12 h-12 object-contain shrink-0"
          />
        ) : (
          <FaTrophy size={32} className={`${iconColor} shrink-0`} />
        )}

        <div className="flex-1 text-left jb-mono">
          <div className="font-sm">{title}</div>
          <div className="text-sm text-zinc-500">{issuer}</div>
          <div className="text-xs text-zinc-600">Verified • {year}</div>
        </div>

        <div
          className={`text-xl transition-colors ${
            cardActive ? "text-white" : "text-zinc-500"
          }`}
        >
          →
        </div>
      </div>
    </button>
  );
}

export default CertifCard;
