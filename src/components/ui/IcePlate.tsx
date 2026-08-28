import { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function IcePlate({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={twMerge(
        "group relative overflow-hidden rounded-2xl border border-white/50 bg-gradient-to-br from-white/80 via-sky-50/60 to-imt-blue/10 shadow-[0_8px_32px_rgba(28,117,188,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(28,117,188,0.2)]",
        className
      )}
      {...props}
    >
      {/* Icy shine highlight, top-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/50 blur-2xl transition-opacity duration-300 group-hover:opacity-80"
      />
      {/* Frost edge glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/60"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
