import { build } from "vite";

await build({ configFile: "vite.electron.config.ts" });
await build({ configFile: "vite.renderer.config.ts" });
