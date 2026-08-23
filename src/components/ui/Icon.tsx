import { CSSProperties } from "react";

export function Icon({
  name,
  className = "",
  size = 24,
  style,
}: {
  name: string;
  className?: string;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size, ...style }}>
      {name}
    </span>
  );
}
