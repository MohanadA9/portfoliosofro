import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/common/Headers";
import { CoverCard } from "@/components/common/Cards";
import { SearchInput, Spinner, Empty } from "@/components/common/Primitives";
import { api } from "@/api/client";
function CoursesPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["pub-courses", search],
    queryFn: () =>
      api.courses.list({
        search,
        pageSize: 50,
      }),
  });
  return (
    <>
      <PageHeader
        eyebrow="Teaching"
        title="Courses"
        subtitle="Graduate and undergraduate courses on communications and signal processing."
      />
      <section className="container-academic py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search courses…" />
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {data?.total ?? 0} courses
          </p>
        </div>
        {isLoading ? (
          <Spinner />
        ) : !data?.data.length ? (
          <Empty />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((c) => (
              <CoverCard
                key={c.id}
                to={`/courses/${c.id}`}
                cover={c.cover}
                eyebrow={`${c.lectures.length} Lectures`}
                title={c.title}
                meta={c.description}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
export default CoursesPage;
