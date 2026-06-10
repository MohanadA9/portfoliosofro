import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/common/Headers";
import { CoverCard } from "@/components/common/Cards";
import { SearchInput, Pagination, Select, Spinner, Empty } from "@/components/common/Primitives";
import { api } from "@/api/client";
function ResearchesPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("year");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["pub-research", search, sortBy, page],
    queryFn: () =>
      api.researches.list({
        search,
        sortBy,
        sortDir: "desc",
        page,
        pageSize: 9,
      }),
  });
  return (
    <>
      <PageHeader
        eyebrow="Publications"
        title="Research"
        subtitle="Peer-reviewed journal articles, conference papers, and technical reports."
      />
      <section className="container-academic py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search by title, keyword, author…"
          />
          <Select
            label="Sort by"
            value={sortBy}
            onChange={setSortBy}
            options={[
              {
                value: "year",
                label: "Year",
              },
              {
                value: "title",
                label: "Title",
              },
              {
                value: "journal",
                label: "Journal",
              },
            ]}
          />
        </div>
        {isLoading ? (
          <Spinner />
        ) : !data?.data.length ? (
          <Empty />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((r) => (
              <CoverCard
                key={r.id}
                to={`/researches/${r.id}`}
                cover={r.cover}
                eyebrow={String(r.year)}
                title={r.title}
                meta={r.abstract}
                footer={`${r.authors.join(", ")} • ${r.journal}`}
              />
            ))}
          </div>
        )}
        <Pagination page={page} totalPages={data?.totalPages ?? 1} onChange={setPage} />
      </section>
    </>
  );
}
export default ResearchesPage;
