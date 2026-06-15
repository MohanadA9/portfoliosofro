import { Award, BookOpen, Edit3, MessageSquare, Video, FileText, Activity } from "lucide-react";
import {
  useAdminAchievements,
  useAdminResearches,
  useAdminCourses,
  useAdminBlogs,
  useAdminMessages,
  useAdminProfessor,
} from "@/context/AdminDataContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DONUT_COLORS = ["#3b82f6", "#06b6d4", "#a855f7", "#22c55e"];

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="flex-1 min-w-[140px] bg-card border border-border rounded-lg px-5 py-4 flex items-center justify-between gap-3">
      <div>
        <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
          {label}
        </p>
        <p className="text-3xl font-bold font-display">{value}</p>
      </div>
      <div className="grid size-9 place-items-center rounded-lg bg-electric/10 text-electric shrink-0">
        <Icon className="size-5" />
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {Number(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function DashboardHome() {
  const professor = useAdminProfessor();
  const achievements = useAdminAchievements();
  const researches = useAdminResearches();
  const courses = useAdminCourses();
  const blogs = useAdminBlogs();
  const messages = useAdminMessages();

  const lecturesCount = (courses || []).reduce((s, c) => s + (c.lectures?.length || 0), 0);
  const unread = (messages || []).filter((m) => !m.read).length;

  const stats = [
    { label: "Achievements", value: achievements?.length ?? 0, icon: Award },
    { label: "Researches", value: researches?.length ?? 0, icon: FileText },
    { label: "Courses", value: courses?.length ?? 0, icon: BookOpen },
    { label: "Lectures", value: lecturesCount, icon: Video },
    { label: "Blogs", value: blogs?.length ?? 0, icon: Edit3 },
    {
      label: "Messages",
      value: unread > 0 ? `${messages?.length ?? 0} (${unread})` : String(messages?.length ?? 0),
      icon: MessageSquare,
    },
  ];

  const breakdown = [
    { name: "Researches", value: researches?.length ?? 0 },
    { name: "Courses", value: courses?.length ?? 0 },
    { name: "Blogs", value: blogs?.length ?? 0 },
    { name: "Achievements", value: achievements?.length ?? 0 },
  ];

  const pubsByYear = Object.entries(
    (researches || []).reduce((acc, r) => {
      if (r.year == null) return acc;
      acc[r.year] = (acc[r.year] || 0) + 1;
      return acc;
    }, {}),
  )
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => Number(a.year) - Number(b.year));

  const activities = [
    ...(researches || []).map((r) => ({
      id: `r-${r.id}`,
      action: "Research published",
      target: r.title,
      date: `${r.year}-01-01`,
    })),
    ...(blogs || []).map((b) => ({
      id: `b-${b.id}`,
      action: "Blog post",
      target: b.title,
      date: b.date,
    })),
    ...(achievements || []).map((a) => ({
      id: `a-${a.id}`,
      action: "Achievement added",
      target: a.title,
      date: a.date,
    })),
  ]
    .filter((it) => it.date)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-3xl font-bold font-display">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your academic portfolio at a glance.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-semibold">Publications by Year</p>
              <p className="text-xs text-muted-foreground">
                Research output per year
              </p>
            </div>
            <span className="text-[11px] font-mono text-electric bg-electric/10 px-2 py-0.5 rounded">
              {researches?.length ?? 0} total
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={pubsByYear} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3, fill: "#3b82f6" }}
                name="Publications"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <p className="font-semibold mb-0.5">Content Breakdown</p>
          <p className="text-xs text-muted-foreground mb-3">By category</p>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie
                data={breakdown}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                dataKey="value"
                paddingAngle={3}
              >
                {breakdown.map((_, i) => (
                  <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 justify-center">
            {breakdown.map((item, i) => (
              <span
                key={item.name}
                className="flex items-center gap-1 text-[11px] text-muted-foreground"
              >
                <span
                  className="size-2 rounded-full inline-block"
                  style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
                />
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-5">
        <p className="flex items-center gap-2 font-semibold mb-4">
          <Activity className="size-4 text-electric" /> Recent Activity
        </p>
        <div className="space-y-3">
          {activities.map((act) => (
            <div key={act.id} className="flex items-start gap-3 text-sm">
              <span className="mt-1.5 size-2 rounded-full bg-electric shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium">{act.action}</p>
                <p className="text-xs text-muted-foreground truncate">{act.target}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0 pl-4">{act.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
