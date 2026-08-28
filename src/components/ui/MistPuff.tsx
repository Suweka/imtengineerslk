"use client";

const WISPS = [
  { x: -22, y: -20, delay: 0 },
  { x: 0, y: -26, delay: 40 },
  { x: 22, y: -20, delay: 80 },
  { x: -12, y: -24, delay: 120 },
  { x: 12, y: -24, delay: 120 },
];

export function MistPuff({ triggerKey }: { triggerKey: number }) {
  if (triggerKey === 0) return null;

  return (
    <span className="mist-puff" aria-hidden="true">
      {WISPS.map((w, i) => (
        <span
          key={`${triggerKey}-${i}`}
          className="mist-wisp"
          style={
            {
              "--mist-x": `${w.x}px`,
              "--mist-y": `${w.y}px`,
              animationDelay: `${w.delay}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  );
}
