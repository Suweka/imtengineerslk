import Image from "next/image";

export function ProductImageFrame({
  src,
  alt,
  label,
  className = "",
}: {
  src?: string;
  alt: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-lg border border-[#E5EAF0] bg-[#F2F5F8] shadow-[0_2px_8px_rgba(0,0,0,0.05)] ${className}`}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-contain p-4" />
      ) : (
        <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span className="text-xs font-medium">{label ?? "Product"}</span>
        </div>
      )}
    </div>
  );
}
