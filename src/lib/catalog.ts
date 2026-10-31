import catalog from "../../content/catalog.json";

export type Version = { n: number; file: string; note: string; date?: string };
export type Design = { slug: string; title: string; en: string; category: string; versions: Version[] };
export type Category = { id: string; name: string; en: string };

export const project = catalog.project;
export const categories: Category[] = catalog.categories;
// Versions listed in hiddenVersions stay on disk but are not shown or downloadable on the site.
const hidden: number[] = catalog.hiddenVersions;
export const designs: Design[] = catalog.designs.map((d) => ({ ...d, versions: d.versions.filter((v) => !hidden.includes(v.n)) }));

export const getDesign = (slug: string) => designs.find((d) => d.slug === slug);
export const latest = (d: Design) => d.versions.at(-1)!;
// Plain <img>/<a> paths don't get Next's basePath automatically.
export const asset = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${p}`;
export const previewSrc = (d: Design, v: Version, kind: "thumb" | "large") => asset(`/previews/${d.slug}-v${v.n}-${kind}.jpg`);
export const downloadHref = (d: Design, v: Version) => asset(`/files/${d.slug}-v${v.n}.${v.file.split(".").pop()}`);
export const downloadName = (d: Design, v: Version) => `SLSV2027-${d.en.replace(/\s+/g, "-")}-v${v.n}.${v.file.split(".").pop()}`;

export const versionLabels: Record<string, string> = catalog.versionLabels;
export const versionNumbers = [...new Set(designs.flatMap((d) => d.versions.map((v) => v.n)))].sort((a, b) => a - b);
// The version to show for a design: the selected one, or its newest if it doesn't have that version yet.
export const pickVersion = (d: Design, n: number) => d.versions.find((v) => v.n === n) ?? latest(d);
