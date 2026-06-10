import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/common/Headers";
import { CoverCard } from "@/components/common/Cards";
import { SearchInput, Spinner, Empty, Pagination } from "@/components/common/Primitives";
import { api } from "@/api/client";
function BlogPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["pub-blog", search, page],
    queryFn: () =>
      api.blogs.list({
        search,
        page,
        pageSize: 9,
      }),
  });
  return (
    <>
      <PageHeader
        eyebrow="Writing"
        title="Blog"
        subtitle="Short essays on research, teaching, and the future of communications."
      />
      <section className="container-academic py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search posts…"
          />
        </div>
        {isLoading ? (
          <Spinner />
        ) : !data?.data.length ? (
          <Empty />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((b) => (
              <CoverCard
                key={b.id}
                to={`/blog/${b.id}`}
                cover={b.cover}
                eyebrow={new Date(b.date).toLocaleDateString()}
                title={b.title}
                meta={b.excerpt}
              />
            ))}
          </div>
        )}
        <Pagination page={page} totalPages={data?.totalPages ?? 1} onChange={setPage} />
      </section>
    </>
  );
}
export default BlogPage;
