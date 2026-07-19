import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { ArrowLeft, ExternalLink, Download, Users, BookOpen, Hash } from "lucide-react";
import { Spinner } from "@/components/common/Primitives";
import { useProfessor } from "@/context/DataContext";
import { slugify } from "@/lib/utils";

function ResearchDetail() {
  const { slug } = useParams();
  const { data: professor } = useProfessor();

  // 1. Fetch the list of researches to find the one matching this slug
  const { data: listData, isLoading: listLoading } = useQuery({
    queryKey: ["pub-researches-list-for-slug"],
    queryFn: () => api.public.researches.list({ pageSize: 1000 }),
  });

  const matchedResearch = listData?.data?.find(
    (item) => slugify(item.title) === slug || String(item.id) === slug
  );

  // 2. Fetch the full detail of the matched research by its ID
  const { data: r, isLoading: detailLoading } = useQuery({
    queryKey: ["research", matchedResearch?.id],
    queryFn: () => api.public.researches.get(matchedResearch.id),
    enabled: !!matchedResearch?.id,
  });

  const isLoading = listLoading || (!!matchedResearch && detailLoading);

  useEffect(() => {
    if (r && professor) {
      const prevTitle = document.title;
      const prevDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const prevKeywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';

      document.title = `${r.title} | ${professor.name}`;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', `${professor.name} - Research: ${r.abstract || ""}`.substring(0, 160));

      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      const kwList = Array.isArray(r.keywords) ? r.keywords.join(", ") : "";
      metaKeywords.setAttribute('content', `${kwList}, ${professor.name}, ${professor.department}, research`);

      return () => {
        document.title = prevTitle;
        const currentMetaDesc = document.querySelector('meta[name="description"]');
        if (currentMetaDesc) {
          if (prevDesc) currentMetaDesc.setAttribute('content', prevDesc);
          else currentMetaDesc.remove();
        }
        const currentMetaKeywords = document.querySelector('meta[name="keywords"]');
        if (currentMetaKeywords) {
          if (prevKeywords) currentMetaKeywords.setAttribute('content', prevKeywords);
          else currentMetaKeywords.remove();
        }
      };
    }
  }, [r, professor]);

  if (isLoading) return <Spinner />;

  if (!listLoading && !matchedResearch) {
    return (
      <div className="container-academic py-20 text-center">
        <h2 className="text-2xl font-bold">Research not found</h2>
        <p className="text-muted-foreground mt-2">We couldn't find a research with that slug.</p>
        <Link to="/researches" className="mt-4 inline-flex items-center gap-1 text-electric hover:underline">
          <ArrowLeft className="size-4" /> Back to research
        </Link>
      </div>
    );
  }

  if (!r) return <Spinner />;
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