"use client";

import { useRef, useState } from "react";

type ImageSlot = {
  id: string;
  originalUrl: string;
  processedUrl?: string;
  status: "pending" | "processing" | "processed" | "failed";
};

export function AdminImageUploader({ initial = [] }: { initial?: string[] }) {
  const [images, setImages] = useState<ImageSlot[]>(
    initial.map((url, i) => ({ id: `existing-${i}`, originalUrl: url, processedUrl: url, status: "processed" }))
  );
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const originalUrl = URL.createObjectURL(file);
      setImages((prev) => [...prev, { id, originalUrl, status: "processing" }]);

      // Simulates the remove.bg round trip — swap for a real POST /api/admin/products/[id]/images call.
      setTimeout(() => {
        setImages((prev) =>
          prev.map((img) => (img.id === id ? { ...img, processedUrl: img.originalUrl, status: "processed" } : img))
        );
      }, 1400);
    });
  }

  function removeImage(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="relative overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="relative flex aspect-square items-center justify-center bg-[#F2F5F8]">
              {img.status === "processing" ? (
                <div className="flex flex-col items-center gap-2 text-xs text-slate-400">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-imt-blue" />
                  Removing background…
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img.processedUrl ?? img.originalUrl} alt="Product upload" className="h-full w-full object-contain p-2" />
              )}
              <button
                onClick={() => removeImage(img.id)}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow hover:text-imt-red"
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
            <div className="px-2 py-1.5 text-center text-[11px] font-medium">
              {img.status === "processed" && <span className="text-emerald-600">✓ Background removed</span>}
              {img.status === "processing" && <span className="text-slate-400">Processing…</span>}
              {img.status === "failed" && <span className="text-red-600">Failed — retry upload</span>}
            </div>
          </div>
        ))}

        <button
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-imt-blue hover:text-imt-blue"
        >
          <span className="text-2xl leading-none">+</span>
          <span className="text-xs font-medium">Upload photo</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="mt-2 text-xs text-slate-400">
        Photos are automatically background-removed via remove.bg after upload. First image is used as the primary shop/catalog thumbnail.
      </p>
    </div>
  );
}
