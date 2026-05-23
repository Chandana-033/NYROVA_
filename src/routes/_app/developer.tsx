import { createFileRoute } from "@tanstack/react-router";
import { Code2, GitBranch, Cpu, Database, Activity } from "lucide-react";
import {
  Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { MODELS } from "@/lib/ml-model";

export const Route = createFileRoute("/_app/developer")({
  component: DeveloperDashboard,
  head: () => ({ meta: [{ title: "Developer Dashboard · Nyrova" }] }),
});

const trainingHistory = Array.from({ length: 20 }, (_, i) => ({
  epoch: i + 1,
  trainAcc: 60 + i * 1.4 + Math.random() * 1.5,
  valAcc: 58 + i * 1.3 + Math.random() * 2,
  loss: 0.72 - i * 0.025 - Math.random() * 0.01,
}));

const ENDPOINTS = [
  { method: "GET", path: "/api/risk/score", desc: "Patient risk score (anonymized)", latency: 42 },
  { method: "POST", path: "/api/risk/predict", desc: "Run inference on new patient features", latency: 88 },
  { method: "GET", path: "/api/model/metrics", desc: "Accuracy / F1 / Precision / ROC-AUC", latency: 18 },
  { method: "GET", path: "/api/fairness", desc: "Subgroup parity report", latency: 31 },
  { method: "POST", path: "/api/explainability/shap", desc: "SHAP feature contributions", latency: 124 },
];

function DeveloperDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Developer Console"
        description="Model internals, training logs, API surface."
        actions={
          <Badge variant="outline" className="gap-1.5 border-primary/40 bg-primary/10 text-primary">
            <Code2 className="h-3 w-3" /> Developer View
          </Badge>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard title="Inference QPS" value={1248} change={6.4} icon={Activity} tone="primary" delay={0} />
        <KpiCard title="P95 Latency" value={142} suffix="ms" change={-3.1} icon={Cpu} tone="success" delay={0.05} />
        <KpiCard title="Models Deployed" value={2} change={0} icon={GitBranch} tone="primary" delay={0.1} />
        <KpiCard title="Training Rows" value={1071} change={0} icon={Database} tone="success" delay={0.15} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass-card border-0 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Training run · last retrain</CardTitle>
            <CardDescription>Train / validation accuracy per epoch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trainingHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="epoch" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Line type="monotone" dataKey="trainAcc" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} name="Train Acc" />
                  <Line type="monotone" dataKey="valAcc" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} name="Val Acc" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-2"><CardTitle className="text-base">Deployed models</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-xs">
            {Object.values(MODELS).map((m) => (
              <div key={m.key} className="rounded-lg border border-border bg-card/40 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{m.name}</span>
                  <Badge variant="outline" className="text-[10px]">prod</Badge>
                </div>
                <div className="mt-1 text-muted-foreground">{m.algorithm.split(" (")[0]}</div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <Stat label="Acc" v={`${m.metrics.accuracy.toFixed(1)}%`} />
                  <Stat label="F1" v={m.metrics.f1.toFixed(2)} />
                  <Stat label="AUC" v={m.metrics.rocAuc.toFixed(2)} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">API endpoints</CardTitle>
          <CardDescription>Backend surface · all responses are RBAC-checked & anonymized</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/60">
            {ENDPOINTS.map((e) => (
              <div key={e.path} className="grid grid-cols-12 gap-3 py-3 text-sm">
                <div className="col-span-1">
                  <Badge className={e.method === "GET" ? "bg-primary/15 text-primary border-0" : "bg-success/15 text-success border-0"}>
                    {e.method}
                  </Badge>
                </div>
                <div className="col-span-4 font-mono text-xs">{e.path}</div>
                <div className="col-span-5 text-muted-foreground text-xs">{e.desc}</div>
                <div className="col-span-2 text-right text-xs font-medium">{e.latency} ms p50</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, v }: { label: string; v: string }) {
  return (
    <div className="rounded bg-muted/40 px-1 py-1">
      <div className="text-[9px] text-muted-foreground">{label}</div>
      <div className="text-xs font-bold">{v}</div>
    </div>
  );
}
