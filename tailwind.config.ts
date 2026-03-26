import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-syne)"],
        body: ["var(--font-dm-sans)"],
        mono: ["var(--font-dm-mono)"]
      },
      colors: {
        snow: "#FAFAFA",
        mint: "#E7F1E9",
        grove: "#6CAA7D",
        forest: "#0A7227",
        ink: "#0A0A0F",
        surface: "#111118",
        panel: "#16161F",
        fence: "#1E1E2E",
        muted: "#2A2A3E",
        fog: "#8888AA",
        ghost: "#4A4A6A",
        chalk: "#F0F0FF",
        gold: "#FBBF24",
        rose: "#F87171",
        sky: "#6EE7B7"
      },
      borderRadius: {
        pill: "9999px"
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        shimmer: "shimmer 1.5s infinite"
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      }
    }
  },
  plugins: []
};

export default config;