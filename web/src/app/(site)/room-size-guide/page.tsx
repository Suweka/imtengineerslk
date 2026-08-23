import { RoomSizeCalculator } from "@/components/product/RoomSizeCalculator";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = { title: "Room Size Guide | IMT Engineers" };

const rows = [
  { size: "Up to 120 sq ft", capacity: "1.0 HP (9,000 BTU/hr)" },
  { size: "120 - 180 sq ft", capacity: "1.5 HP (12,000 BTU/hr)" },
  { size: "180 - 260 sq ft", capacity: "2.0 HP (18,000 BTU/hr)" },
  { size: "260 - 320 sq ft", capacity: "2.5 HP (24,000 BTU/hr)" },
  { size: "320+ sq ft", capacity: "3.0 HP or ducted system" },
];

export default function RoomSizeGuidePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-wide text-imt-red">Sizing Help</p>
      <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Room Size Guide</h1>
      <p className="mt-4 max-w-2xl text-sm text-slate-600">
        Choosing the right capacity keeps your unit running efficiently — undersized units run constantly and wear out
        faster, while oversized units cool too quickly without properly dehumidifying the room. Use the calculator
        below, or check the table for a general guide.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Room size</th>
                <th className="px-4 py-3">Suggested capacity</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.size} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">{r.size}</td>
                  <td className="px-4 py-3 text-slate-600">{r.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            Guide assumes standard ceiling height, average sun exposure and up to 2 occupants per room. Rooms with
            large windows, high ceilings, or heat-generating equipment may need a larger capacity — ask our team.
          </p>
        </div>

        <RoomSizeCalculator />
      </div>

      <div className="mt-10 rounded-xl border border-imt-blue/20 bg-imt-blue/5 p-5 text-sm text-slate-700">
        Not sure which unit to pick? Our engineers can size your room for free during a site visit.
        <div className="mt-3">
          <ButtonLink href="/contact">Talk to an engineer →</ButtonLink>
        </div>
      </div>
    </div>
  );
}
