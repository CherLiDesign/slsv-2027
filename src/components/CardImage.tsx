"use client";

import { type Design, pickVersion, previewSrc } from "@/lib/catalog";
import { useVersion } from "./VersionContext";

export function CardImage({ design }: { design: Design }) {
  const { version } = useVersion();
  const v = pickVersion(design, version);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={previewSrc(design, v, "thumb")} alt={design.title} loading="lazy" className="max-h-full max-w-full object-contain" />
  );
}
