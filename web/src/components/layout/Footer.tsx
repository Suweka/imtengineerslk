import Link from "next/link";
import { categories } from "@/data/categories";
import { siteSettings } from "@/data/testimonials";

export function Footer() {
  return (
    <footer className="bg-imt-navy text-slate-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-imt-gold text-xs font-black text-imt-navy">
              IMT
            </span>
            <span className="text-lg font-extrabold text-white">
              IMT <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-400">Engineers</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Air conditioning sales, installation and after-sales service across Sri Lanka since {siteSettings.foundedYear}.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">Shop</h4>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/shop/${c.slug}`} className="hover:text-white">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/installation" className="hover:text-white">Installation</Link></li>
            <li><Link href="/services" className="hover:text-white">Services &amp; AMC</Link></li>
            <li><Link href="/brands" className="hover:text-white">Brands</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">Get in touch</h4>
          <ul className="space-y-3 text-sm">
            <li>{siteSettings.headOfficeAddress}</li>
            <li>{siteSettings.engineeringDeptAddress}</li>
            <li>{siteSettings.businessHours.weekdays}<br />{siteSettings.businessHours.saturday}, Sun closed</li>
            <li><a href={`tel:${siteSettings.phone}`} className="font-semibold text-white hover:underline">{siteSettings.phone}</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-slate-400 sm:flex-row sm:px-6">
          <span>&copy; {new Date().getFullYear()} IMT Engineers (Pvt) Ltd. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <span>Pay at store</span>
            <span className="rounded bg-white/10 px-2 py-1 font-semibold text-white">Cash</span>
            <span className="rounded bg-white/10 px-2 py-1 font-semibold text-white">Visa</span>
            <span className="rounded bg-white/10 px-2 py-1 font-semibold text-white">Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
