"use client";

import { useState } from "react";
import Link from "next/link";
import { IcePlate } from "@/components/ui/IcePlate";
import { Icon } from "@/components/ui/Icon";
import { suggestCapacity } from "@/lib/room-size";

export function RoomSizeWidget() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const sqft = Number(length) * Number(width);
  const valid = sqft > 0;
  const suggestion = valid ? suggestCapacity(sqft) : null;

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6">
      <IcePlate className="overflow-visible p-6 sm:p-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-imt-red">
              <Icon name="straighten" size={16} /> Not sure what size to buy?
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Find the right AC for your room in 10 seconds
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              Enter your room dimensions and we&rsquo;ll recommend the ideal cooling capacity — no
              guesswork, no oversized bills.
            </p>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <label className="text-xs font-semibold text-slate-600">
                Room length (ft)
                <input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="e.g. 12"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white/80 px-3 py-2.5 text-sm text-slate-900 focus:border-imt-blue focus:outline-none"
                />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Room width (ft)
                <input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="e.g. 14"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white/80 px-3 py-2.5 text-sm text-slate-900 focus:border-imt-blue focus:outline-none"
                />
              </label>
            </div>

            <div
              className={`mt-4 overflow-hidden rounded-xl transition-all duration-300 ${
                suggestion ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {suggestion && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-imt-blue/10 p-4">
                  <div>
                    <p className="text-xs text-slate-500">
                      Room area: <strong className="text-slate-700">{sqft.toFixed(0)} sq ft</strong>
                    </p>
                    <p className="mt-0.5 font-bold text-imt-navy">{suggestion.label}</p>
                  </div>
                  <Link
                    href="/shop/split"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-imt-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-imt-navy"
                  >
                    Shop this size <Icon name="arrow_forward" size={16} />
                  </Link>
                </div>
              )}
            </div>

            {!suggestion && (
              <p className="mt-3 text-xs text-slate-400">
                Tip: multiply room length × width in feet — most bedrooms are around 120–180 sq ft.
              </p>
            )}
          </div>
        </div>
      </IcePlate>
    </section>
  );
}
