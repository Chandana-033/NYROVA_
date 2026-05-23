import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Brain, Activity, Database, GitBranch, Target, Sigma } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MODELS, ALGORITHM_EXPLAINER, type ModelKey } from "@/lib/ml-model";

export const Route = createFileRoute("/_app/model")({
  component: ModelPage,
  head: () => ({ meta: [{ title: "Model Insights · VitaPredict" }] }),
});

function ModelPage() {
  const [active, setActive] = useState<ModelKey>("diabetes");
  const m = MODELS[active];
  const algo = active === "diabetes" ? ALGORITHM_EXPLAINER.randomForest : ALGORITHM_EXPLAINER.xgboost;

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Model Insights"
        description="Trained on real Kaggle / UCI datasets · live performance metrics."
        actions={
          <Badge variant="outline" className="gap-1.5 border-success/40 bg-success/10 text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Model healthy
          </Badge>
        }
      />

      <Tabs value={active} onValueChange={(v) => setActive(v as ModelKey)}>
        <TabsList>
          <TabsTrigger value="diabetes">Diabetes (Pima · 768 pts)</TabsTrigger>
          <TabsTrigger value="heart">Heart Disease (UCI · 303 pts)</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {[
          { label: "Accuracy", value: `${m.metrics.accuracy.toFixed(1)}%`, icon: Target, tone: "text-success" },
          { label: "Precision", value: m.metrics.precision.toFixed(2), icon: Sigma, tone: "text-primary" },
          { label: "Recall", value: m.metrics.recall.toFixed(2), icon: Activity, tone: "text-warning-foreground" },
          { label: "F1 Score", value: m.metrics.f1.toFixed(3), icon: Brain, tone: "text-primary" },
          { label: "ROC-AUC", value: m.metrics.rocAuc.toFixed(2), icon: GitBranch, tone: "text-success" },
        ].map((s) => (
          <Card key={s.label} className="glass-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <s.icon className={`h-4 w-4 ${s.tone}`} /> {s.label}
              </div>
              <div className="mt-2 text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass-card border-0 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Feature importance</CardTitle>
            <CardDescription>How much each input drives the prediction (gain).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={m.featureImportance} layout="vertical" margin={{ left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis type="category" dataKey="feature" stroke="var(--color-muted-foreground)" fontSize={11} width={140} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Bar dataKey="importance" fill="var(--color-chart-1)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Model card</CardTitle>
            </div>
            <CardDescription>{m.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <Row k="Dataset" v={m.dataset} />
            <Row k="Source" v={m.source} />
            <Row k="Rows × Features" v={`${m.rows} × ${m.features}`} />
            <Row k="Algorithm" v={m.algorithm} />
            <Row k="CV folds" v={`${m.metrics.cvFolds} (σ=${m.metrics.cvStd})`} />
            <Row k="Last trained" v={m.lastTrained} />
            <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3 font-mono text-[10px] leading-relaxed">
              {Object.entries(m.hyperparameters).map(([k, v]) => (
                <div key={k}><span className="text-muted-foreground">{k}:</span> {String(v)}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">How {algo.name} works</CardTitle>
            <CardDescription>End-to-end training pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{algo.summary}</p>
            <ol className="mt-4 space-y-2 text-sm">
              {algo.steps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full gradient-primary text-[10px] font-bold text-white">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Confusion matrix · hold-out set</CardTitle>
            <CardDescription>How accurately is it predicting?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Cell label="True Positives" v={m.confusion.tp} tone="success" />
              <Cell label="False Positives" v={m.confusion.fp} tone="warning" />
              <Cell label="False Negatives" v={m.confusion.fn} tone="danger" />
              <Cell label="True Negatives" v={m.confusion.tn} tone="primary" />
            </div>
            <div className="mt-4 space-y-3">
              <Metric label="Precision (TP / TP+FP)" v={m.metrics.precision} />
              <Metric label="Recall / Sensitivity (TP / TP+FN)" v={m.metrics.recall} />
              <Metric label="F1 — harmonic mean of P & R" v={m.metrics.f1} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-right">{v}</span>
    </div>
  );
}

function Cell({ label, v, tone }: { label: string; v: number; tone: "success" | "warning" | "danger" | "primary" }) {
  const colors = {
    success: "bg-success/10 text-success border-success/30",
    warning: "bg-warning/15 text-warning-foreground border-warning/30",
    danger: "bg-destructive/10 text-destructive border-destructive/30",
    primary: "bg-primary/10 text-primary border-primary/30",
  } as const;
  return (
    <div className={`rounded-xl border p-4 ${colors[tone]}`}>
      <div className="text-[10px] uppercase tracking-wide opacity-80">{label}</div>
      <div className="mt-1 text-2xl font-bold">{v}</div>
    </div>
  );
}

function Metric({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{v.toFixed(3)}</span>
      </div>
      <Progress value={v * 100} className="mt-1 h-1.5" />
    </div>
  );
}
