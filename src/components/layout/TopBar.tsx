import { siteSettings } from "@/data/testimonials";
import { formatLKRShort } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";

export function TopBar() {
  return (
    <div className="bg-imt-blue px-4 py-2 text-xs text-white sm:px-6">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Icon name="local_shipping" size={14} />
          <span>Free Delivery for Orders Over {formatLKRShort(siteSettings.freeDeliveryThreshold)}</span>
        </div>
        <div className="hidden items-center gap-4 sm:flex">
          <a href={`tel:${siteSettings.phone}`} className="flex items-center gap-1.5 hover:underline">
            <Icon name="call" size={14} /> {siteSettings.phone}
          </a>
          <a href={`mailto:${siteSettings.email}`} className="hidden items-center gap-1.5 hover:underline sm:flex">
            <Icon name="mail" size={14} /> {siteSettings.email}
          </a>
          <span className="hidden items-center gap-2.5 opacity-90 sm:flex">
            <Icon name="language" size={14} />
            <Icon name="photo_camera" size={14} />
            <Icon name="chat_bubble" size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}
