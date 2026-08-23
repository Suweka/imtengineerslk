import { ButtonLink } from "@/components/ui/Button";
import { siteSettings } from "@/data/testimonials";
import { ProductImageFrame } from "@/components/product/ProductImageFrame";

const points = [
  "IMT-certified technicians, not subcontractors",
  "Bracket, 3m copper piping, gas charging and testing included",
  "Within 3 working days, islandwide",
  "Annual maintenance contracts from LKR 14,500 a year",
];

export function InstallationBand() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-imt-red">Installation &amp; Service</p>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-slate-900">
            Fitted by our own engineers, not a subcontractor.
          </h2>
          <p className="mt-4 text-sm text-slate-600">
            Every unit we sell can be installed by an IMT-certified team, islandwide, within three working days.
            Annual maintenance contracts keep it running at rated efficiency.
          </p>
          <ul className="mt-5 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckIcon /> {p}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/installation">Book an installation →</ButtonLink>
            <a
              href={`tel:${siteSettings.phone}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-imt-navy hover:border-imt-blue"
            >
              📞 {siteSettings.phone}
            </a>
          </div>
        </div>
        <ProductImageFrame alt="Technician installing a unit" label="Technician installing a unit" className="aspect-[4/3] w-full" />
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-emerald-600">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  );
}
