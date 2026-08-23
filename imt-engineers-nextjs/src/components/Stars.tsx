export default function Stars({ rating, reviews }: { rating: number; reviews?: number }) {
  const full = Math.round(rating);
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[12px] tracking-[0.5px] text-brand-orange">
        {"★".repeat(full)}
        <span className="text-[#D9E1E8]">{"★".repeat(5 - full)}</span>
      </span>
      {reviews !== undefined && (
        <span className="text-[11px] text-ui-faint">({reviews})</span>
      )}
    </div>
  );
}
