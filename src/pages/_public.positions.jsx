import { PageHeader } from "@/components/common/Headers";
import { Card } from "@/components/common/Cards";
import { positions } from "@/data/mockData";
import {
  Crown,
  GraduationCap,
  Radio,
  FileEdit,
  Mic,
  Users,
  Shield,
  Scroll,
  Calendar,
  Building,
} from "lucide-react";
const ICONS = {
  crown: Crown,
  academic: GraduationCap,
  radio: Radio,
  editor: FileEdit,
  mic: Mic,
  users: Users,
  shield: Shield,
  scroll: Scroll,
  calendar: Calendar,
  building: Building,
};
function PositionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Roles"
        title="Current positions"
        subtitle="Academic leadership, editorial, and advisory roles currently held."
      />
      <section className="container-academic py-12">
        <div className="grid gap-5 md:grid-cols-2">
          {positions.map((p) => {
            const Icon = ICONS[p.icon] ?? GraduationCap;
            return (
              <Card key={p.id} className="p-6 flex gap-4">
                <span className="shrink-0 grid size-12 place-items-center rounded-xl bg-electric/10 text-electric border border-electric/30">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-display font-semibold">{p.title}</h3>
                  <p className="text-sm text-electric font-mono">{p.organization}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </>
  );
}
export default PositionsPage;
