type Item = { icon: React.ReactNode; title: string; subtitle: string };

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {children}
    </svg>
  );
}

export const trustItems: Item[] = [
  {
    title: "Free Delivery",
    subtitle: "Islandwide",
    icon: (
      <Icon>
        <path d="M3 16V6a1 1 0 011-1h9v11" />
        <path d="M13 9h4l4 4v3h-8" />
        <circle cx="7.5" cy="18.5" r="1.5" />
        <circle cx="17.5" cy="18.5" r="1.5" />
      </Icon>
    ),
  },
  {
    title: "2 Year Warranty",
    subtitle: "On All Products",
    icon: (
      <Icon>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </Icon>
    ),
  },
  {
    title: "100% Genuine",
    subtitle: "Trusted Brands",
    icon: (
      <Icon>
        <circle cx="12" cy="8" r="6" />
        <path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5" />
      </Icon>
    ),
  },
  {
    title: "24/7 Support",
    subtitle: "We're Here",
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </Icon>
    ),
  },
];

export const secureItems: Item[] = [
  {
    title: "Secure Payments",
    subtitle: "100% Secure & Safe",
    icon: (
      <Icon>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </Icon>
    ),
  },
  {
    title: "Easy Returns",
    subtitle: "7 Days Return Policy",
    icon: (
      <Icon>
        <path d="M3 12a9 9 0 109-9" />
        <path d="M3 4v6h6" />
      </Icon>
    ),
  },
  {
    title: "Customer Support",
    subtitle: "24/7 Support",
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4l2 2" />
      </Icon>
    ),
  },
  {
    title: "Price Guarantee",
    subtitle: "Best Prices in Sri Lanka",
    icon: (
      <Icon>
        <circle cx="12" cy="8" r="6" />
        <path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5" />
      </Icon>
    ),
  },
];

export function InfoBar({ items, tone = "light" }: { items: Item[]; tone?: "light" | "dark" }) {
  return (
    <div className={tone === "dark" ? "bg-imt-navy text-white" : "bg-imt-bg text-slate-900"}>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-6 sm:grid-cols-4 sm:px-6">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-3">
            <span className={tone === "dark" ? "text-imt-gold-end" : "text-imt-blue"}>{item.icon}</span>
            <div>
              <div className="text-sm font-bold">{item.title}</div>
              <div className={`text-xs ${tone === "dark" ? "text-slate-300" : "text-slate-500"}`}>{item.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
