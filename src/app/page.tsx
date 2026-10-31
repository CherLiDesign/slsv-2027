import Link from "next/link";
import { asset, categories, designs, project } from "@/lib/catalog";
import { CardImage } from "@/components/CardImage";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <section className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{project.name}</h1>
        <p className="mt-2 text-muted">
          {project.subtitle} · 共 {designs.length} 项
        </p>
        <a
          href={asset("/intro/index.html")}
          target="_blank"
          rel="noreferrer"
          className="group mt-6 flex items-center justify-between gap-4 overflow-hidden rounded-2xl bg-[#121b31] px-6 py-5 text-[#f4f5f7] transition hover:shadow-lg"
        >
          <span>
            <span className="block font-mono text-xs uppercase tracking-widest text-[#df4b17]">Opening · 10s</span>
            <span className="mt-1 block text-xl font-semibold">开场动画：AI Meets Life</span>
          </span>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#df4b17] text-lg transition group-hover:scale-110">▶</span>
        </a>
      </section>

      <nav className="sticky top-16 z-10 -mx-4 mb-10 flex gap-2 overflow-x-auto bg-background/85 px-4 py-3 backdrop-blur">
        {categories.map((c) => (
          <a key={c.id} href={`#${c.id}`} className="btn-ghost shrink-0">
            {c.name}
            <span className="text-muted">{designs.filter((d) => d.category === c.id).length}</span>
          </a>
        ))}
      </nav>

      <div className="space-y-14">
        {categories.map((c) => {
          const items = designs.filter((d) => d.category === c.id);
          return (
            <section key={c.id} id={c.id} className="scroll-mt-32">
              <div className="mb-5 flex items-baseline gap-3 border-b border-line pb-3">
                <h2 className="text-xl font-semibold">{c.name}</h2>
                <span className="text-sm uppercase tracking-wider text-muted">{c.en}</span>
              </div>
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((d) => {
                  return (
                    <li key={d.slug}>
                      <Link
                        href={`/d/${d.slug}`}
                        className="group block overflow-hidden rounded-2xl border border-line bg-surface transition hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <div className="flex aspect-[4/3] items-center justify-center border-b border-line bg-background p-4">
                          <CardImage design={d} />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium group-hover:text-accent">{d.title}</h3>
                          <p className="text-sm text-muted">{d.en}</p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
