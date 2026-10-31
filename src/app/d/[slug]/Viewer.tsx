"use client";

import { type Design, downloadHref, downloadName, pickVersion, previewSrc, versionLabels } from "@/lib/catalog";
import { useVersion } from "@/components/VersionContext";

export function Viewer({ design }: { design: Design }) {
  const { version: selected } = useVersion();
  const version = pickVersion(design, selected);
  const large = previewSrc(design, version, "large");

  return (
    <>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{design.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {design.en} · {versionLabels[version.n]}
          </p>
        </div>
        <div className="flex gap-2">
          <a href={large} target="_blank" rel="noreferrer" className="btn-ghost">
            查看大图
          </a>
          <a href={downloadHref(design, version)} download={downloadName(design, version)} className="btn-primary">
            下载原图
          </a>
        </div>
      </div>

      <div className="flex h-[72vh] min-h-[360px] items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface p-4 md:p-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={large} src={large} alt={design.title} className="max-h-full max-w-full object-contain" />
      </div>
    </>
  );
}
