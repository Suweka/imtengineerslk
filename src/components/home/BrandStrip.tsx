import { brands } from "@/data/brands";
import { ProductImageFrame } from "@/components/product/ProductImageFrame";

export function BrandStrip() {
  const track = [...brands, ...brands];

  return (
    <section className="bg-slate-50 py-12">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-500">Authorised Dealer For</p>
      </div>

      <div className="group relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused]">
          {track.map((b, i) => (
            <ProductImageFrame
              key={`${b.id}-${i}`}
              src={b.logo}
              alt={b.name}
              label={b.name}
              className="aspect-[3/2] w-[220px] shrink-0 sm:w-[260px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
