"use client";

import { useRef, useState } from "react";

type ImageSlot = {
  id: string;
  originalUrl: string;
  processedUrl?: string;
  status: "pending" | "processed" | "failed";
};

export function AdminImageUploader({ productId, initial = [] }: { productId?: string; initial?: string[] }) {
  const [images, setImages] = useState<ImageSlot[]>(
    initial.map((url, i) => ({ id: `existing-${i}`, originalUrl: url, processedUrl: url, status: "processed" }))
  );
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    if (!productId) {
      alert("Save the product first, then add photos — image uploads need a saved product to attach to.");
      return;
    }

    for (const file of Array.from(files)) {
      const tempId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const previewUrl = URL.createObjectURL(file);
      setImages((prev) => [...prev, { id: tempId, originalUrl: previewUrl, status: "pending" }]);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(`/api/admin/products/${productId}/images`, { method: "POST", body: formData });
        if (!res.ok) throw new Error(await res.text());
        const saved = await res.json();
        setImages((prev) =>
          prev.map((img) =>
            img.id === tempId
              ? { id: saved.id, originalUrl: saved.originalUrl, processedUrl: saved.processedUrl, status: saved.status }
              : img
          )
        );
      } catch (err) {
        console.error("Image upload failed", err);
        setImages((prev) => prev.map((img) => (img.id === tempId ? { ...img, status: "failed" } : img)));
      }
    }
  }

  async function retryImage(id: string) {
    if (!productId) return;
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, status: "pending" } : img)));
    try {
      const res = await fetch(`/api/admin/products/${productId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId: id }),
      });
      if (!res.ok) throw new Error(await res.text());
      const saved = await res.json();
      setImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, processedUrl: saved.processedUrl, status: saved.status } : img
        )
      );
    } catch (err) {
      console.error("Retry failed", err);
      setImages((prev) => prev.map((img) => (img.id === id ? { ...img, status: "failed" } : img)));
    }
  }

  async function removeImage(id: string) {
    setImages((prev) => prev.filter((i) => i.id !== id));
    if (!productId || id.startsWith("existing-")) return;
    fetch(`/api/admin/products/${productId}/images?imageId=${id}`, { method: "DELETE" }).catch((err) =>
      console.error("Failed to delete image", err)
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="relative overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="relative flex aspect-square items-center justify-center bg-[#F2F5F8]">
              {img.status === "pending" ? (
                <div className="flex flex-col items-center gap-2 text-xs text-slate-400">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-imt-blue" />
                  Removing background…
                </div>
              ) : img.status === "failed" ? (
                <div className="grid h-full w-full grid-cols-2">
                  <ImgTile src={img.originalUrl} label="Before" />
                  <div className="flex flex-col items-center justify-center gap-1 bg-red-50 text-center text-[10px] text-red-500">
                    Removal failed
                  </div>
                </div>
              ) : (
                <div className="grid h-full w-full grid-cols-2">
                  <ImgTile src={img.originalUrl} label="Before" />
                  <ImgTile src={img.processedUrl ?? img.originalUrl} label="After" checkered />
                </div>
              )}
              <button
                onClick={() => removeImage(img.id)}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow hover:text-imt-red"
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 px-2 py-1.5 text-center text-[11px] font-medium">
              {img.status === "processed" && <span className="text-emerald-600">✓ Background removed</span>}
              {img.status === "pending" && <span className="text-slate-400">Processing…</span>}
              {img.status === "failed" && (
                <>
                  <span className="text-red-600">Failed</span>
                  <button onClick={() => retryImage(img.id)} className="font-semibold text-imt-blue hover:underline">
                    Retry
                  </button>
                </>
              )}
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

function ImgTile({ src, label, checkered }: { src: string; label: string; checkered?: boolean }) {
  return (
    <div className={`relative flex flex-col items-center justify-center gap-1 ${checkered ? "bg-[conic-gradient(#e5eaf0_90deg,#fff_90deg_180deg,#e5eaf0_180deg_270deg,#fff_270deg)] bg-[length:12px_12px]" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label} className="h-full w-full object-contain p-1" />
      <span className="absolute bottom-0.5 left-0.5 rounded bg-white/80 px-1 text-[8px] font-semibold text-slate-500">
        {label}
      </span>
    </div>
  );
}
