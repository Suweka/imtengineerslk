import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { IcePlate } from "@/components/ui/IcePlate";
import { AirflowLines } from "@/components/ui/AirflowLines";

const heroCards = [
  { icon: "local_shipping", title: "Free Delivery", sub: "Islandwide" },
  { icon: "verified_user", title: "2 Year Warranty", sub: "On All Products" },
  { icon: "build", title: "Professional Install", sub: "Islandwide Service" },
];

export function Hero() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#F7F9FC] lg:h-[430px] lg:bg-[#DCEAF3]">
        <div
          className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat lg:block"
          style={{ backgroundImage: "url('/home-hero.png')" }}
        />
        <div className="absolute inset-0 hidden lg:block lg:bg-hero-fade" />
        <div className="pointer-events-none absolute -left-24 top-1/2 hidden h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-imt-blue/10 blur-3xl lg:block" />
        <AirflowLines className="hidden lg:block" />
        <div className="relative mx-auto h-full max-w-[1600px] px-4 sm:px-6 lg:flex lg:h-full lg:items-center">
          <div className="max-w-[470px] py-8 lg:max-w-[700px] lg:py-0">
            <p className="mb-3.5 animate-fade-in-up text-[13px] font-semibold opacity-0 lg:text-lg">
              <span className="text-imt-red">Stay Cool.</span> <span className="text-imt-blue">Stay Comfortable.</span>
            </p>
            <h1
              className="mb-3.5 animate-fade-in-up text-[27px] font-semibold leading-[1.2] text-[#0F3E6B] opacity-0 [animation-delay:80ms] lg:whitespace-nowrap lg:text-[44px] lg:leading-[1.14]"
            >
              Premium Air Conditioners
              <br />
              <span className="text-[22px] font-normal text-[#1E2B36] lg:text-[44px]">
                for Your Perfect Comfort
              </span>
            </h1>
            <p className="mb-5 max-w-[470px] animate-fade-in-up text-[13px] leading-[1.75] text-[#4A5A68] opacity-0 [animation-delay:160ms] lg:mb-[26px] lg:max-w-[600px] lg:text-sm lg:leading-[1.8]">
              Choose from the best brands with energy-efficient cooling, professional installation and
              reliable after-sales service.
            </p>
            <div className="flex animate-fade-in-up flex-wrap gap-3 opacity-0 [animation-delay:240ms]">
              <ButtonLink
                href="/shop"
                size="lg"
                className="h-11 px-6 text-base shadow-[0_0_0_0_rgba(28,117,188,0.5)] hover:shadow-[0_0_24px_4px_rgba(28,117,188,0.35)] lg:h-[56px] lg:px-8 lg:text-lg"
              >
                Shop Now <Icon name="arrow_forward" size={20} />
              </ButtonLink>
              <ButtonLink
                href="/shop?discount=true"
                size="lg"
                variant="outline"
                className="h-11 px-6 text-base lg:h-[56px] lg:px-8 lg:text-lg"
              >
                View Deals <Icon name="sell" size={18} />
              </ButtonLink>
            </div>
          </div>

          <div className="absolute right-4 top-10 hidden flex-col gap-3.5 sm:right-6 xl:flex">
            {heroCards.map((c, i) => (
              <IcePlate
                key={c.title}
                className="min-w-[196px] animate-scale-in opacity-0 !rounded-[10px]"
                style={{ animationDelay: `${300 + i * 100}ms` }}
              >
                <div className="flex items-center gap-3 py-3.5 pl-4 pr-[22px]">
                  <Icon name={c.icon} className="text-imt-blue" size={22} />
                  <div>
                    <div className="text-[13.5px] font-medium leading-[1.5] text-[#172B3A]">{c.title}</div>
                    <div className="mt-0.5 text-[11.5px] text-[#6B7A88]">{c.sub}</div>
                  </div>
                </div>
              </IcePlate>
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
