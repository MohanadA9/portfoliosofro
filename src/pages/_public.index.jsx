import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Award,
  Briefcase,
  Quote,
  Mail,
  FileText,
} from "lucide-react";
import professorImg from "@/assets/professor.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import { CircuitBackground } from "@/components/effects/CircuitBackground";
import { SectionHeader } from "@/components/common/Headers";
import { CoverCard } from "@/components/common/Cards";
import { Stat } from "@/components/common/Primitives";
import { CountUp } from "@/components/common/CountUp";
import {
  useProfessor,
  useAbout,
  useCourses,
  useResearches,
  useAchievements,
  useBlogs,
  useExperience,
} from "@/context/DataContext";

function Typewriter({ titles }) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  const list = titles?.length
    ? titles
    : ["Professor of Wireless Communications"];

  useEffect(() => {
    const cur = list[i % list.length];
    const t = setTimeout(
      () => {
        if (!del) {
          setText(cur.slice(0, text.length + 1));
          if (text.length + 1 === cur.length)
            setTimeout(() => setDel(true), 1400);
        } else {
          setText(cur.slice(0, text.length - 1));
          if (text.length - 1 === 0) {
            setDel(false);
            setI((x) => (x + 1) % list.length);
          }
        }
      },
      del ? 30 : 60,
    );
    return () => clearTimeout(t);
  }, [text, del, i, list]);

  return (
    <span className="text-electric font-mono text-sm md:text-base">
      {text}
      <span className="ml-0.5 inline-block w-1.5 h-4 bg-electric animate-pulse align-middle" />
    </span>
  );
}

