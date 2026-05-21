import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const viteCli = path.join(path.dirname(require.resolve("vite/package.json")), "bin", "vite.js");
const electronCli = path.join(path.dirname(require.resolve("electron/package.json")), "cli.js");
const devUrl = "http://127.0.0.1:5173";
const children = new Set();

function spawnChild(command, args, env = process.env) {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    env,
    stdio: "inherit"
  });
  children.add(child);
  child.on("exit", () => children.delete(child));
  return child;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForUrl(url, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      await delay(250);
    }
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function waitForFile(filePath, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      await access(filePath);
      return;
    } catch {
      await delay(250);
    }
  }
  throw new Error(`Timed out waiting for ${filePath}`);
}

function shutdown(code = 0) {
  for (const child of children) {
    child.kill();
  }
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

spawnChild(process.execPath, [viteCli, "build", "--config", "vite.electron.config.ts", "--watch"]);
spawnChild(process.execPath, [viteCli, "--config", "vite.renderer.config.ts"]);

await Promise.all([
  waitForFile("dist-electron/main/main.js"),
  waitForUrl(devUrl)
]);

const electron = spawnChild(process.execPath, [electronCli, "."], {
  ...process.env,
  VITE_DEV_SERVER_URL: devUrl
});

electron.on("exit", (code) => shutdown(code ?? 0));
