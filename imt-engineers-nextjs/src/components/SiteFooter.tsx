import Link from "next/link";
import Icon from "./Icon";
import Logo from "./Logo";
import { FOOTER_COLUMNS, STORE, TRUST_BAR } from "@/data/site";

export default function SiteFooter() {
  return (
    <footer>
      <div className="grid grid-cols-2 gap-6 border-t border-ui-line bg-ui-mist px-4 py-6 lg:grid-cols-4 lg:px-[34px]">
        {TRUST_BAR.map((t) => (
          <div key={t.title} className="flex items-center justify-center gap-3">
            <Icon name={t.icon} size={26} className="text-brand-blue" />
            <div>
              <div className="text-[13px] font-semibold text-brand-ink">{t.title}</div>
              <div className="text-[11.5px] text-ui-muted">{t.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-brand-ink px-4 pt-11 text-white lg:px-[34px]">
        <div className="grid gap-11 pb-9 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
          <div>
            <div className="mb-4 [&_a]:no-underline">
              <Logo />
            </div>
            <p className="mb-[18px] max-w-[290px] text-[12.5px] leading-[1.75] text-[#A8B6C3]">
              Air conditioning sales, installation and after-sales service across Sri Lanka.
              Authorised dealer for leading inverter brands.
            </p>
            <div className="flex gap-2.5">
              {["public", "photo_camera", "chat", "play_circle"].map((s) => (
                <span
                  key={s}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10"
                >
                  <Icon name={s} size={17} />
                </span>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="mb-4 text-[13px] font-semibold">{col.title}</div>
              <div className="flex flex-col gap-[11px]">
                {col.links.map((l) => (
                  <Link
                    key={l}
                    href="/shop"
                    className="text-[12.5px] text-[#A8B6C3] no-underline hover:text-white"
                  >
                    {l}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <div className="mb-4 text-[13px] font-semibold">Visit our showroom</div>
            <div className="mb-3 flex gap-2.5">
              <Icon name="location_on" size={18} className="text-brand-orange" />
              <div className="text-[12.5px] leading-[1.7] text-[#A8B6C3]">
                {STORE.addressLines.map((l) => (
                  <div key={l}>{l}</div>
                ))}
              </div>
            </div>
            <div className="mb-3 flex gap-2.5">
              <Icon name="schedule" size={18} className="text-brand-orange" />
              <div className="text-[12.5px] leading-[1.7] text-[#A8B6C3]">
                {STORE.hours.map((h) => (
                  <div key={h}>{h}</div>
                ))}
              </div>
            </div>
            <div className="flex gap-2.5">
              <Icon name="call" size={18} className="text-brand-orange" />
              <div className="text-[13px] font-semibold text-white">{STORE.phone}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-5 text-[11.5px] text-[#8C9BA9] lg:flex-row">
          <div>© {new Date().getFullYear()} IMT Engineers (Pvt) Ltd. All rights reserved.</div>
          <div className="flex items-center gap-2.5">
            <span>Pay at store</span>
            {["Cash", "Visa", "Mastercard"].map((m) => (
              <span key={m} className="rounded bg-white/10 px-2.5 py-1 font-medium text-white">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
