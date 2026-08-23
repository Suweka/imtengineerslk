import { ReactNode } from "react";

type Tone = "bestseller" | "discount" | "new" | "success" | "neutral";

const toneClasses: Record<Tone, string> = {
  bestseller: "bg-emerald-600 text-white",
  discount: "bg-imt-red text-white",
  new: "bg-imt-blue text-white",
  success: "bg-emerald-50 text-emerald-700",
  neutral: "bg-slate-100 text-slate-700",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-bold uppercase tracking-wide ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
