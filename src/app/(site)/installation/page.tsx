import { ButtonLink } from "@/components/ui/Button";
import { ProductImageFrame } from "@/components/product/ProductImageFrame";
import { siteSettings } from "@/data/testimonials";
import { InfoBar, trustItems } from "@/components/home/InfoBar";

export const metadata = { title: "Installation | IMT Engineers" };

const steps = [
  { title: "Book a slot", body: "Choose installation as an add-on at checkout, or call us directly for an existing unit." },
  { title: "Site survey (ceiling units)", body: "Cassette and ducted units require a short site visit before we confirm a fitting date." },
  { title: "Professional fit", body: "IMT-certified technicians fit the unit with bracket, up to 3m copper piping, gas charging and testing." },
  { title: "Handover & warranty", body: "We register your unit with the manufacturer and walk you through care and maintenance." },
];

const faqs = [
  { q: "How long does installation take?", a: "Most split units are installed within 3 working days of confirming your slot, islandwide. Ceiling-mounted units may take longer due to the required site survey." },
  { q: "What's included in the installation fee?", a: "A wall bracket, up to 3 metres of copper piping, gas charging, vacuum testing and a final performance check. Additional piping beyond 3m is quoted separately." },
  { q: "Do I need a site survey?", a: "Only for cassette and ducted units, since ceiling access and ducting routes vary by property. Split, floor standing and portable units don't need one." },
  { q: "Can I get an Annual Maintenance Contract?", a: "Yes — AMC plans start from LKR 14,500 a year and include scheduled servicing to keep your unit running at rated efficiency." },
];

export default function InstallationPage() {
  return (
    <>
      <section className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-imt-red">Installation &amp; Service</p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              Fitted by our own engineers, not a subcontractor.
            </h1>
            <p className="mt-4 text-sm text-slate-600">
              Every unit we sell can be installed by an IMT-certified team, islandwide, within three working days.
              Annual maintenance contracts keep it running at rated efficiency.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/shop">Browse air conditioners →</ButtonLink>
              <a href={`tel:${siteSettings.phone}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-imt-navy hover:border-imt-blue">
                📞 {siteSettings.phone}
              </a>
            </div>
          </div>
          <ProductImageFrame alt="Technician installing a unit" label="Technician installing a unit" className="aspect-[4/3] w-full" />
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
          <h2 className="text-center text-2xl font-extrabold text-slate-900">How installation works</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-imt-blue text-sm font-bold text-white">{i + 1}</span>
                <h3 className="mt-3 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h2 className="text-center text-2xl font-extrabold text-slate-900">Frequently asked questions</h2>
        <div className="mt-8 space-y-4">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-semibold text-slate-900">{f.q}</summary>
              <p className="mt-2 text-sm text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <InfoBar items={trustItems} tone="light" />
    </>
  );
}
