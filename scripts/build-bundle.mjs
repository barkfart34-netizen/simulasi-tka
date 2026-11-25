import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const distDir = path.join(root, "dist");
const publicDir = path.join(root, "public");

fs.mkdirSync(distDir, { recursive: true });

// 1. Collect public static assets
const mimeMap = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
};

const assets = {};
function walk(dir, prefix = "") {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) {
      walk(full, rel);
    } else {
      const ext = path.extname(entry.name);
      assets[rel] = {
        content: fs.readFileSync(full, "utf8"),
        contentType: mimeMap[ext] || "application/octet-stream",
      };
    }
  }
}
walk(publicDir);

// 2. Compile TypeScript with tsc to dist/tsc
const tscOut = path.join(distDir, "tsc");
fs.rmSync(tscOut, { recursive: true, force: true });
execSync(
  `npx tsc --noEmit false --outDir dist/tsc`,
  { stdio: "inherit" }
);

// 3. Emit standalone assets module for Cloudflare multi-module Worker upload
const assetsModulePath = path.join(tscOut, "bundled-assets.js");
fs.writeFileSync(
  assetsModulePath,
  `export const BUNDLED_ASSETS = ${JSON.stringify(assets)};\n`,
  "utf8"
);

// 4. Emit entry wrapper that wires globalThis.__BUNDLED_STATIC_ASSETS__
const entryPath = path.join(tscOut, "entry.js");
fs.writeFileSync(
  entryPath,
  `import { BUNDLED_ASSETS } from "./bundled-assets.js";\nimport worker from "./worker.js";\nglobalThis.__BUNDLED_STATIC_ASSETS__ = BUNDLED_ASSETS;\nexport default worker;\n`,
  "utf8"
);

// Fix relative imports without .js extensions in tsc output
for (const file of fs.readdirSync(tscOut)) {
  if (!file.endsWith(".js")) continue;
  const p = path.join(tscOut, file);
  let code = fs.readFileSync(p, "utf8");
  code = code.replace(/from\s+["'](\.\/[^"']+?)(?<!\.js)["']/g, 'from "$1.js"');
  fs.writeFileSync(p, code, "utf8");
}

console.log("Build complete! Files in dist/tsc:", fs.readdirSync(tscOut));
