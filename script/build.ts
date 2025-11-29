import { build } from "tsup";
import { execSync } from "node:child_process";
import { mkdirSync, cpSync, existsSync } from "node:fs";

console.log("Building backend...");
await build({
  entry: ["server/index.ts"],
  clean: true,
  outDir: "dist",
  format: ["cjs"],
});

console.log("Building frontend...");
execSync("npm --prefix client run build", { stdio: "inherit" });

// Ensure dist/public exists
mkdirSync("dist/public", { recursive: true });

// Copy static files if exist
if (existsSync("client/dist")) {
  console.log("Copying frontend dist to dist/public...");
  cpSync("client/dist", "dist/public", { recursive: true });
} else {
  console.log("No frontend build found in client/dist");
}
