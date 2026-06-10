import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { ArrowLeft, Calendar, ExternalLink, Tag } from "lucide-react";
import { Spinner } from "@/components/common/Primitives";
function AchievementDetail() {
  const { id } = useParams();
  const { data: a, isLoading } = useQuery({
    queryKey: ["achievement", id],
    queryFn: () => api.achievements.get(id),
  });
  if (isLoading || !a) return <Spinner />;
  return (
    <article className="container-academic py-12">
      <Link
        to="/achievements"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-electric mb-6"
      >
        <ArrowLeft className="size-4" /> Back to achievements
      </Link>
      <div className="aspect-[21/9] overflow-hidden rounded-2xl border border-border">
        <img src={a.cover} alt={a.title} className="size-full object-cover" />
      </div>
      <header className="mt-8 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
          <span className="flex items-center gap-1.5 text-electric">
            <Tag className="size-3.5" />
            {a.category}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {new Date(a.date).toLocaleDateString()}
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">{a.title}</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">{a.fullDescription}</p>
        {a.liveLink && (
          <a
            href={a.liveLink}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-electric px-5 py-2.5 text-sm font-medium text-electric-foreground hover:opacity-90"
          >
            View Achievement <ExternalLink className="size-4" />
          </a>
        )}
      </header>
      <section className="mt-12">
        <h2 className="font-display text-xl font-bold mb-4">Gallery</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {a.gallery.map((g, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-xl border border-border">
              <img
                src={g}
                alt=""
                className="size-full object-cover hover:scale-105 transition duration-500"
              />
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
export default AchievementDetail;
