import { build } from "tsup";
import { execSync } from "node:child_process";
import { mkdirSync, cpSync, existsSync, readFileSync } from "node:fs";

// Get all dependencies to mark as external
const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
const allDeps = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
];

console.log("Building backend...");
await build({
  entry: ["server/index.ts"],
  clean: true,
  outDir: "dist",
  format: ["cjs"],
  platform: "node",
  target: "node20",
  external: [...allDeps, "./vite", "../vite.config"],
  skipNodeModulesBundle: true,
});

console.log("Building frontend...");
execSync("vite build", { stdio: "inherit" });

console.log("Build completed successfully!");
