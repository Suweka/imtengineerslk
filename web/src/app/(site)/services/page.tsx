import Link from "next/link";
import { serviceTypes } from "@/data/services";
import { InfoBar, trustItems } from "@/components/home/InfoBar";

export const metadata = { title: "Services | IMT Engineers" };

export default function ServicesPage() {
  return (
    <>
      <section className="mx-auto max-w-[1600px] px-4 py-12 text-center sm:px-6">
        <p className="text-xs font-bold uppercase tracking-wide text-imt-red">Services &amp; AMC</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Keep your units running at their best</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
          From gas refills to full relocations, our engineers handle it — islandwide.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
          {serviceTypes.map((s) => (
            <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900">{s.name}</h3>
              <p className="mt-2 text-sm text-slate-500">{s.description}</p>
              <Link href={`/services/${s.slug}`} className="mt-4 inline-flex text-sm font-semibold text-imt-blue hover:underline">
                Request Service →
              </Link>
            </div>
          ))}
        </div>
      </section>
      <InfoBar items={trustItems} tone="light" />
    </>
  );
}
