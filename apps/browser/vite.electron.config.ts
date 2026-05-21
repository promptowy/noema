import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "node22",
    outDir: "dist-electron",
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    lib: {
      entry: {
        main: "electron/main.ts",
        preload: "electron/preload.ts"
      },
      formats: ["cjs"]
    },
    rollupOptions: {
      external: (id) => id === "electron" || id.startsWith("node:"),
      output: {
        entryFileNames: "[name]/[name].cjs",
        chunkFileNames: "chunks/[name].cjs"
      }
    }
  }
});
