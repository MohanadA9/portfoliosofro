import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Send, Linkedin, Github, Twitter } from "lucide-react";
import { PageHeader } from "@/components/common/Headers";
import { useProfessor } from "@/context/DataContext";
import { api } from "@/api/client";
function ContactPage() {
  const { data: professor, loading: profLoading } = useProfessor();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    body: "",
  });
  const [busy, setBusy] = useState(false);

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
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.contact.send(form);
      toast.success("Message sent. I'll get back to you soon.");
      setForm({
        name: "",
        email: "",
        subject: "",
        body: "",
      });
    } catch {
      toast.error("Failed to send. Try again.");
    } finally {
      setBusy(false);
    }
  };
  const field =
    "w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  return (
    <>
      <PageHeader
        eyebrow="Reach out"
        title="Get in touch"
        subtitle="Open for research collaborations, supervision inquiries, invited talks, and editorial review."
      />
      <section className="container-academic py-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {[
            {
              Icon: Mail,
              label: "Email",
              value: professor.email,
              href: `mailto:${professor.email}`,
            },
            {
              Icon: Phone,
              label: "Phone",
              value: professor.phone,
              href: `tel:${professor.phone}`,
            },
            {
              Icon: MapPin,
              label: "Office",
              value: professor.office,
            },
            {
              Icon: Clock,
              label: "Office Hours",
              value: professor.officeHours,
            },
          ].map(({ Icon, label, value, href }) => (
            <a
              key={label}
              href={href ?? "#"}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-electric/50 transition"
            >
              <span className="grid size-10 place-items-center rounded-md bg-electric/10 border border-electric/30 text-electric">
                <Icon className="size-4" />
              </span>
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  {label}
                </p>
                <p className="font-medium">{value}</p>
              </div>
            </a>
          ))}
          <div className="rounded-xl border border-border overflow-hidden h-64">
            <iframe
              title="Office location"
              src="https://www.google.com/maps?q=Cairo%20University&output=embed"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
          <div className="flex gap-2">
            <a
              href={professor.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="grid size-10 place-items-center rounded-md border border-border hover:border-electric/60"
            >
              <Linkedin className="size-4" />
            </a>
            <a
              href={professor.socials.github}
              target="_blank"
              rel="noreferrer"
              className="grid size-10 place-items-center rounded-md border border-border hover:border-electric/60"
            >
              <Github className="size-4" />
            </a>
            <a
              href={professor.socials.twitter}
              target="_blank"
              rel="noreferrer"
              className="grid size-10 place-items-center rounded-md border border-border hover:border-electric/60"
            >
              <Twitter className="size-4" />
            </a>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Name
              </span>
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className={field}
              />
            </label>
            <label className="block">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Email
              </span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className={field}
              />
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Subject
            </span>
            <input
              required
              value={form.subject}
              onChange={(e) =>
                setForm({
                  ...form,
                  subject: e.target.value,
                })
              }
              className={field}
            />
          </label>
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Message
            </span>
            <textarea
              required
              rows={6}
              value={form.body}
              onChange={(e) =>
                setForm({
                  ...form,
                  body: e.target.value,
                })
              }
              className={field}
            />
          </label>
          <button
            disabled={busy}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-electric px-5 text-sm font-medium text-electric-foreground hover:opacity-90 disabled:opacity-60 glow-sm"
          >
            <Send className="size-4" /> {busy ? "Sending…" : "Send message"}
          </button>
        </form>
      </section>
    </>
  );
}
export default ContactPage;
