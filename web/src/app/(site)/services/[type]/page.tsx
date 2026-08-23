import { notFound } from "next/navigation";
import { serviceTypes, getServiceBySlug } from "@/data/services";
import { ServiceRequestForm } from "@/components/services/ServiceRequestForm";

export function generateStaticParams() {
  return serviceTypes.map((s) => ({ type: s.slug }));
}

export function generateMetadata({ params }: { params: { type: string } }) {
  const service = getServiceBySlug(params.type);
  return { title: service ? `${service.name} | IMT Engineers` : "Services | IMT Engineers" };
}

export default function ServiceTypePage({ params }: { params: { type: string } }) {
  const service = getServiceBySlug(params.type);
  if (!service) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-imt-red">Services</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">{service.name}</h1>
          <p className="mt-4 max-w-xl text-sm text-slate-600">{service.description}</p>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">How it works</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4">
              <li>Submit the request form with your address and preferred date.</li>
              <li>Our team calls within 2 hours to confirm the appointment.</li>
              <li>A technician visits and completes the job — pay by cash or card afterward.</li>
            </ol>
          </div>
        </div>

        <ServiceRequestForm service={service} />
      </div>
    </div>
  );
}
