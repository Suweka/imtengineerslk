import { ProductImageFrame } from "@/components/product/ProductImageFrame";
import { siteSettings } from "@/data/testimonials";
import { InfoBar, trustItems } from "@/components/home/InfoBar";

export const metadata = { title: "About Us | IMT Engineers" };

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-imt-red">Since {siteSettings.foundedYear}</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">About IMT Engineers</h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              IMT Engineers (Pvt) Ltd has been selling, installing and servicing domestic and central air conditioners
              across Sri Lanka since {siteSettings.foundedYear}. We work directly with leading brands and install every
              unit with our own in-house engineering team — not subcontractors.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Our head office is based in Karandeniya, with an engineering department in Moratuwa serving the greater
              Colombo area and beyond.
            </p>
          </div>
          <ProductImageFrame alt="IMT Engineers team" label="IMT Engineers team" className="aspect-[4/3] w-full" />
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
          <h2 className="text-center text-2xl font-extrabold text-slate-900">Why customers choose us</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "In-house technicians", body: "Every installation is done by IMT-certified staff, not outsourced contractors." },
              { title: "Genuine, warrantied units", body: "We source only through authorised channels with full manufacturer warranty." },
              { title: "Islandwide reach", body: "Delivery and installation coverage across Sri Lanka, not just Colombo." },
              { title: "After-sales support", body: "Gas refills, AMC plans and emergency callouts long after your purchase." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InfoBar items={trustItems} tone="light" />
    </>
  );
}
