import Image from "next/image";
import Link from "next/link";

export default function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const mark = size === "sm" ? "text-[17px]" : "text-[23px]";
  const sub = size === "sm" ? "text-[7px] tracking-[2px]" : "text-[9px] tracking-[2.5px]";
  const box = size === "sm" ? 32 : 42;

  return (
    <Link href="/" className="flex items-center gap-2 no-underline">
      <span
        className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-white"
        style={{ width: box, height: box }}
      >
        {/* Replace public/logo.jpeg with a transparent PNG or SVG when you have one */}
        <Image
          src="/logo.jpeg"
          alt="IMT Engineers"
          width={box + 12}
          height={box + 12}
          className="max-w-none"
          priority
        />
      </span>
      <span>
        <span
          className={`block bg-gold-text bg-clip-text font-bold leading-none text-transparent ${mark}`}
        >
          IMT
        </span>
        <span className={`block font-semibold leading-[1.6] text-brand-gold ${sub}`}>
          ENGINEERS
        </span>
      </span>
    </Link>
  );
}
