import { testimonials } from "@/data/testimonials";
import { StarRating } from "@/components/ui/StarRating";
import { IcePlate } from "@/components/ui/IcePlate";

export function Testimonials() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-imt-red">Customer Stories</p>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900">What our customers say</h2>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <IcePlate key={t.id} className="p-6">
            <StarRating rating={t.rating} />
            <p className="mt-3 text-sm text-slate-700">&ldquo;{t.quote}&rdquo;</p>
            <p className="mt-4 text-sm font-semibold text-slate-900">{t.customerName}</p>
          </IcePlate>
        ))}
      </div>
    </section>
  );
}
