import { ProductImageFrame } from "@/components/product/ProductImageFrame";
import { siteSettings } from "@/data/testimonials";
import { InfoBar, trustItems } from "@/components/home/InfoBar";
import { getPageContent } from "@/lib/page-content";

export const metadata = { title: "About Us | IMT Engineers" };
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getPageContent("about");
  return (
    <>
      <section className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-imt-red">Since {siteSettings.foundedYear}</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">{content.title}</h1>
            <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-imt-red">
              Engineering Comfort. Building Trust.
            </p>
            {content.body.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mt-4 text-sm leading-relaxed text-slate-600">
                {paragraph}
              </p>
            ))}
          </div>
          <ProductImageFrame
            src="/team.png"
            alt="IMT Engineers team"
            label="IMT Engineers team"
            className="aspect-[4/3] w-full"
            fit="cover"
          />
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-extrabold uppercase tracking-wide text-imt-red">Our Vision</h2>
              <p className="mt-3 text-sm italic leading-relaxed text-slate-600">
                &ldquo;To become a leading and trusted air-conditioning and engineering solutions brand, recognized
                for technical excellence, quality, innovation and exceptional customer experience.&rdquo;
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-extrabold uppercase tracking-wide text-imt-red">Our Mission</h2>
              <p className="mt-3 text-sm italic leading-relaxed text-slate-600">
                &ldquo;To consistently deliver the right solution, the right workmanship and the right support
                through skilled professionals, quality systems and continuous improvement.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
          <h2 className="text-center text-2xl font-extrabold text-slate-900">Corporate Identity</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Who We Are", body: "A trusted Air-Conditioning & Engineering Solutions Company." },
              { title: "What We Do", body: "Sales, Installation, Service, Maintenance and Commercial Solutions." },
              { title: "Why We Exist", body: "To create better environments through reliable cooling." },
              { title: "What We Believe", body: "Trust, Quality, Honesty, Safety and Professionalism." },
              { title: "What We Promise", body: "Your comfort is our responsibility." },
              { title: "What We Want To Become", body: "A trusted and respected engineering brand in Sri Lanka." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{f.body}</p>
              </div>
            ))}
          </div>
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
