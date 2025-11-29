import { build } from "tsup";
import { execSync } from "node:child_process";
import { mkdirSync, cpSync, readFileSync, existsSync } from "node:fs";

// Get all dependencies to mark as external
const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
const allDeps = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
];

// 1) Build backend
await build({
  entry: ["server/index.ts"],
  clean: true,
  outDir: "dist",
  format: ["cjs"],
  platform: "node",
  target: "node20",
  external: [...allDeps, "./vite", "../vite.config"],
  skipNodeModulesBundle: true,
  treeshake: true,
  esbuildOptions(options) {
    options.conditions = ["node"];
  },
});

// 2) Build frontend using Vite (outputs to dist/public directly)
console.log("Building frontend...");
execSync("vite build", { stdio: "inherit" });

// 3) Copy public folder if it exists
if (existsSync("public")) {
  console.log("Copying public folder to dist/public...");
  mkdirSync("dist/public", { recursive: true });
  cpSync("public", "dist/public", { recursive: true });
}

console.log("Build completed successfully!");
