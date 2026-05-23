import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Scale, Eye, Download } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, PolarAngleAxis, PolarGrid, Radar, RadarChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { fairnessByGroup, fairnessGender } from "@/lib/mock-data";
import { MODELS } from "@/lib/ml-model";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/fairness")({
  component: FairnessPage,
  head: () => ({ meta: [{ title: "Fairness Report · VitaPredict" }] }),
});

const headlineMetrics = [
  { label: "Disparate Impact", value: 0.91, target: "≥ 0.80", tone: "success" as const },
  { label: "Transparency Score", value: 0.87, target: "≥ 0.85", tone: "success" as const },
  { label: "Demographic Parity", value: 0.78, target: "≥ 0.80", tone: "warning" as const },
];

function downloadFairnessPdf() {
  try {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageW, 70, "F");
    doc.setTextColor(255);
    doc.setFontSize(18);
    doc.text("VitaPredict — AI Fairness & Bias Report", 32, 32);
    doc.setFontSize(10);
    doc.text(`Generated ${new Date().toLocaleString()} · St. Mary's Medical Center`, 32, 52);

    doc.setTextColor(20);
    doc.setFontSize(12);
    doc.text("Compliance Headlines", 32, 100);

    autoTable(doc, {
      startY: 110,
      head: [["Metric", "Value", "Target", "Status"]],
      body: headlineMetrics.map((m) => [
        m.label,
        m.value.toFixed(2),
        m.target,
        m.tone === "success" ? "PASS" : "WATCH",
      ]),
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.setFontSize(12);
    doc.text("Accuracy by Age Group", 32, (doc as any).lastAutoTable.finalY + 30);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 38,
      head: [["Age Group", "Accuracy (%)"]],
      body: fairnessByGroup.map((g) => [g.group, g.accuracy.toFixed(1)]),
      theme: "grid",
      headStyles: { fillColor: [20, 184, 166] },
    });

    doc.setFontSize(12);
    doc.text("Performance by Gender", 32, (doc as any).lastAutoTable.finalY + 30);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 38,
      head: [["Group", "Accuracy", "Recall", "Precision"]],
      body: fairnessGender.map((g) => [g.group, g.accuracy, g.recall, g.precision]),
      theme: "grid",
      headStyles: { fillColor: [20, 184, 166] },
    });

    doc.addPage();
    doc.setFontSize(14);
    doc.text("Model Performance Summary", 32, 50);
    autoTable(doc, {
      startY: 70,
      head: [["Model", "Dataset", "Algorithm", "Accuracy", "Precision", "Recall", "F1", "ROC-AUC"]],
      body: Object.values(MODELS).map((m) => [
        m.name,
        `${m.dataset} (${m.rows} rows)`,
        m.algorithm.split(" (")[0],
        `${m.metrics.accuracy.toFixed(1)}%`,
        m.metrics.precision.toFixed(2),
        m.metrics.recall.toFixed(2),
        m.metrics.f1.toFixed(3),
        m.metrics.rocAuc.toFixed(2),
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      "This report is generated from anonymized, aggregated subgroup statistics. No PHI is included.",
      32,
      (doc as any).lastAutoTable.finalY + 30,
      { maxWidth: pageW - 64 },
    );

    doc.save(`VitaPredict-Fairness-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success("Fairness report downloaded");
  } catch (e) {
    console.error(e);
    toast.error("Could not generate PDF");
  }
}

function FairnessPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Fairness Report"
        description="Bias monitoring, subgroup performance, and compliance posture."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 border-success/40 bg-success/10 text-success">
              <ShieldCheck className="h-3 w-3" />Compliant
            </Badge>
            <Button size="sm" onClick={downloadFairnessPdf} className="gradient-primary text-white">
              <Download className="mr-1.5 h-4 w-4" /> Download PDF
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {headlineMetrics.map((m) => (
          <Card key={m.label} className="glass-card border-0">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Scale className="h-4 w-4" />{m.label}</div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold">{m.value}</span>
                <span className="text-xs text-muted-foreground">target {m.target}</span>
              </div>
              <Progress value={m.value * 100} className="mt-3 h-1.5" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Accuracy by Age Group</CardTitle>
            <CardDescription>Subgroup model performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fairnessByGroup}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="group" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis domain={[85, 100]} stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Bar dataKey="accuracy" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Fairness Radar (by gender)</CardTitle>
            <CardDescription>Accuracy, recall, precision parity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={fairnessGender}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="group" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                  <Radar dataKey="accuracy" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.4} />
                  <Radar dataKey="recall" stroke="var(--color-chart-2)" fill="var(--color-chart-2)" fillOpacity={0.3} />
                  <Radar dataKey="precision" stroke="var(--color-chart-5)" fill="var(--color-chart-5)" fillOpacity={0.2} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-0">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2"><Eye className="h-4 w-4 text-primary" /><CardTitle className="text-base">Explainability & Compliance</CardTitle></div>
          <CardDescription>Model card and audit posture</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {[
            { title: "HIPAA", status: "Compliant", color: "success" },
            { title: "GDPR", status: "Compliant", color: "success" },
            { title: "FDA SaMD", status: "In Review", color: "warning" },
          ].map((c) => (
            <div key={c.title} className="rounded-xl border border-border bg-card/40 p-4">
              <div className="text-xs text-muted-foreground">{c.title}</div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-base font-semibold">{c.status}</span>
                <span className={`h-2.5 w-2.5 rounded-full ${c.color === "success" ? "bg-success" : "bg-warning"}`} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
