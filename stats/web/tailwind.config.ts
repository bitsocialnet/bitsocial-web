import type { Config } from "tailwindcss";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

// Colors resolve to the CSS variables in src/index.css, which switch with the color scheme.
export default {
  content: [path.resolve(__dirname, "index.html"), path.resolve(__dirname, "src/**/*.{ts,tsx}")],
  theme: {
    extend: {
      colors: {
        bg: token("bg"),
        rail: token("rail"),
        panel: token("panel"),
        raised: token("raised"),
        ink: token("ink"),
        "ink-2": token("ink-2"),
        "ink-3": token("ink-3"),
        line: token("line"),
        accent: token("accent"),
        "accent-strong": token("accent-strong"),
        network: token("network"),
        "client-5chan": token("client-5chan"),
        "client-seedit": token("client-seedit"),
        up: token("up"),
        down: token("down"),
        partial: token("partial"),
        unknown: token("unknown"),
      },
      fontFamily: {
        display: ["Exo", "sans-serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
      screens: {
        xs: "420px",
      },
    },
  },
} satisfies Config;
