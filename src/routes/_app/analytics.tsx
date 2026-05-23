import { createFileRoute } from "@tanstack/react-router";
import {
  Bed, Brain, Stethoscope, TrendingUp,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis,
  Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { icuForecast, resourceUtil, departmentRadar } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/analytics")({
  component: AnalyticsPage,
  head: () => ({ meta: [{ title: "Hospital Analytics · Nyrova" }] }),
});

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Hospital Analytics" description="Resource forecasting and operational intelligence." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "ICU Occupancy", value: "82%", icon: Bed, tone: "text-destructive", bg: "bg-destructive/10", sub: "+6% vs yesterday" },
          { label: "Staff Utilization", value: "78%", icon: Stethoscope, tone: "text-primary", bg: "bg-primary/10", sub: "Within target" },
          { label: "Forecast Confidence", value: "91.4%", icon: Brain, tone: "text-success", bg: "bg-success/15", sub: "Model v2.4" },
        ].map((k) => (
          <Card key={k.label} className="glass-card border-0">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${k.bg}`}>
                <k.icon className={`h-6 w-6 ${k.tone}`} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{k.label}</div>
                <div className="text-2xl font-bold">{k.value}</div>
                <div className="text-[10px] text-muted-foreground">{k.sub}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="glass-card border-0 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">ICU Occupancy Forecast</CardTitle>
            <CardDescription>Actual vs 7-day AI prediction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={icuForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="actual" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={{ r: 3 }} name="Actual" />
                  <Line type="monotone" dataKey="predicted" stroke="var(--color-chart-3)" strokeWidth={2.5} strokeDasharray="6 4" dot={false} name="Predicted" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /><CardTitle className="text-base">AI Insights</CardTitle></div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-3">
              <div className="font-semibold text-destructive">Cardiac ward</div>
              <p className="mt-1 text-muted-foreground">Risk increased by 18% this week. Consider re-staffing.</p>
            </div>
            <div className="rounded-xl bg-warning/10 border border-warning/30 p-3">
              <div className="font-semibold text-warning-foreground">ER admissions</div>
              <p className="mt-1 text-muted-foreground">Forecast +14% over weekend. Prepare overflow beds.</p>
            </div>
            <div className="rounded-xl bg-success/10 border border-success/30 p-3">
              <div className="font-semibold text-success">Oncology</div>
              <p className="mt-1 text-muted-foreground">Length of stay down 6% — process improvements working.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Resource Utilization</CardTitle>
            <CardDescription>Current vs capacity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resourceUtil} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} width={100} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Bar dataKey="capacity" fill="var(--color-muted)" radius={[0, 8, 8, 0]} name="Capacity" />
                  <Bar dataKey="used" fill="var(--color-chart-1)" radius={[0, 8, 8, 0]} name="Used" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Department Efficiency</CardTitle>
            <CardDescription>Multi-dimensional performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={departmentRadar}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="dept" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                  <PolarRadiusAxis stroke="var(--color-muted-foreground)" fontSize={10} />
                  <Radar dataKey="efficiency" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.4} name="Efficiency" />
                  <Radar dataKey="utilization" stroke="var(--color-chart-2)" fill="var(--color-chart-2)" fillOpacity={0.3} name="Utilization" />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
