import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1C75BC",
          "blue-dark": "#123E63",
          cyan: "#00A4E4",
          red: "#ED1C24",
          orange: "#F7941D",
          gold: "#C68A3F",
          "gold-light": "#F5B642",
          "gold-dark": "#9C6C3C",
          ink: "#172B3A",
          green: "#2FA84F",
        },
        ui: {
          text: "#333333",
          muted: "#6B7A88",
          faint: "#8C9BA9",
          line: "#E8ECF1",
          border: "#DDE4EA",
          mist: "#F5F7FA",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 6px 24px rgba(23,43,58,.10)",
        float: "0 6px 20px rgba(23,43,58,.13)",
      },
      backgroundImage: {
        "gold-text": "linear-gradient(180deg,#C68A3F,#F5B642 48%,#9C6C3C)",
        "hero-fade":
          "linear-gradient(90deg,rgba(255,255,255,.94) 0%,rgba(255,255,255,.82) 34%,rgba(255,255,255,0) 56%)",
      },
    },
  },
  plugins: [],
};
export default config;
