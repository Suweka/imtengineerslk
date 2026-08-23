import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-imt-blue text-white hover:bg-imt-navy",
  secondary: "bg-imt-navy text-white hover:bg-imt-blue",
  outline: "bg-white text-imt-navy border border-slate-300 hover:border-imt-blue",
  ghost: "bg-transparent text-imt-navy hover:bg-slate-100",
  danger: "bg-imt-red text-white hover:bg-red-700",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
  lg: "text-base px-6 py-3 gap-2",
};

const base =
  "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.97] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; children: ReactNode }) {
  return (
    <button className={twMerge(base, variantClasses[variant], sizeClasses[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
}: {
  children: ReactNode;
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return (
    <Link href={href} className={twMerge(base, variantClasses[variant], sizeClasses[size], className)}>
      {children}
    </Link>
  );
}
