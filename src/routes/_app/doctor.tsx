import { createFileRoute } from "@tanstack/react-router";
import { Stethoscope, HeartPulse, AlertTriangle, ClipboardList, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";

export const Route = createFileRoute("/_app/doctor")({
  component: DoctorDashboard,
  head: () => ({ meta: [{ title: "Doctor Dashboard · Nyrova" }] }),
});

const myPatients = [
  { id: "PT-10248", ward: "Cardiology", risk: 92, condition: "Heart Disease", trend: "↑" },
  { id: "PT-10261", ward: "Endocrinology", risk: 78, condition: "Diabetes Type II", trend: "↑" },
  { id: "PT-10277", ward: "ICU", risk: 71, condition: "Post-op Cardiac", trend: "→" },
  { id: "PT-10299", ward: "Cardiology", risk: 64, condition: "Arrhythmia", trend: "↓" },
  { id: "PT-10301", ward: "Endocrinology", risk: 58, condition: "Pre-diabetic", trend: "↓" },
  { id: "PT-10312", ward: "Cardiology", risk: 41, condition: "Hypertension", trend: "→" },
];

function DoctorDashboard() {
  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Clinical Dashboard"
        description="Your patient panel · AI-prioritized risk queue."
        actions={
          <Badge variant="outline" className="gap-2 border-primary/20 bg-primary/5 text-primary shadow-sm px-3 py-1 font-bold tracking-widest uppercase text-[10px]">
            <Stethoscope className="h-3 w-3" /> Doctor View
          </Badge>
        }
      />

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        <KpiCard title="My Patients" value={42} change={3.2} icon={ClipboardList} tone="primary" delay={0} />
        <KpiCard title="High Risk Today" value={7} change={12.5} icon={AlertTriangle} tone="danger" delay={0.05} />
        <KpiCard title="Avg Risk Score" value={61} suffix="%" change={-4.1} icon={HeartPulse} tone="warning" delay={0.1} />
        <KpiCard title="Rounds Completed" value={28} change={5.0} icon={Stethoscope} tone="success" delay={0.15} />
      </div>

      <Card className="glass-card border border-white/40 shadow-elevated rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        <CardHeader className="pb-4 relative z-10">
          <CardTitle className="text-xl font-heading font-bold text-foreground">Patient Risk Queue (anonymized)</CardTitle>
          <CardDescription className="text-xs font-medium mt-1">Sorted by AI risk score · click for SHAP explanation</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 pt-2">
          <div className="divide-y divide-border/40">
            {myPatients.map((p) => (
              <div key={p.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 hover:bg-white/30 transition-colors -mx-4 px-4 cursor-pointer group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[13px] font-bold text-foreground tracking-tight">{p.id}</span>
                    <Badge variant="outline" className="text-[9px] font-bold tracking-widest uppercase bg-white/50 border-white/60">{p.ward}</Badge>
                    <span className="text-xs font-medium text-muted-foreground">{p.condition}</span>
                  </div>
                  <Progress value={p.risk} className={`mt-3 h-2 bg-muted/40 ${p.risk > 80 ? 'text-primary' : p.risk > 60 ? 'text-accent' : 'text-primary/60'}`} indicatorColor={p.risk > 80 ? 'bg-primary' : p.risk > 60 ? 'bg-accent' : 'bg-primary/60'} />
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <div className={`text-xl font-mono font-bold tracking-tight ${p.risk > 80 ? "text-primary" : p.risk > 60 ? "text-accent" : "text-primary/60"}`}>
                      {p.risk}%
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">trend {p.trend}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card border border-white/40 shadow-soft rounded-3xl overflow-hidden relative">
          <CardHeader className="pb-4"><CardTitle className="text-xl font-heading font-bold text-foreground">Today's recommendations</CardTitle></CardHeader>
          <CardContent className="space-y-3 pt-2">
            <Reco text="PT-10248 — escalate to cardiac consult (model conf. 94%)" tone="danger" />
            <Reco text="PT-10261 — recheck HbA1c, model flags rising glucose pattern" tone="warning" />
            <Reco text="PT-10277 — ICU discharge candidate within 24h" tone="success" />
          </CardContent>
        </Card>
        <Card className="glass-card border border-white/40 shadow-soft rounded-3xl overflow-hidden relative">
          <CardHeader className="pb-4"><CardTitle className="text-xl font-heading font-bold text-foreground">Model Context</CardTitle></CardHeader>
          <CardContent className="text-[13px] pt-2">
            <p className="font-medium leading-relaxed text-foreground/90">Predictions come from <b className="text-primary font-bold">Nyrova-CV v1.7</b> (XGBoost, UCI Heart Disease) and <b className="text-primary font-bold">Nyrova-DM v2.3</b> (Random Forest, Pima Diabetes).</p>
            <div className="mt-4 p-4 rounded-xl bg-white/40 border border-white/50 shadow-sm font-medium text-muted-foreground leading-relaxed">
              Average accuracy <span className="text-primary font-bold font-mono">88.3%</span> · ROC-AUC <span className="text-primary font-bold font-mono">0.92</span> · 5-fold cross-validated.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Reco({ text, tone }: { text: string; tone: "danger" | "warning" | "success" }) {
  const bg = tone === "danger" ? "bg-primary/10 border-primary/20 text-primary" : tone === "warning" ? "bg-accent/10 border-accent/20 text-accent" : "bg-primary/5 border-primary/20 text-primary/80";
  return <div className={`rounded-xl p-4 border font-medium text-[13px] shadow-sm transition-transform hover:-translate-y-0.5 ${bg}`}>{text}</div>;
}
