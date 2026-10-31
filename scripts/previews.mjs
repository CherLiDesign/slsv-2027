// Builds the site's static assets from content/catalog.json (originals are 8K PNGs):
//   public/previews/<slug>-v<n>-{thumb,large}.jpg  web-sized previews (macOS `sips`)
//   public/files/<slug>-v<n>.<ext>                 full-resolution download
// Versions listed in hiddenVersions are skipped and any old copies removed, so they never get published.
import { execFileSync } from "child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from "fs";
import path from "path";

const root = process.cwd();
const catalog = JSON.parse(readFileSync(path.join(root, "content/catalog.json"), "utf8"));
const hidden = catalog.hiddenVersions ?? [];
const previews = path.join(root, "public/previews");
const files = path.join(root, "public/files");
mkdirSync(previews, { recursive: true });
mkdirSync(files, { recursive: true });

const SIZES = { thumb: 900, large: 2400 };
const fresh = (dest, src) => existsSync(dest) && statSync(dest).mtimeMs > statSync(src).mtimeMs;
const keep = new Set();

for (const d of catalog.designs) {
  for (const v of d.versions) {
    if (hidden.includes(v.n)) continue;
    const src = path.join(root, v.file);
    for (const [kind, px] of Object.entries(SIZES)) {
      const name = `${d.slug}-v${v.n}-${kind}.jpg`;
      keep.add(name);
      const dest = path.join(previews, name);
      if (fresh(dest, src)) continue;
      execFileSync("sips", ["-Z", String(px), "-s", "format", "jpeg", "-s", "formatOptions", "82", src, "--out", dest], {
        stdio: "ignore",
      });
      console.log("✓", name);
    }
    const name = `${d.slug}-v${v.n}${path.extname(v.file)}`;
    keep.add(name);
    const dest = path.join(files, name);
    if (!fresh(dest, src)) copyFileSync(src, dest);
  }
}

// Opening animation: publish redesign/intro.html with the files it needs.
const intro = path.join(root, "public/intro");
mkdirSync(path.join(intro, "assets"), { recursive: true });
copyFileSync(path.join(root, "redesign/intro.html"), path.join(intro, "index.html"));
for (const f of ["shared.css", "shared.js"]) copyFileSync(path.join(root, "redesign", f), path.join(intro, f));
for (const f of readdirSync(path.join(root, "redesign/assets")).filter((f) => f.endsWith(".png"))) copyFileSync(path.join(root, "redesign/assets", f), path.join(intro, "assets", f));

for (const dir of [previews, files]) {
  for (const f of readdirSync(dir)) if (!keep.has(f)) rmSync(path.join(dir, f));
}
