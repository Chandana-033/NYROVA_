import { createFileRoute } from "@tanstack/react-router";
import { Stethoscope, HeartPulse, AlertTriangle, ClipboardList } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";

export const Route = createFileRoute("/_app/doctor")({
  component: DoctorDashboard,
  head: () => ({ meta: [{ title: "Doctor Dashboard · VitaPredict" }] }),
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
    <div className="space-y-6">
      <PageHeader
        title="Clinical Dashboard"
        description="Your patient panel · AI-prioritized risk queue."
        actions={
          <Badge variant="outline" className="gap-1.5 border-primary/40 bg-primary/10 text-primary">
            <Stethoscope className="h-3 w-3" /> Doctor View
          </Badge>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard title="My Patients" value={42} change={3.2} icon={ClipboardList} tone="primary" delay={0} />
        <KpiCard title="High Risk Today" value={7} change={12.5} icon={AlertTriangle} tone="danger" delay={0.05} />
        <KpiCard title="Avg Risk Score" value={61} suffix="%" change={-4.1} icon={HeartPulse} tone="warning" delay={0.1} />
        <KpiCard title="Rounds Completed" value={28} change={5.0} icon={Stethoscope} tone="success" delay={0.15} />
      </div>

      <Card className="glass-card border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Patient Risk Queue (anonymized)</CardTitle>
          <CardDescription>Sorted by AI risk score · click for SHAP explanation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/60">
            {myPatients.map((p) => (
              <div key={p.id} className="flex items-center gap-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold">{p.id}</span>
                    <Badge variant="outline" className="text-[10px]">{p.ward}</Badge>
                    <span className="text-xs text-muted-foreground">{p.condition}</span>
                  </div>
                  <Progress value={p.risk} className="mt-2 h-1.5" />
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${p.risk > 80 ? "text-destructive" : p.risk > 60 ? "text-warning-foreground" : "text-success"}`}>
                    {p.risk}%
                  </div>
                  <div className="text-[10px] text-muted-foreground">trend {p.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card border-0">
          <CardHeader className="pb-2"><CardTitle className="text-base">Today's recommendations</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Reco text="PT-10248 — escalate to cardiac consult (model conf. 94%)" tone="danger" />
            <Reco text="PT-10261 — recheck HbA1c, model flags rising glucose pattern" tone="warning" />
            <Reco text="PT-10277 — ICU discharge candidate within 24h" tone="success" />
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardHeader className="pb-2"><CardTitle className="text-base">Model used</CardTitle></CardHeader>
          <CardContent className="text-sm">
            <p>Predictions come from <b>VitaPredict-CV v1.7</b> (XGBoost, UCI Heart Disease) and <b>VitaPredict-DM v2.3</b> (Random Forest, Pima Diabetes).</p>
            <p className="mt-2 text-muted-foreground">Average accuracy 88.3% · ROC-AUC 0.92 · 5-fold cross-validated.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Reco({ text, tone }: { text: string; tone: "danger" | "warning" | "success" }) {
  const bg = tone === "danger" ? "bg-destructive/10" : tone === "warning" ? "bg-warning/15" : "bg-success/10";
  return <div className={`rounded-lg p-3 ${bg}`}>{text}</div>;
}
