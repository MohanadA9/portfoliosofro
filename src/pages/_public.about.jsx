import { PageHeader } from "@/components/common/Headers";
import { useProfessor, useEducation } from "@/context/DataContext";
import professorImg from "@/assets/professor.jpg";
import { motion } from "framer-motion";
import { GraduationCap, Target, Sparkles, BookMarked } from "lucide-react";

function AboutPage() {
  const professor = useProfessor();
  const education = useEducation();

  if (!professor)
    return <div className="flex min-h-screen items-center justify-center">Loading…</div>;

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Biography & academic journey"
        subtitle="Two decades at the intersection of teaching, research, and academic leadership in communications engineering."
      />

      <section className="container-academic grid gap-12 py-16 md:grid-cols-[1fr_2fr]">
        {/* Sticky sidebar */}
        <div>
          <div className="sticky top-24 space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl border border-border">
              <img
                src={professor.avatar?.startsWith("data:") ? professor.avatar : professorImg}
                alt={professor.name}
                className="size-full object-cover"
              />
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-sm space-y-1">
              <p className="font-display font-semibold">{professor.name}</p>
              <p className="text-muted-foreground">{professor.title}</p>
              <p className="text-xs text-muted-foreground">{professor.department}</p>
              <p className="text-xs text-muted-foreground">{professor.university}</p>
              <div className="pt-2 border-t border-border mt-2 space-y-0.5">
                <p className="text-xs text-muted-foreground">{professor.email}</p>
                <p className="text-xs text-muted-foreground">{professor.office}</p>
                <p className="text-xs text-muted-foreground">{professor.officeHours}</p>
              </div>
            </div>
            {/* Socials */}
            {professor.socials && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(professor.socials)
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <a
                      key={k}
                      href={v}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-border bg-card px-3 py-1 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:border-electric/60 hover:text-electric transition capitalize"
                    >
                      {k}
                    </a>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-10">
          {/* Bio */}
          <section>
            <h2 className="font-display text-2xl font-bold mb-3">Biography</h2>
            <p className="text-muted-foreground leading-relaxed">{professor.bio}</p>
          </section>

          {/* Education */}
          {education?.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="text-electric" /> Education
              </h2>
              <div className="space-y-3">
                {education.map((e, idx) => (
                  <motion.div
                    key={e.id ?? idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="rounded-xl border border-border bg-card p-4 hover:border-electric/40 transition"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-display font-semibold">{e.degree}</p>
                      <p className="font-mono text-xs text-electric">{e.year}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{e.school ?? e.institution}</p>
                    {e.focus && (
                      <p className="text-xs text-muted-foreground mt-1">Focus: {e.focus}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Research Interests */}
          {professor.interests?.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
                <Target className="text-electric" /> Research Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {professor.interests.map((i) => (
                  <span
                    key={i}
                    className="rounded-full border border-electric/30 bg-electric/5 px-3 py-1.5 text-sm text-electric"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {professor.skills?.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
                <BookMarked className="text-electric" /> Technical Skills
              </h2>
              <div className="space-y-3">
                {professor.skills.map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{s.name}</span>
                      <span className="font-mono text-electric">{s.level}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-electric to-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Vision */}
          {professor.vision && (
            <section>
              <h2 className="font-display text-2xl font-bold mb-3 flex items-center gap-2">
                <Sparkles className="text-electric" /> Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed italic border-l-2 border-electric pl-4">
                "{professor.vision}"
              </p>
            </section>
          )}
        </div>
      </section>
    </>
  );
}

export default AboutPage;
