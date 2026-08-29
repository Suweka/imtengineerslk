"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { suggestCapacity } from "@/lib/room-size";

export function RoomSizeCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const sqft = Number(length) * Number(width);
  const valid = sqft > 0;

  return (
    <GlassPanel className="p-5">
      <h3 className="text-sm font-bold text-slate-900">Room size calculator</h3>
      <p className="mt-1 text-xs text-slate-500">Enter your room dimensions to get a suggested capacity.</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="text-xs text-slate-600">
          Length (ft)
          <input
            type="number"
            min={0}
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-slate-600">
          Width (ft)
          <input
            type="number"
            min={0}
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>
      {valid && (
        <div className="mt-3 rounded-lg bg-imt-blue/10 p-3 text-sm">
          <p className="text-slate-600">Room area: <strong>{sqft.toFixed(0)} sq ft</strong></p>
          <p className="mt-1 font-semibold text-imt-navy">Suggested: {suggestCapacity(sqft).label}</p>
        </div>
      )}
    </GlassPanel>
  );
}
