import type { CSSProperties } from "react";

type IconProps = {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
};

/** Material Symbols Outlined glyph. The font is loaded once in the root layout. */
export default function Icon({ name, size = 20, className = "", style }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined shrink-0 ${className}`}
      style={{ fontSize: size, ...style }}
    >
      {name}
    </span>
  );
}
