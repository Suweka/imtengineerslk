import { Icon } from "@/components/ui/Icon";

const items = [
  { icon: "ac_unit", color: "#1C75BC", title: "Cooling Performance", subtitle: "Powerful & Fast Cooling" },
  { icon: "eco", color: "#2FA84F", title: "Energy Efficient", subtitle: "Save More on Bills" },
  { icon: "build", color: "#F7941D", title: "Expert Installation", subtitle: "Certified Technicians" },
  { icon: "verified_user", color: "#1C75BC", title: "Trusted Brands", subtitle: "100% Genuine Products" },
];

export function ValueProps() {
  return (
    <section className="relative px-0 lg:px-6">
      <div className="grid grid-cols-2 border-b border-slate-100 bg-white lg:grid-cols-4 lg:rounded-xl lg:border-0 lg:shadow-[0_6px_24px_rgba(23,43,58,.10)]">
        {items.map((item, i) => (
          <div
            key={item.title}
            className={`group flex animate-fade-in-up flex-col items-center gap-2 border-r border-t border-slate-100 p-[18px] text-center opacity-0 transition-colors duration-300 hover:bg-slate-50/70 lg:flex-row lg:gap-[15px] lg:border-0 lg:px-[26px] lg:py-[22px] lg:text-left ${
              i > 0 ? "lg:border-l lg:border-slate-100" : ""
            } ${i === items.length - 1 ? "max-lg:pr-14" : ""}`}
            style={{ animationDelay: `${300 + i * 80}ms` }}
          >
            <Icon
              name={item.icon}
              size={24}
              style={{ color: item.color }}
              className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
            />
            <div>
              <div className="text-xs font-medium leading-[1.5] text-[#172B3A] lg:text-[13.5px]">{item.title}</div>
              <div className="mt-0.5 text-[10.5px] text-[#8C9BA9] lg:text-[11.5px]">{item.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
