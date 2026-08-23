export function StarRating({ rating, reviewCount }: { rating: number; reviewCount?: number }) {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <div className="flex text-imt-gold-end" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>{i < Math.round(rating) ? "★" : "☆"}</span>
        ))}
      </div>
      {reviewCount !== undefined && <span className="text-slate-500">({reviewCount})</span>}
    </div>
  );
}
