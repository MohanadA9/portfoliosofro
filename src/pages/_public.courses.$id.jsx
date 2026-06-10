import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { ArrowLeft, FileText, Download, Video, Youtube, Calendar, Target } from "lucide-react";
import { Spinner } from "@/components/common/Primitives";
function CourseDetail() {
  const { id } = useParams();
  const { data: c, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => api.courses.get(id),
  });
  if (isLoading || !c) return <Spinner />;
  return (
    <article className="container-academic py-12">
      <Link
        to="/courses"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-electric mb-6"
      >
        <ArrowLeft className="size-4" /> Back to courses
      </Link>
      <div className="aspect-[21/9] overflow-hidden rounded-2xl border border-border mb-8">
        <img src={c.cover} alt={c.title} className="size-full object-cover" />
      </div>
      <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">{c.title}</h1>
      <p className="mt-3 text-muted-foreground max-w-3xl">{c.description}</p>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="text-electric size-5" /> Learning Objectives
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {c.objectives.map((o) => (
            <li
              key={o}
              className="flex items-start gap-2 rounded-md border border-border bg-card p-3 text-sm"
            >
              <span className="size-1.5 mt-1.5 rounded-full bg-electric shrink-0" />
              {o}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold mb-4">Lectures ({c.lectures.length})</h2>
        <div className="space-y-2">
          {c.lectures.map((l, i) => (
            <div
              key={l.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4"
            >
              <span className="grid size-10 place-items-center rounded-md bg-electric/10 text-electric font-mono text-sm border border-electric/30">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold truncate">{l.title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3" />
                  {new Date(l.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={l.pdf}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-xs hover:border-electric/60"
                >
                  <FileText className="size-3.5" /> View PDF
                </a>
                <a
                  href={l.pdf}
                  download
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-xs hover:border-electric/60"
                >
                  <Download className="size-3.5" /> Download
                </a>
                {l.videoUrl && (
                  <a
                    href={l.videoUrl}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-xs hover:border-electric/60"
                  >
                    <Video className="size-3.5" /> Video
                  </a>
                )}
                {l.youtubeUrl && (
                  <a
                    href={l.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-8 items-center gap-1.5 rounded-md bg-electric/10 border border-electric/30 px-3 text-xs text-electric"
                  >
                    <Youtube className="size-3.5" /> YouTube
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
export default CourseDetail;
