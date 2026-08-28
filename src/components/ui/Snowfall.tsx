"use client";

import { useEffect, useRef } from "react";

type Flake = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  driftPhase: number;
  opacity: number;
};

export function Snowfall({ count = 60 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let flakes: Flake[] = [];
    let animationId: number;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;
    }

    function makeFlake(randomY = true): Flake {
      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : -10,
        radius: Math.random() * 2.2 + 0.8,
        speed: Math.random() * 0.6 + 0.25,
        drift: Math.random() * 0.6 + 0.2,
        driftPhase: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.5 + 0.35,
      };
    }

    resize();
    flakes = Array.from({ length: count }, () => makeFlake(true));

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      ctx!.fillStyle = "#ffffff";

      for (const flake of flakes) {
        flake.y += flake.speed;
        flake.driftPhase += 0.01;
        flake.x += Math.sin(flake.driftPhase) * flake.drift * 0.3;

        if (flake.y > height + 10) {
          Object.assign(flake, makeFlake(false));
        }
        if (flake.x > width + 10) flake.x = -10;
        if (flake.x < -10) flake.x = width + 10;

        ctx!.globalAlpha = flake.opacity;
        ctx!.beginPath();
        ctx!.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx!.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 h-full w-full mix-blend-screen"
    />
  );
}
