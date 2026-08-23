const items = [
  { icon: SnowIcon, color: "#1C75BC", title: "Cooling Performance", subtitle: "Powerful & Fast Cooling" },
  { icon: LeafIcon, color: "#2FA84F", title: "Energy Efficient", subtitle: "Save More on Bills" },
  { icon: WrenchIcon, color: "#F7941D", title: "Expert Installation", subtitle: "Certified Technicians" },
  { icon: ShieldIcon, color: "#1C75BC", title: "Trusted Brands", subtitle: "100% Genuine Products" },
];

export function ValueProps() {
  return (
    <section className="relative px-0 lg:px-6">
      <div className="grid grid-cols-2 border-b border-slate-100 bg-white lg:grid-cols-4 lg:rounded-xl lg:border-0 lg:shadow-[0_6px_24px_rgba(23,43,58,.10)]">
        {items.map((item, i) => (
          <div
            key={item.title}
            className={`flex flex-col items-center gap-2 border-r border-t border-slate-100 p-[18px] text-center lg:flex-row lg:gap-[15px] lg:border-0 lg:px-[26px] lg:py-[22px] lg:text-left ${
              i > 0 ? "lg:border-l lg:border-slate-100" : ""
            }`}
          >
            <item.icon color={item.color} />
            <div>
              <div className="text-xs font-semibold text-slate-900 lg:text-[13.5px]">{item.title}</div>
              <div className="mt-0.5 text-[10.5px] text-slate-400 lg:text-[11.5px] lg:text-slate-500">
                {item.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SnowIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M12 2v20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1M2 12h20M6 6l3 3M18 6l-3 3M6 18l3-3M18 18l-3-3" />
    </svg>
  );
}
function LeafIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M11 20A7 7 0 019.8 6.1C15.5 5 20 5.5 20 5.5S20.5 10 19.4 15.7A7 7 0 0111 20z" />
      <path d="M2 21c4-4 8-6 12-10" />
    </svg>
  );
}
function WrenchIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94z" />
    </svg>
  );
}
function ShieldIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
