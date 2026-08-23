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
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "product-frame": "0 2px 8px rgba(0, 0, 0, 0.05)",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.94)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bump: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.25)" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fadeIn 0.6s ease-out both",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both",
        bump: "bump 0.35s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
