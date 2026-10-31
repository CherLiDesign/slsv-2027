import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, designs, getDesign } from "@/lib/catalog";
import { Viewer } from "./Viewer";

export function generateStaticParams() {
  return designs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/d/[slug]">) {
  const design = getDesign((await params).slug);
  return { title: design ? `${design.title} · SLSV 2027` : "SLSV 2027" };
}

export default async function DesignPage({ params }: PageProps<"/d/[slug]">) {
  const { slug } = await params;
  const design = getDesign(slug);
  if (!design) notFound();

  const i = designs.indexOf(design);
  const prev = designs[i - 1];
  const next = designs[i + 1];
  const category = categories.find((c) => c.id === design.category)!;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">
          全部
        </Link>
        <span>/</span>
        <Link href={`/#${category.id}`} className="hover:text-foreground">
          {category.name}
        </Link>
      </div>

      <Viewer design={design} />

      <div className="mt-10 flex justify-between gap-4 border-t border-line pt-6 text-sm">
        {prev ? (
          <Link href={`/d/${prev.slug}`} className="text-muted hover:text-foreground">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/d/${next.slug}`} className="text-muted hover:text-foreground">
            {next.title} →
          </Link>
        )}
      </div>
    </div>
  );
}
