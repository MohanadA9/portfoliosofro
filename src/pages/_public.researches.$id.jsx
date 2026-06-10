import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { ArrowLeft, ExternalLink, Download, Users, BookOpen, Hash } from "lucide-react";
import { Spinner } from "@/components/common/Primitives";
function ResearchDetail() {
  const { id } = useParams();
  const { data: r, isLoading } = useQuery({
    queryKey: ["research", id],
    queryFn: () => api.researches.get(id),
  });
  if (isLoading || !r) return <Spinner />;
  return (
    <article className="container-academic py-12">
      <Link
        to="/researches"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-electric mb-6"
      >
        <ArrowLeft className="size-4" /> Back to research
      </Link>
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-border mb-8">
            <img src={r.cover} alt={r.title} className="size-full object-cover" />
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-electric mb-2">
            {r.year} • {r.journal}
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">{r.title}</h1>
          <h2 className="mt-8 font-display text-xl font-bold mb-3">Abstract</h2>
          <p className="text-muted-foreground leading-relaxed">{r.abstract}</p>
          <h2 className="mt-8 font-display text-xl font-bold mb-3">Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {r.keywords.map((k) => (
              <span
                key={k}
                className="rounded-full border border-electric/30 bg-electric/5 px-3 py-1 text-xs text-electric font-mono"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Users className="size-4 text-electric mt-0.5" />
              <div>
                <p className="font-semibold">Authors</p>
                <p className="text-muted-foreground">{r.authors.join(", ")}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <BookOpen className="size-4 text-electric mt-0.5" />
              <div>
                <p className="font-semibold">Journal</p>
                <p className="text-muted-foreground">{r.journal}</p>
              </div>
            </div>
            {r.conference && (
              <div className="flex items-start gap-2">
                <BookOpen className="size-4 text-electric mt-0.5" />
                <div>
                  <p className="font-semibold">Conference</p>
                  <p className="text-muted-foreground">{r.conference}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2">
              <Hash className="size-4 text-electric mt-0.5" />
              <div>
                <p className="font-semibold">DOI</p>
                <p className="text-muted-foreground font-mono text-xs">{r.doi}</p>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <a
              href={r.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-electric px-4 text-sm font-medium text-electric-foreground hover:opacity-90"
            >
              <ExternalLink className="size-4" /> View publication
            </a>
            <a
              href={r.pdf}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-medium hover:border-electric/60"
            >
              <Download className="size-4" /> Download PDF
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}
export default ResearchDetail;
