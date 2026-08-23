import { ButtonLink } from "@/components/ui/Button";

const heroCards = [
  { icon: <TruckIcon />, title: "Free Delivery", sub: "Islandwide" },
  { icon: <ShieldIcon />, title: "2 Year Warranty", sub: "On All Products" },
  { icon: <WrenchIcon />, title: "Professional Install", sub: "Islandwide Service" },
];

export function Hero() {
  return (
    <>
      <section
        className="relative bg-[#DCEAF3] bg-cover bg-center bg-no-repeat lg:h-[430px]"
        style={{ backgroundImage: "url('/home-hero.png')" }}
      >
        <div className="absolute inset-0 bg-white/90 lg:bg-transparent lg:bg-hero-fade" />
        <div className="relative mx-auto h-full max-w-7xl px-4 sm:px-6 lg:flex lg:h-full lg:items-center">
          <div className="max-w-[470px] py-8 lg:py-0">
            <p className="mb-3.5 text-[13px] font-semibold lg:text-base">
              <span className="text-imt-red">Stay Cool.</span> <span className="text-imt-blue">Stay Comfortable.</span>
            </p>
            <h1 className="mb-3.5 text-[27px] font-semibold leading-[1.2] text-imt-navy lg:text-[44px] lg:leading-[1.14]">
              Premium Air Conditioners
              <br />
              <span className="text-[22px] font-normal text-slate-800 lg:text-[44px]">
                for Your Perfect Comfort
              </span>
            </h1>
            <p className="mb-5 max-w-[470px] text-[12.5px] leading-[1.75] text-slate-500 lg:mb-[26px] lg:text-sm">
              Choose from the best brands with energy-efficient cooling, professional installation and
              reliable after-sales service.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/shop" size="lg" className="h-11 lg:h-[50px]">
                Shop Now →
              </ButtonLink>
              <ButtonLink href="/shop?discount=true" size="lg" variant="outline" className="h-11 lg:h-[50px]">
                View Deals <TagIcon />
              </ButtonLink>
            </div>
          </div>

          <div className="absolute right-4 top-10 hidden flex-col gap-3.5 sm:right-6 xl:flex">
            {heroCards.map((c) => (
              <div
                key={c.title}
                className="flex min-w-[196px] items-center gap-3 rounded-[10px] bg-white py-3.5 pl-4 pr-[22px] shadow-lg"
              >
                <span className="text-imt-blue">{c.icon}</span>
                <div>
                  <div className="text-[13px] font-semibold text-imt-navy">{c.title}</div>
                  <div className="mt-0.5 text-[11.5px] text-slate-500">{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile hero image band */}
      <div
        className="h-[230px] bg-[#DCEAF3] bg-cover bg-no-repeat lg:hidden"
        style={{ backgroundImage: "url('/home-hero.png')", backgroundPosition: "62% 50%" }}
      />
    </>
  );
}

function TagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41L11 3.83A2 2 0 009.59 3.24H4a1 1 0 00-1 1v5.59a2 2 0 00.59 1.41l9.59 9.59a2 2 0 002.82 0l4.59-4.59a2 2 0 000-2.83z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 16V6a1 1 0 011-1h9v11" />
      <path d="M13 9h4l4 4v3h-8" />
      <circle cx="7.5" cy="18.5" r="1.5" />
      <circle cx="17.5" cy="18.5" r="1.5" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function WrenchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94z" />
    </svg>
  );
}
