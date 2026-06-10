import { PageHeader } from "@/components/common/Headers";
import { experiences } from "@/data/mockData";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
function ExperiencesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Career"
        title="Professional experience"
        subtitle="A timeline of academic and research positions across two decades."
      />
      <section className="container-academic py-16">
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-electric via-border to-transparent md:-translate-x-1/2" />
          {experiences.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                margin: "-80px",
              }}
              transition={{
                delay: i * 0.05,
              }}
              className={`relative mb-10 md:grid md:grid-cols-2 md:gap-8 ${i % 2 ? "md:[&>*:first-child]:col-start-2" : ""}`}
            >
              <div className={`pl-12 md:pl-0 ${i % 2 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                <div className="rounded-xl border border-border bg-card p-5 hover:border-electric/50 transition">
                  <p className="font-mono text-xs uppercase tracking-widest text-electric">
                    {e.from} — {e.to}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold">{e.position}</h3>
                  <p className="text-sm text-muted-foreground">{e.organization}</p>
                  <p className="mt-2 text-sm">{e.description}</p>
                  <ul
                    className={`mt-3 space-y-1 text-xs text-muted-foreground ${i % 2 ? "md:text-right" : ""}`}
                  >
                    {e.responsibilities.map((r) => (
                      <li key={r} className="flex items-start gap-1.5">
                        <span className="size-1 mt-1.5 rounded-full bg-electric shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <span className="absolute left-4 md:left-1/2 top-6 grid size-8 -translate-x-1/2 place-items-center rounded-full border-2 border-electric bg-background glow-sm">
                <Briefcase className="size-3.5 text-electric" />
              </span>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
export default ExperiencesPage;
