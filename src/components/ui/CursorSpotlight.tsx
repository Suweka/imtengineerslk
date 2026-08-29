"use client";

import { ReactNode, useRef } from "react";

/**
 * Wraps hero-style content in a container that renders a soft glow
 * following the cursor. The glow itself is pointer-events-none so it
 * never intercepts clicks on the real content stacked above it.
 */
export function CursorSpotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const spotRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = spotRef.current;
      if (!el) return;
      el.style.transform = `translate(${x}px, ${y}px)`;
      el.style.opacity = "1";
    });
  }

  function handleMouseLeave() {
    if (spotRef.current) spotRef.current.style.opacity = "0";
  }

  return (
    <div className={`relative ${className}`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div
        ref={spotRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-300"
        style={{
          background: "radial-gradient(circle, rgba(28,117,188,0.16) 0%, rgba(28,117,188,0.06) 45%, transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
