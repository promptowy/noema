import preset from "@browser/config/tailwind";
import type { Config } from "tailwindcss";

export default {
  presets: [preset],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ]
} satisfies Config;
