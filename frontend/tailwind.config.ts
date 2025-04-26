
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: {
          DEFAULT: "#202020",
          secondary: "#333533", // Add secondary background color
        },
        foreground: "#d6d6d6",
        primary: {
          DEFAULT: "#f48c06",
          light: "#f48c06",
        },
        border: {
          DEFAULT: "#333533",
        },
        muted: {
          DEFAULT: "#333533",
          foreground: "#d6d6d6",
        },
        secondary: {
          DEFAULT: "#333533", // Explicitly define secondary color
          foreground: "#d6d6d6",
        },
        accent: {
          DEFAULT: "#f48c06",
          foreground: "#202020",
        },
        card: {
          DEFAULT: "#333533",
          foreground: "#d6d6d6",
        },
        popover: {
          DEFAULT: "#333533",
          foreground: "#d6d6d6",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "calc(0.75rem - 2px)",
        sm: "calc(0.75rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "subtle-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "subtle-pulse": "subtle-pulse 2s ease-in-out infinite",
      },
      boxShadow: {
        "glass-input": "0 4px 6px rgba(0, 0, 0, 0.1)",
        "glass-card": "0 8px 32px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

