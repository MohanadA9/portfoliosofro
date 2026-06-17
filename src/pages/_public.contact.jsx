import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Send, Linkedin, Github, Twitter, Wifi, WifiOff } from "lucide-react";
import { PageHeader } from "@/components/common/Headers";
import { useProfessor } from "@/context/DataContext";
import { api } from "@/api/client";
import { useReverb } from "@/hooks/useReverb";
function ContactPage() {
  const { data: professor, loading: profLoading } = useProfessor();
  const { connected, subscribe } = useReverb();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    body: "",
  });
  const [busy, setBusy] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState(null);

  // Subscribe to contact notifications
  useEffect(() => {
    if (connected) {
      const unsubscribe = subscribe("contact-notifications", (data) => {
        console.log("[Contact] Received notification:", data);
        setNotificationStatus({
          type: "success",
          message: data.message || "Your message has been received!",
          timestamp: new Date().toLocaleTimeString(),
        });
        // Auto-clear notification after 5 seconds
        setTimeout(() => setNotificationStatus(null), 5000);
      });

      return () => unsubscribe();
    }
  }, [connected, subscribe]);

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
      // Show real-time notification status
      setNotificationStatus({
        type: "pending",
        message: "Waiting for confirmation...",
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      toast.error("Failed to send. Try again.");
      setNotificationStatus({
        type: "error",
        message: error.message || "Failed to send message",
        timestamp: new Date().toLocaleTimeString(),
      });
      setTimeout(() => setNotificationStatus(null), 5000);
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
      {/* Real-time Connection Status */}
      <div className="bg-card border border-border">
        <div className="container-academic py-3 flex items-center gap-2 text-xs">
          {connected ? (
            <>
              <Wifi className="size-3 text-green-500" />
              <span className="text-muted-foreground">Real-time notifications <span className="text-green-500 font-medium">connected</span></span>
            </>
          ) : (
            <>
              <WifiOff className="size-3 text-amber-500" />
              <span className="text-muted-foreground">Real-time notifications <span className="text-amber-500 font-medium">connecting</span>...</span>
            </>
          )}
        </div>
      </div>
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
          {/* Notification Status */}
          {notificationStatus && (
            <div className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
              notificationStatus.type === "success"
                ? "bg-green-500/10 border border-green-500/30 text-green-600"
                : notificationStatus.type === "error"
                ? "bg-red-500/10 border border-red-500/30 text-red-600"
                : "bg-blue-500/10 border border-blue-500/30 text-blue-600"
            }`}>
              <div className="flex-1">
                <p className="font-medium">{notificationStatus.message}</p>
                <p className="text-xs opacity-75 mt-1">{notificationStatus.timestamp}</p>
              </div>
            </div>
          )}
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
            disabled={busy || !connected}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-electric px-5 text-sm font-medium text-electric-foreground hover:opacity-90 disabled:opacity-60 glow-sm"
            title={!connected ? "Waiting for real-time connection..." : ""}
          >
            <Send className="size-4" /> {busy ? "Sending…" : "Send message"}
          </button>
        </form>
      </section>
    </>
  );
}
export default ContactPage;
