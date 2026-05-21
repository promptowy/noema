import type { Config } from "tailwindcss";

const preset = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05060a",
          900: "#090b12",
          850: "#0d1019",
          800: "#121624",
          700: "#1b2133",
          600: "#293147"
        },
        aurora: {
          blue: "#72ddff",
          cyan: "#66f4d5",
          violet: "#b79cff",
          rose: "#ff8ab3",
          amber: "#ffd166"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(102, 244, 213, 0.14)",
        panel: "0 16px 50px rgba(0, 0, 0, 0.36)"
      },
      backgroundImage: {
        "radial-aura":
          "radial-gradient(circle at 20% 10%, rgba(114, 221, 255, 0.22), transparent 26%), radial-gradient(circle at 80% 8%, rgba(255, 138, 179, 0.16), transparent 25%), linear-gradient(135deg, #05060a 0%, #0b101a 47%, #090b12 100%)"
      }
    }
  }
} satisfies Partial<Config>;

export default preset;
