import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, Mail, Calendar, FileSpreadsheet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/dashboard/PageHeader";

export const Route = createFileRoute("/_app/reports")({
  component: ReportsPage,
  head: () => ({ meta: [{ title: "Reports & Export · VitaPredict" }] }),
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
  { name: "Daily KPI Brief", to: "leadership@hosp", when: "Every day 7:00 AM", on: true },
  { name: "Weekly Risk Digest", to: "admins@hosp", when: "Mondays 9:00 AM", on: true },
  { name: "Monthly Fairness Audit", to: "compliance@hosp", when: "1st of month", on: false },
];

function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Export"
        description="Generate, schedule, and distribute analytics reports."
        actions={<Button className="gap-2 gradient-primary text-white" size="sm"><Download className="h-4 w-4" />Snapshot Now</Button>}
      />

      <Card className="glass-card border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Report Configuration</CardTitle>
          <CardDescription>Customize what to include before exporting</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Date Range</Label>
            <Select defaultValue="7d">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Department</Label>
            <Select defaultValue="all">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="card">Cardiology</SelectItem>
                <SelectItem value="onco">Oncology</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Format</Label>
            <Select defaultValue="pdf">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button className="w-full gap-2 gradient-primary text-white"><Download className="h-4 w-4" />Generate</Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Report Templates</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Card key={t.name} className="glass-card border-0 transition hover:shadow-elevated">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <t.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">{t.name}</h3>
                      <Badge variant="outline" className="text-[10px]">{t.fmt}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
                    <div className="mt-3 flex gap-1.5">
                      <Button size="sm" variant="outline" className="h-7 flex-1 text-xs"><Download className="mr-1 h-3 w-3" />Download</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs"><Mail className="h-3 w-3" /></Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="glass-card border-0">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /><CardTitle className="text-base">Scheduled Reports</CardTitle></div>
          <CardDescription>Automated email distribution</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border/60">
          {scheduled.map((s) => (
            <div key={s.name} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
              <div className="flex-1">
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-[11px] text-muted-foreground">{s.when} · {s.to}</div>
              </div>
              <Badge variant="outline" className={s.on ? "bg-success/10 text-success border-success/30" : "bg-muted text-muted-foreground"}>
                {s.on ? "Active" : "Paused"}
              </Badge>
              <Switch defaultChecked={s.on} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
