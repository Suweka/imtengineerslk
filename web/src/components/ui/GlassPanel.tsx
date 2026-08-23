import { HTMLAttributes, ReactNode } from "react";

export function GlassPanel({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={`rounded-xl border border-white/40 bg-white/70 shadow-lg backdrop-blur-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
