export function PreviewBanner({ children }: { children?: React.ReactNode }) {
  return (
    <div className="mx-6 mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
      <strong>Frontend preview.</strong>{" "}
      {children ?? "Changes here are held in local state only — nothing is saved to a database yet."}
    </div>
  );
}
