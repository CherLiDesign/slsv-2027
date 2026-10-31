// Renders redesign/*.html to PNG with headless Chrome.
// Usage: node scripts/render.mjs [scale=4] [outDir=versions] [filter]
//   Output: <outDir>/<slug>/v2.png, where slug comes from the file's entry in MAP below.
import { execFileSync } from "child_process";
import { mkdirSync, readFileSync, readdirSync } from "fs";
import path from "path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const root = process.cwd();
// Optional 4th arg renders every page as that version (adds ?v=<n>), e.g. 4 for the photo version.
const [scale = "4", outDir = "versions", filter = "", forceVersion = ""] = process.argv.slice(2);
const MAP = JSON.parse(readFileSync(path.join(root, "redesign/map.json"), "utf8"));

for (const file of readdirSync(path.join(root, "redesign")).filter((f) => f.endsWith(".html")).sort()) {
  if ((filter && !file.includes(filter)) || !MAP[file]) continue;
  const { slug } = MAP[file];
  const version = forceVersion || MAP[file].version;
  const html = readFileSync(path.join(root, "redesign", file), "utf8");
  const w = +html.match(/--w:\s*(\d+)px/)[1];
  const h = +html.match(/--h:\s*(\d+)px/)[1];
  const dir = path.resolve(root, outDir, slug);
  mkdirSync(dir, { recursive: true });
  const out = path.join(dir, `v${version}.png`);
  execFileSync(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--allow-file-access-from-files",
    `--window-size=${w},${h}`,
    `--force-device-scale-factor=${scale}`,
    "--virtual-time-budget=6000",
    `--screenshot=${out}`,
    `file://${path.join(root, "redesign", file)}${forceVersion ? `?v=${forceVersion}` : ""}`,
  ], { stdio: "ignore" });
  console.log("✓", path.relative(root, out), `${w * scale}×${h * scale}`);
}
