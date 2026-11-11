import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="midnight"]'],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        "paper-warm": "var(--paper-warm)",
        "paper-aged": "var(--paper-aged)",
        ink: "var(--ink)",
        "ink-light": "var(--ink-light)",
        "ink-muted": "var(--ink-muted)",
        teal: {
          DEFAULT: "var(--teal)",
          dark: "var(--teal-dark)",
          light: "var(--teal-light)",
        },
        rose: {
          DEFAULT: "var(--rose)",
          dark: "var(--rose-dark)",
          light: "var(--rose-light)",
        },
        mustard: {
          DEFAULT: "var(--mustard)",
          dark: "var(--mustard-dark)",
          light: "var(--mustard-light)",
        },
        vintage: {
          border: "var(--vintage-border)",
          card: "var(--vintage-card)",
          shadow: "var(--vintage-shadow)",
          tape: "var(--vintage-tape)",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Playfair Display", "serif"],
        body: ["var(--font-body)", "Lora", "serif"],
        typewriter: ["var(--font-typewriter)", "Special Elite", "Courier Prime", "monospace"],
        handwriting: ["var(--font-handwriting)", "Caveat", "cursive"],
      },
      boxShadow: {
        polaroid: "0 6px 16px -2px var(--vintage-shadow), 0 2px 6px -1px var(--vintage-shadow)",
        journal: "2px 4px 15px var(--vintage-shadow), 0 0 1px var(--vintage-border)",
        stamp: "0 2px 4px var(--vintage-shadow)",
      },
      keyframes: {
        pageTurn: {
          "0%": { transform: "rotateY(0deg)", opacity: "1" },
          "100%": { transform: "rotateY(-10deg)", opacity: "0.9" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "page-turn": "pageTurn 0.4s ease-in-out",
        "fade-in": "fadeIn 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
