import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb, Info } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { featureImportance, waterfall } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/explainability")({
  component: ExplainabilityPage,
  head: () => ({ meta: [{ title: "Explainability · Nyrova" }] }),
});

function ExplainabilityPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Explainability"
        description="Feature importance, contribution breakdown, and reasoning transparency."
        actions={<Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">Model v2.4 · 89% confidence</Badge>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Contributing Features (SHAP)</CardTitle>
            <CardDescription>Global feature importance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureImportance} layout="vertical" margin={{ left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis type="category" dataKey="feature" stroke="var(--color-muted-foreground)" fontSize={11} width={130} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {featureImportance.map((_, i) => (
                      <Cell key={i} fill={`color-mix(in oklab, var(--color-chart-1) ${100 - i * 8}%, var(--color-chart-2))`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Contribution Waterfall</CardTitle>
            <CardDescription>How features build up to final risk</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterfall}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={10} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {waterfall.map((r, i) => (
                      <Cell key={i} fill={r.type === "pos" ? "var(--color-chart-4)" : r.type === "neg" ? "var(--color-chart-6)" : r.type === "total" ? "var(--color-chart-1)" : "var(--color-muted-foreground)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-0">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2"><Lightbulb className="h-4 w-4 text-primary" /><CardTitle className="text-base">Why this risk score?</CardTitle></div>
          <CardDescription>Sample cohort PT-10024 · final score 49%</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
            <p className="leading-relaxed">
              The AI model assigned a <span className="font-semibold text-primary">medium-risk (49%)</span> score primarily because of
              elevated <span className="font-semibold">blood pressure (+12)</span>, abnormal <span className="font-semibold">glucose readings (+8)</span>,
              and lower <span className="font-semibold">oxygen saturation (+6)</span>. Recent regular activity (-4)
              and stable heart rate (-3) reduced the prediction.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card/40 p-4">
              <div className="text-xs text-muted-foreground">Confidence Interval</div>
              <div className="mt-1 text-lg font-semibold">44% – 54%</div>
              <Progress value={89} className="mt-2 h-1.5" />
              <div className="mt-1 text-[10px] text-muted-foreground">Model confidence 89%</div>
            </div>
            <div className="rounded-xl border border-border bg-card/40 p-4">
              <div className="flex items-center gap-1 text-xs text-muted-foreground"><Info className="h-3 w-3" />Method</div>
              <div className="mt-1 text-sm font-semibold">SHAP + Counterfactuals</div>
              <p className="mt-1 text-[10px] text-muted-foreground">Computed on 12 features across 30-day window.</p>
            </div>
            <div className="rounded-xl border border-border bg-card/40 p-4">
              <div className="text-xs text-muted-foreground">Data Provenance</div>
              <div className="mt-1 text-sm font-semibold">3 sources · audited</div>
              <p className="mt-1 text-[10px] text-muted-foreground">EHR, lab, vitals telemetry.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
