import Link from "next/link";
import Icon from "@/components/Icon";
import Placeholder from "@/components/Placeholder";
import ProductCard from "@/components/ProductCard";
import {
  BRANDS,
  CATEGORIES,
  HERO_CARDS,
  HOME_FEATURES,
  HOME_PROMISE,
  INSTALL_POINTS,
  STORE,
} from "@/data/site";
import { BEST_SELLERS } from "@/data/products";

export default function HomePage() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section
        className="relative bg-[#DCEAF3] bg-cover bg-center bg-no-repeat lg:h-[430px]"
        style={{ backgroundImage: "url('/home-hero.png')" }}
      >
        <div className="absolute inset-0 bg-white/90 lg:bg-hero-fade" />
        <div className="relative max-w-[660px] px-4 pb-8 pt-8 lg:px-[34px] lg:pb-0 lg:pt-14">
          <p className="mb-3.5 text-[13px] font-semibold lg:text-base">
            <span className="text-brand-red">Stay Cool.</span>{" "}
            <span className="text-brand-blue">Stay Comfortable.</span>
          </p>
          <h1 className="mb-3.5 text-[27px] font-semibold leading-[1.2] text-[#0F3E6B] lg:text-[44px] lg:leading-[1.14]">
            Premium Air Conditioners
            <br />
            <span className="text-[22px] font-normal text-[#1E2B36] lg:text-[44px]">
              for Your Perfect Comfort
            </span>
          </h1>
          <p className="mb-5 max-w-[470px] text-[12.5px] leading-[1.75] text-[#4A5A68] lg:mb-[26px] lg:text-sm">
            Choose from the best brands with energy-efficient cooling, professional installation and
            reliable after-sales service.
          </p>
          <div className="flex gap-3">
            <Link
              href="/shop"
              className="flex h-11 items-center gap-2.5 rounded-[7px] bg-brand-blue px-5 text-[13px] font-semibold text-white no-underline transition-colors hover:bg-brand-red hover:text-white lg:h-[50px] lg:rounded-lg lg:px-[26px] lg:text-[14.5px]"
            >
              Shop Now
              <Icon name="arrow_forward" size={19} />
            </Link>
            <Link
              href="/shop?sort=deals"
              className="flex h-11 items-center gap-2.5 rounded-[7px] border border-ui-border bg-white px-[18px] text-[13px] font-semibold text-brand-ink no-underline hover:border-brand-blue hover:text-brand-ink lg:h-[50px] lg:rounded-lg lg:px-6 lg:text-[14.5px]"
            >
              View Deals
              <Icon name="sell" size={18} className="text-brand-blue" />
            </Link>
          </div>
        </div>

        <div className="absolute right-[34px] top-[52px] hidden flex-col gap-3.5 xl:flex">
          {HERO_CARDS.map((c) => (
            <div
              key={c.title}
              className="flex min-w-[196px] items-center gap-3 rounded-[10px] bg-white py-3.5 pl-4 pr-[22px] shadow-float"
            >
              <Icon name={c.icon} size={24} className="text-brand-blue" />
              <div>
                <div className="text-[13px] font-semibold text-brand-ink">{c.title}</div>
                <div className="mt-0.5 text-[11.5px] text-ui-muted">{c.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile hero image band */}
      <div
        className="h-[230px] bg-[#DCEAF3] bg-cover bg-no-repeat lg:hidden"
        style={{ backgroundImage: "url('/home-hero.png')", backgroundPosition: "62% 50%" }}
      />

      {/* ---------- Feature bar ---------- */}
      <section className="relative px-0 lg:-mt-[38px] lg:px-[34px]">
        <div className="grid grid-cols-2 border-b border-ui-line bg-white lg:grid-cols-4 lg:rounded-[10px] lg:border-0 lg:shadow-card">
          {HOME_FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`flex flex-col items-center gap-2 border-t border-r border-[#F0F3F6] p-[18px] text-center lg:flex-row lg:gap-[15px] lg:border-0 lg:px-[26px] lg:py-[22px] lg:text-left ${
                i > 0 ? "lg:border-l lg:border-[#EEF1F4]" : ""
              }`}
            >
              <Icon name={f.icon} size={24} style={{ color: f.color }} className="lg:!text-[26px]" />
              <div>
                <div className="text-xs font-semibold text-brand-ink lg:text-[13.5px]">{f.title}</div>
                <div className="mt-0.5 text-[10.5px] text-ui-faint lg:text-[11.5px] lg:text-ui-muted">
                  {f.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Categories ---------- */}
      <section className="px-4 py-8 text-center lg:px-[34px] lg:pb-[50px] lg:pt-[46px]">
        <div className="mb-1.5 text-[10.5px] font-semibold tracking-[1.3px] text-brand-red lg:text-[11.5px] lg:tracking-[1.4px]">
          BROWSE CATEGORIES
        </div>
        <h2 className="mb-2.5 text-[21px] font-semibold text-brand-ink lg:mb-3 lg:text-[30px]">
          Shop Air Conditioners
        </h2>
        <div className="mb-5 flex justify-center gap-1.5 lg:mb-[34px]">
          <span className="h-[3px] w-8 rounded-sm bg-brand-blue lg:w-9" />
          <span className="h-[3px] w-8 rounded-sm bg-brand-red lg:w-9" />
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border border-[#E1E7ED] bg-white lg:flex">
            <Icon name="chevron_left" size={20} className="text-ui-muted" />
          </button>

          <div className="grid flex-1 grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-4">
            {CATEGORIES.map((c, i) => (
              <Link
                key={c.slug}
                href={"/shop?category=" + c.slug}
                className={`overflow-hidden rounded-[9px] border border-ui-line bg-white no-underline transition-shadow hover:shadow-card lg:rounded-[10px] ${
                  i === 4 ? "col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="h-24 bg-ui-mist lg:h-[132px]">
                  <Placeholder label={c.image} />
                </div>
                <div className="px-2.5 pb-3 pt-3 lg:px-3 lg:pb-[17px] lg:pt-[15px]">
                  <div className="text-xs font-medium text-brand-ink lg:text-[13.5px]">{c.name}</div>
                  <div className="my-1.5 text-[10.5px] text-ui-faint lg:text-[11.5px]">
                    From {c.from}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-[11.5px] font-medium text-brand-blue lg:text-[12.5px]">
                    Shop Now
                    <Icon name="arrow_forward" size={15} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button className="hidden h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border border-[#E1E7ED] bg-white lg:flex">
            <Icon name="chevron_right" size={20} className="text-ui-muted" />
          </button>
        </div>
      </section>

      {/* ---------- Dark promise band ---------- */}
      <section className="px-4 pb-7 lg:px-[34px] lg:pb-[50px]">
        <div className="grid grid-cols-2 rounded-[10px] bg-brand-ink lg:grid-cols-4">
          {HOME_PROMISE.map((p, i) => (
            <div
              key={p.title}
              className={`flex items-center gap-3 p-[15px] lg:gap-[15px] lg:px-7 lg:py-[26px] ${
                i > 0 ? "lg:border-l lg:border-white/10" : ""
              }`}
            >
              <Icon name={p.icon} size={22} className="text-white lg:!text-[26px]" />
              <div>
                <div className="text-[11.5px] font-semibold text-white lg:text-[13.5px]">
                  {p.title}
                </div>
                <div className="mt-0.5 text-[10px] text-[#A8B6C3] lg:text-[11.5px]">{p.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Best sellers ---------- */}
      <section className="bg-ui-mist px-4 py-7 lg:px-[34px] lg:pb-[52px] lg:pt-12">
        <div className="mb-4 flex items-end justify-between lg:mb-[26px]">
          <div>
            <div className="mb-1.5 hidden text-[11.5px] font-semibold tracking-[1.4px] text-brand-red lg:block">
              THIS MONTH
            </div>
            <h2 className="text-lg font-semibold text-brand-ink lg:text-[28px]">
              Best Selling Inverter ACs
            </h2>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-2 text-[11.5px] font-medium text-brand-blue no-underline lg:h-11 lg:rounded-lg lg:border lg:border-ui-border lg:bg-white lg:px-5 lg:text-[13px] lg:font-semibold lg:text-brand-ink"
          >
            <span className="lg:hidden">View all →</span>
            <span className="hidden lg:inline">View all products</span>
            <Icon name="arrow_forward" size={18} className="hidden text-brand-blue lg:block" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-[18px]">
          {BEST_SELLERS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ---------- Installation ---------- */}
      <section className="grid items-center gap-8 px-4 py-8 lg:grid-cols-2 lg:gap-10 lg:px-[34px] lg:pb-14 lg:pt-[52px]">
        <div className="order-2 h-[170px] overflow-hidden rounded-[10px] bg-ui-mist lg:order-1 lg:hidden lg:h-[320px]">
          <Placeholder label="Technician installing a unit" />
        </div>
        <div className="order-1 lg:order-1">
          <div className="mb-2 text-[10.5px] font-semibold tracking-[1.2px] text-brand-red lg:mb-2.5 lg:text-[11.5px] lg:tracking-[1.4px]">
            INSTALLATION &amp; SERVICE
          </div>
          <h2 className="mb-3 text-xl font-semibold leading-[1.3] text-brand-ink lg:mb-3.5 lg:text-[30px] lg:leading-[1.25]">
            Fitted by our own engineers,
            <br className="hidden lg:block" /> not a subcontractor.
          </h2>
          <p className="mb-4 max-w-[470px] text-xs leading-[1.8] text-[#4A5A68] lg:mb-6 lg:text-[13.5px]">
            Every unit we sell can be installed by an IMT-certified team, islandwide, within three
            working days. Annual maintenance contracts keep it running at rated efficiency.
          </p>
          <ul className="mb-6 flex list-none flex-col gap-3 p-0 lg:mb-7">
            {INSTALL_POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-[12px] text-brand-ink lg:text-[13px]">
                <Icon name="check_circle" size={19} className="text-brand-green" />
                {p}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/installation"
              className="flex h-11 items-center justify-center gap-2 rounded-[7px] bg-brand-blue px-6 text-[13px] font-semibold text-white no-underline transition-colors hover:bg-brand-red hover:text-white lg:h-12 lg:rounded-lg lg:text-sm"
            >
              Book an installation
              <Icon name="arrow_forward" size={19} />
            </Link>
            <a
              href={"tel:" + STORE.phone.replace(/\s/g, "")}
              className="flex h-11 items-center justify-center gap-2 rounded-[7px] border border-ui-border px-[22px] text-[13px] font-semibold text-brand-ink no-underline hover:border-brand-blue hover:text-brand-ink lg:h-12 lg:rounded-lg lg:text-sm"
            >
              <Icon name="call" size={19} className="text-brand-blue" />
              {STORE.phone}
            </a>
          </div>
        </div>
        <div className="order-3 hidden h-[320px] overflow-hidden rounded-xl bg-ui-mist lg:block">
          <Placeholder label="Technician installing a unit" />
        </div>
      </section>

      {/* ---------- Brand strip ---------- */}
      <section className="border-t border-ui-line bg-ui-mist px-4 py-10 text-center lg:px-[34px] lg:pb-11">
        <div className="mb-[26px] text-xs font-semibold tracking-[1.2px] text-ui-faint">
          AUTHORISED DEALER FOR
        </div>
        <div className="grid grid-cols-3 gap-3 lg:grid-cols-6 lg:gap-[18px]">
          {BRANDS.map((b) => (
            <div
              key={b}
              className="h-16 overflow-hidden rounded-[9px] border border-ui-line bg-white"
            >
              <Placeholder label={b} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
