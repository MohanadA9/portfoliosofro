import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { ArrowLeft, Twitter, Linkedin, Link2, Calendar } from "lucide-react";
import { Spinner } from "@/components/common/Primitives";
import { CoverCard } from "@/components/common/Cards";
function BlogDetail() {
  const { id } = useParams();
  const { data: b, isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => api.blogs.get(id),
  });
  const { data: related } = useQuery({
    queryKey: ["pub-blog-related"],
    queryFn: () =>
      api.blogs.list({
        pageSize: 3,
      }),
  });
  if (isLoading || !b) return <Spinner />;
  const url = typeof window !== "undefined" ? window.location.href : "";
  return (
    <article className="container-academic py-12">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-electric mb-6"
      >
        <ArrowLeft className="size-4" /> Back to blog
      </Link>
      <header className="max-w-3xl">
        <p className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-electric">
          <Calendar className="size-3.5" /> {new Date(b.date).toLocaleDateString()}
        </p>
        <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight">
          {b.title}
        </h1>
        <p className="mt-3 text-muted-foreground">{b.excerpt}</p>
      </header>
      <div className="my-8 aspect-[21/9] overflow-hidden rounded-2xl border border-border">
        <img src={b.cover} alt="" className="size-full object-cover" />
      </div>
      <div className="prose-academic max-w-3xl mx-auto space-y-4 text-muted-foreground leading-relaxed">
        {b.content.split("\n\n").map((para, i) =>
          para.startsWith("## ") ? (
            <h2 key={i} className="font-display text-2xl font-bold text-foreground mt-8">
              {para.replace("## ", "")}
            </h2>
          ) : (
            <p key={i}>{para}</p>
          ),
        )}
      </div>
      <div className="mt-10 max-w-3xl mx-auto flex items-center gap-3 border-t border-border pt-6">
        <span className="text-sm text-muted-foreground">Share:</span>
        <a
          href={`https://twitter.com/intent/tweet?url=${url}`}
          target="_blank"
          rel="noreferrer"
          className="grid size-9 place-items-center rounded-md border border-border hover:border-electric/60"
        >
          <Twitter className="size-4" />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
          target="_blank"
          rel="noreferrer"
          className="grid size-9 place-items-center rounded-md border border-border hover:border-electric/60"
        >
          <Linkedin className="size-4" />
        </a>
        <button
          onClick={() => navigator.clipboard?.writeText(url)}
          className="grid size-9 place-items-center rounded-md border border-border hover:border-electric/60"
        >
          <Link2 className="size-4" />
        </button>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-xl font-bold mb-5">Related posts</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {related?.data
            .filter((r) => r.id !== b.id)
            .slice(0, 3)
            .map((r) => (
              <CoverCard
                key={r.id}
                to={`/blog/${r.id}`}
                cover={r.cover}
                eyebrow="Article"
                title={r.title}
                meta={r.excerpt}
              />
            ))}
        </div>
      </section>
    </article>
  );
}
export default BlogDetail;
