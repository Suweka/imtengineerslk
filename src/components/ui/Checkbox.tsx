import { InputHTMLAttributes } from "react";

export function Checkbox({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
      <input type="checkbox" className={`peer absolute inset-0 z-10 h-4 w-4 cursor-pointer opacity-0 ${className}`} {...props} />
      <span
        className="pointer-events-none absolute inset-0 rounded border border-slate-300 bg-white transition-colors
          peer-checked:border-imt-blue peer-checked:bg-imt-blue
          peer-focus-visible:ring-2 peer-focus-visible:ring-imt-blue/40 peer-focus-visible:ring-offset-1"
      />
      <svg
        viewBox="0 0 12 10"
        className="pointer-events-none relative h-2.5 w-2.5 scale-75 opacity-0 transition-all duration-150 peer-checked:scale-100 peer-checked:opacity-100"
      >
        <path d="M1 5l3 3 7-7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