function HomePage() {
  const { data: professor, loading: profLoading } = useProfessor();
  const { data: about } = useAbout();
  const { data: courses } = useCourses();
  const { data: researches } = useResearches();
  const { data: achievements } = useAchievements();
  const { data: blogs } = useBlogs();
  const { data: experience } = useExperience();

  const startYears = (experience ?? [])
    .map((e) => parseInt(e.from, 10))
    .filter((y) => !Number.isNaN(y));
  const yearsExperience = startYears.length
    ? new Date().getFullYear() - Math.min(...startYears)
    : 0;

  if (profLoading || !professor) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="size-8 mx-auto mb-3 rounded-full border-2 border-electric border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  const typewriterTitles = experience?.map((e) => e.position) ?? [];
  const heroSubtitle =
    professor.title ?? `${professor.department} · ${professor.university}`;

  const nameParts = professor.name?.split(" ") ?? [];
  const nameFirst = nameParts.slice(0, 2).join(" ");
  const nameLast = nameParts.slice(2).join(" ");

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <CircuitBackground />
        <div className="container-academic relative grid gap-12 py-20 md:grid-cols-2 md:py-32 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-electric">
              <span className="size-1.5 rounded-full bg-electric animate-pulse" />{" "}
              Available for Collaborations
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              {nameFirst}{" "}
              <span className="text-gradient-electric">{nameLast}</span>
            </h1>
            <Typewriter titles={typewriterTitles} />
            <p className="text-muted-foreground max-w-xl">{heroSubtitle}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/researches"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-electric px-5 text-sm font-medium text-electric-foreground hover:opacity-90 glow-sm"
              >
                Explore Research <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-medium hover:border-electric/60"
              >
                <Mail className="size-4" /> Get in Touch
              </Link>
            </div>
            {/* Interest tags from about data */}
            {about?.interests?.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                {about.interests.slice(0, 3).map((interest) => (
                  <span key={interest} className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-electric" />{" "}
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-electric/30 to-transparent blur-2xl" />
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-electric/30 glow">
              <img
                src={
                  professor.avatar
                    ? professor.avatar
                    : professorImg
                }
                alt={professor.name}
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 glass rounded-lg p-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-electric">
                  Currently
                </p>
                <p className="font-display text-sm font-semibold">
                  {professor.title}
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 animate-radar opacity-40">
              <span className="absolute -top-2 left-1/2 size-3 -translate-x-1/2 rounded-full bg-electric glow-sm" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="container-academic py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat
            value={<CountUp end={researches.length} suffix="+" /> }
            label="Publications"
            icon={<FileText className="size-4" />}
          />
          <Stat
            value={<CountUp end={courses.length} />}
            label="Courses"
            icon={<BookOpen className="size-4" />}
          />
          <Stat
            value={<CountUp end={achievements.length} />}
            label="Awards"
            icon={<Award className="size-4" />}
          />
          <Stat
            value={<CountUp end={yearsExperience} suffix=" yrs" />}
            label="Experience"
            icon={<Briefcase className="size-4" />}
          />
        </div>
      </section>

      {/* INTRO */}
      <section className="container-academic py-16">
        <div className="grid gap-10 md:grid-cols-2 items-center">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border">
              <img
                src={heroBg}
                alt="Lab"
                loading="lazy"
                className="size-full object-cover opacity-80"
              />
            </div>
            {about?.vision && (
              <div className="absolute -bottom-6 -right-6 glass rounded-xl p-4 max-w-[260px]">
                <Quote className="size-5 text-electric mb-2" />
                <p className="text-sm italic text-muted-foreground">
                  "{about.vision.slice(0, 120)}
                  {about.vision.length > 120 ? "…" : ""}"
                </p>
              </div>
            )}
          </div>
          <div className="space-y-5">
            <SectionHeader
              eyebrow="About the professor"
              title={
                <>
                  A career spent at the{" "}
                  <span className="text-gradient-electric">
                    edge of wireless
                  </span>
                </>
              }
              subtitle={null}
              align="left"
            />
            <p className="text-muted-foreground">{about?.bio}</p>
            {about?.interests?.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {about.interests.slice(0, 4).map((interest) => (
                  <div
                    key={interest}
                    className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm"
                  >
                    <span className="size-1.5 rounded-full bg-electric" />{" "}
                    {interest}
                  </div>
                ))}
              </div>
            )}
            <Link
              to="/about"
              className="inline-flex items-center gap-1 text-sm text-electric hover:underline"
            >
              Full biography <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* RESEARCH */}
      {researches?.length > 0 && (
        <section className="container-academic py-16">
          <SectionHeader
            eyebrow="Featured Research"
            title="Recent publications"
            subtitle="A selection of recent peer-reviewed work in wireless and signal processing."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {researches.slice(0, 3).map((r) => (
              <CoverCard
                key={r.id}
                to={`/researches/${r.id}`}
                cover={r.cover}
                eyebrow={String(r.year)}
                title={r.title}
                meta={r.abstract}
                footer={r.journal}
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/researches"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium hover:border-electric/60"
            >
              View all research <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      )}

      {/* ACHIEVEMENTS */}
      {achievements?.length > 0 && (
        <section className="container-academic py-16">
          <SectionHeader
            eyebrow="Recognition"
            title="Featured achievements"
            subtitle="Awards, grants, and honors received across two decades of service."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {achievements.slice(0, 4).map((a) => (
              <CoverCard
                key={a.id}
                to={`/achievements/${a.id}`}
                cover={a.cover}
                eyebrow={a.category}
                title={a.title}
                footer={new Date(a.date).toLocaleDateString()}
              />
            ))}
          </div>
        </section>
      )}

      {/* COURSES */}
      {courses?.length > 0 && (
        <section className="container-academic py-16">
          <SectionHeader
            eyebrow="Teaching"
            title="Featured courses"
            subtitle="Graduate and undergraduate offerings on wireless communications and signal processing."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 3).map((c) => (
              <CoverCard
                key={c.id}
                to={`/courses/${c.id}`}
                cover={c.cover}
                eyebrow={`${c.lectures?.length || 0} Lectures`}
                title={c.title}
                meta={c.description}
              />
            ))}
          </div>
        </section>
      )}

      {/* BLOG */}
      {blogs?.length > 0 && (
        <section className="container-academic py-16">
          <SectionHeader
            eyebrow="Latest Blog"
            title="Notes & essays"
            subtitle="Short writing on research, teaching, and the future of communications."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {blogs.slice(0, 3).map((b) => (
              <CoverCard
                key={b.id}
                to={`/blog/${b.slug}`}
                cover={b.cover}
                eyebrow={b.category || "Article"}
                title={b.title}
                meta={b.excerpt}
                footer={new Date(b.date).toLocaleDateString()}
              />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-academic py-20">
        <div className="relative overflow-hidden rounded-3xl border border-electric/30 bg-gradient-to-br from-card via-card to-deep p-10 md:p-14">
          <CircuitBackground />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] items-center">
            <div>
              <h3 className="font-display text-3xl md:text-4xl font-bold">
                Let's collaborate.
              </h3>
              <p className="mt-2 text-muted-foreground max-w-xl">
                Research partnerships, graduate supervision, invited talks, and
                editorial review. Reach out and let's build something meaningful
                together.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-electric px-6 text-sm font-semibold text-electric-foreground hover:opacity-90 glow-sm"
            >
              Contact me <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
