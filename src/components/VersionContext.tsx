"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { versionLabels, versionNumbers } from "@/lib/catalog";

const KEY = "slsv:version";
const newest = versionNumbers.at(-1)!;

const VersionContext = createContext<{ version: number; setVersion: (n: number) => void }>({
  version: newest,
  setVersion: () => {},
});

// Site-wide version switch: every card and detail page shows the same version, remembered per browser.
export function VersionProvider({ children }: { children: React.ReactNode }) {
  const [version, setState] = useState(newest);
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(KEY));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (versionNumbers.includes(saved)) setState(saved);
    } catch {}
  }, []);
  const setVersion = (n: number) => {
    setState(n);
    try {
      localStorage.setItem(KEY, String(n));
    } catch {}
  };
  return <VersionContext.Provider value={{ version, setVersion }}>{children}</VersionContext.Provider>;
}

export const useVersion = () => useContext(VersionContext);

export function VersionToggle() {
  const { version, setVersion } = useVersion();
  if (versionNumbers.length === 1) {
    const n = versionNumbers[0];
    return (
      <div className="inline-flex rounded-full border border-line bg-surface p-1">
        <span className="rounded-full bg-foreground px-4 py-1.5 text-sm text-background">{versionLabels[n]}</span>
      </div>
    );
  }
  return (
    <div className="inline-flex rounded-full border border-line bg-surface p-1" role="tablist" aria-label="切换版本">
      {versionNumbers.map((n) => (
        <button
          key={n}
          role="tab"
          aria-selected={n === version}
          onClick={() => setVersion(n)}
          className={`rounded-full px-4 py-1.5 text-sm transition ${
            n === version ? "bg-foreground text-background" : "text-muted hover:text-foreground"
          }`}
        >
          <span className="font-mono font-medium">V{n}</span>
          <span className="ml-1.5 hidden sm:inline">{versionLabels[n]}</span>
        </button>
      ))}
    </div>
  );
}
