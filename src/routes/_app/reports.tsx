import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, Mail, Calendar, FileSpreadsheet, Upload, Network, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useState } from "react";

export const Route = createFileRoute("/_app/reports")({
  component: ReportsPage,
  head: () => ({ meta: [{ title: "Reports & Export · Nyrova" }] }),
});

const templates = [
  { name: "Executive Summary", desc: "Weekly KPI roll-up with AI insights", icon: FileText, fmt: "PDF" },
  { name: "Risk Cohort Report", desc: "Anonymized cohort with risk bands", icon: FileSpreadsheet, fmt: "CSV" },
  { name: "Alert Audit Log", desc: "Full alert lifecycle and response times", icon: FileText, fmt: "PDF" },
  { name: "Fairness & Compliance", desc: "Bias, parity, regulatory posture", icon: FileText, fmt: "PDF" },
  { name: "ICU Forecast Snapshot", desc: "14-day ICU prediction with bands", icon: FileSpreadsheet, fmt: "XLSX" },
  { name: "Department Efficiency", desc: "Per-department KPIs and trends", icon: FileSpreadsheet, fmt: "CSV" },
];

const scheduled = [
  { name: "Daily KPI Brief", to: "leadership@nyrova.health", when: "Every day 7:00 AM", on: true },
  { name: "Weekly Risk Digest", to: "admins@nyrova.health", when: "Mondays 9:00 AM", on: true },
  { name: "Monthly Fairness Audit", to: "compliance@nyrova.health", when: "1st of month", on: false },
];

function ReportsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle");
  const [newMetrics, setNewMetrics] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setSyncStatus("idle");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/federated/upload_report", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.status === "success") {
        setSyncStatus("success");
        setNewMetrics(data.new_metrics);
      } else {
        setSyncStatus("error");
      }
    } catch (error) {
      setSyncStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    window.open("http://localhost:8000/federated/download", "_blank");
  };

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Reports & Federated Sync"
        description="Generate analytics reports and sync local hospital models with the global federated network."
        actions={<Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm rounded-full" size="sm"><Download className="h-4 w-4" />Snapshot Now</Button>}
      />

      <Card className="glass-card border border-primary/20 shadow-elevated rounded-3xl bg-gradient-to-br from-primary/5 to-transparent overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20">
              <Network className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-2xl font-heading font-bold text-foreground">Federated Network Sync (Admin)</CardTitle>
          </div>
          <CardDescription className="text-[13px] font-medium mt-1 max-w-2xl text-muted-foreground">Upload a raw patient dataset report. The local model will automatically extract knowledge and push the weights to the global federated average.</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 bg-white/40 p-6 rounded-2xl border border-white/50 shadow-sm">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Upload Patient Report (.csv)</Label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                  <input type="file" accept=".csv" onChange={handleFileChange} className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-[13px] file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer" />
                  <Button onClick={handleUpload} disabled={!file || isUploading} className="gap-2 shadow-sm rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                    <Upload className="h-4 w-4" />
                    {isUploading ? "Syncing..." : "Sync to Network"}
                  </Button>
                </div>
              </div>
              {syncStatus === "success" && newMetrics && (
                <div className="rounded-xl border border-primary/30 bg-primary/10 p-5 mt-4 shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-primary mb-2 text-lg font-heading">
                    <CheckCircle2 className="h-5 w-5" />
                    Global Model Updated!
                  </div>
                  <div className="text-sm text-foreground/80 space-y-2">
                    <p className="font-medium text-[13px]">Report analyzed and model knowledge extracted. Federated averaging completed successfully. The global disease predictor is now enhanced.</p>
                    <ul className="list-disc pl-5 mt-2 font-bold font-mono text-primary space-y-1">
                      <li>New Accuracy: {(newMetrics.accuracy * 100).toFixed(2)}%</li>
                      <li>New F1-Score: {(newMetrics.f1_score * 100).toFixed(2)}%</li>
                      <li>New ROC-AUC: {(newMetrics.roc_auc * 100).toFixed(2)}%</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center space-y-5 rounded-2xl border border-white/50 bg-white/30 p-8 text-center shadow-sm">
              <div>
                <h3 className="text-lg font-heading font-bold text-foreground">Get Latest Global Model</h3>
                <p className="text-[13px] text-muted-foreground font-medium mt-1 max-w-sm mx-auto">Download the synchronized network model to deploy locally in your hospital systems.</p>
              </div>
              <Button onClick={handleDownload} variant="outline" className="w-full gap-2 border-primary/20 hover:bg-primary/5 rounded-xl h-12 shadow-sm text-primary font-semibold">
                <Download className="h-4 w-4" />
                Download Global Weights
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border border-white/40 shadow-soft rounded-3xl overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-heading font-bold text-foreground">Report Configuration</CardTitle>
          <CardDescription className="text-xs font-medium">Customize what to include before exporting</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-4">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">Date Range</Label>
            <Select defaultValue="7d">
              <SelectTrigger className="h-10 rounded-xl bg-white/50 border-white"><SelectValue /></SelectTrigger>
              <SelectContent className="rounded-xl border-white/50 bg-white/80 backdrop-blur-md">
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">Department</Label>
            <Select defaultValue="all">
              <SelectTrigger className="h-10 rounded-xl bg-white/50 border-white"><SelectValue /></SelectTrigger>
              <SelectContent className="rounded-xl border-white/50 bg-white/80 backdrop-blur-md">
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="card">Cardiology</SelectItem>
                <SelectItem value="onco">Oncology</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">Format</Label>
            <Select defaultValue="pdf">
              <SelectTrigger className="h-10 rounded-xl bg-white/50 border-white"><SelectValue /></SelectTrigger>
              <SelectContent className="rounded-xl border-white/50 bg-white/80 backdrop-blur-md">
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button className="w-full gap-2 rounded-xl h-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm font-semibold"><Download className="h-4 w-4" />Generate</Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Report Templates</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Card key={t.name} className="glass-card border border-white/40 rounded-2xl transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/10">
                    <t.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-heading font-bold text-base text-foreground leading-tight">{t.name}</h3>
                      <Badge variant="outline" className="text-[9px] font-bold tracking-widest bg-white/50 border-white/40">{t.fmt}</Badge>
                    </div>
                    <p className="mt-1.5 text-[12px] font-medium text-muted-foreground">{t.desc}</p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 flex-1 text-xs rounded-lg bg-white/40 border-white/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"><Download className="mr-1.5 h-3.5 w-3.5" />Download</Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-lg bg-white/40 border-white/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"><Mail className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="glass-card border border-white/40 shadow-soft rounded-3xl overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /><CardTitle className="text-xl font-heading font-bold text-foreground">Scheduled Reports</CardTitle></div>
          <CardDescription className="text-xs font-medium">Automated email distribution</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border/30 pt-2">
          {scheduled.map((s) => (
            <div key={s.name} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 hover:bg-white/10 transition-colors -mx-4 px-4">
              <div className="flex-1">
                <div className="text-[15px] font-bold text-foreground">{s.name}</div>
                <div className="text-[11px] font-medium text-muted-foreground mt-0.5">{s.when} · {s.to}</div>
              </div>
              <Badge variant="outline" className={s.on ? "bg-primary/10 text-primary border-primary/30 font-bold uppercase tracking-widest text-[9px]" : "bg-muted/50 text-muted-foreground uppercase tracking-widest text-[9px] font-bold"}>
                {s.on ? "Active" : "Paused"}
              </Badge>
              <Switch defaultChecked={s.on} className="data-[state=checked]:bg-primary" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
