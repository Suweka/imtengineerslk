import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        imt: {
          blue: "#1C75BC",
          navy: "#1a3f8c",
          red: "#ED1C24",
          "gold-start": "#F5B642",
          "gold-end": "#F58220",
          bg: "#F7F9FC",
        },
      },
      backgroundImage: {
        "imt-gold": "linear-gradient(135deg, #F5B642 0%, #F58220 100%)",
        "hero-fade":
          "linear-gradient(90deg,rgba(255,255,255,.94) 0%,rgba(255,255,255,.82) 34%,rgba(255,255,255,0) 56%)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "product-frame": "0 2px 8px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
