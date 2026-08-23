# IMT Engineers — Next.js

Next.js 14 (App Router) + TypeScript + Tailwind CSS conversion of the IMT Engineers
ecommerce mockups. Product data is hardcoded local TypeScript — no backend required.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## What's built

| Route    | File                              | Notes |
| -------- | --------------------------------- | ----- |
| `/`      | `src/app/page.tsx`                | Home — hero, feature bar, categories, promise band, best sellers, installation, brand strip |
| `/shop`  | `src/app/shop/ShopClient.tsx`     | Listing with working sidebar filters, grid/list toggle, sort, mobile filter sheet |

Nav links to `/product/[slug]`, `/cart`, `/installation` etc. are wired but those routes
are not built yet — add them under `src/app/`.

## Responsive, not two designs

The mockups showed desktop and mobile as separate frames. Here each page is one responsive
component: mobile-first classes with `lg:` overrides at 1024px. The mobile tab bar
(`MobileTabs`) is hidden from `md` up; the desktop nav is hidden below `lg`.

## Filters actually work

`src/components/shop/useShopFilters.ts` owns all listing state — brand, AC type, capacity,
room size, energy rating, price range, and sort — and derives the filtered list plus the
applied-filter chips. `FilterSidebar` is a pure presentational consumer, rendered twice:
once in the desktop sidebar, once inside the mobile bottom sheet. Both share one state.

To move to a real backend, swap the `PRODUCTS` import in the hook for a fetch and lift the
filter state into the URL with `useSearchParams`.

## Design tokens

Brand colours live in `tailwind.config.ts` under `theme.extend.colors.brand`:

| Token | Hex | Used for |
| --- | --- | --- |
| `brand-blue` | `#1C75BC` | Primary actions, links, active nav |
| `brand-blue-dark` | `#123E63` | Gradient end on the category header |
| `brand-red` | `#ED1C24` | Button hover, eyebrow labels, destructive |
| `brand-orange` | `#F7941D` | Stars, savings, store-pickup accents |
| `brand-gold` / `brand-gold-light` / `brand-gold-dark` | `#C68A3F` / `#F5B642` / `#9C6C3C` | Wordmark gradient only |
| `brand-ink` | `#172B3A` | Headings, dark sections, footer |
| `brand-green` | `#2FA84F` | In-stock, best-seller badge |
| `ui-mist` | `#F5F7FA` | Section backgrounds |
| `ui-line` / `ui-border` | `#E8ECF1` / `#DDE4EA` | Card borders, inputs |

Type is Poppins via `next/font/google` (self-hosted at build, no layout shift). Icons are
Material Symbols Outlined loaded in `layout.tsx` and rendered through `<Icon name="..." />`.

## Images

Product photography is not included. Every image position renders `<Placeholder>`, a striped
box with a label. Replace it with `next/image`:

```tsx
<Image src={product.image} alt={product.name} fill className="object-cover" />
```

`public/home-hero.png` is the hero photo from the mockups. `public/logo.jpeg` is the logo on
a white background — swap in a transparent PNG or SVG when you have one, then the white
rounded box in `Logo.tsx` can go.

## Not yet converted

Product detail, cart, checkout (three directions were mocked, none picked), and order
confirmation. Those exist as HTML mockups in the parent project.
