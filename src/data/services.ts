import { ServiceType } from "@/lib/types";

export const serviceTypes: ServiceType[] = [
  {
    id: "svc-gas-refill",
    slug: "gas-refill",
    name: "Gas Refill",
    description:
      "Lost cooling power? We top up R32 refrigerant and check your system for leaks before recharging.",
    icon: "gauge",
  },
  {
    id: "svc-duct-cleaning",
    slug: "duct-cleaning",
    name: "Duct Cleaning",
    description:
      "Deep clean of indoor coils, filters and ductwork to restore airflow and improve air quality.",
    icon: "wind",
  },
  {
    id: "svc-amc",
    slug: "amc",
    name: "Annual Maintenance Contract",
    description:
      "Scheduled servicing throughout the year so your units keep running at rated efficiency.",
    icon: "calendar-check",
  },
  {
    id: "svc-relocation",
    slug: "relocation",
    name: "Relocation / Uninstall",
    description:
      "Moving house or renovating? We safely uninstall, transport and refit your existing unit.",
    icon: "truck",
  },
  {
    id: "svc-emergency",
    slug: "emergency",
    name: "Emergency Same-Day",
    description:
      "Unit stopped working in this heat? Our technicians offer same-day emergency callouts.",
    icon: "zap",
  },
  {
    id: "svc-disposal",
    slug: "disposal",
    name: "Old Unit Disposal",
    description:
      "Responsible removal and disposal of your old air conditioner when you upgrade.",
    icon: "trash",
  },
];

export function getServiceBySlug(slug: string) {
  return serviceTypes.find((s) => s.slug === slug);
}
