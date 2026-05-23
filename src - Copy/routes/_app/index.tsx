import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, AlertTriangle, Activity, Brain, BellRing, Sparkles, TrendingUp,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import {
  kpiData, riskTrend, diseaseCategories, riskDistribution, alerts,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_app/")({
  component: OverviewPage,
  head: () => ({ meta: [{ title: "Overview · VitaPredict" }] }),
});

function OverviewPage() {
  const [range, setRange] = useState("30d");
  const sliced = range === "7d" ? riskTrend.slice(-7) : range === "14d" ? riskTrend.slice(-14) : riskTrend;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hospital Overview"
        description="Real-time risk monitoring across all wards and patient populations."
        actions={
          <Badge variant="outline" className="gap-1.5 border-success/40 bg-success/10 text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Live · updated 12s ago
          </Badge>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard title="Total Patients Monitored" value={kpiData.totalPatients} change={kpiData.totalPatientsChange} icon={Users} tone="primary" delay={0} />
        <KpiCard title="High-Risk Today" value={kpiData.highRiskToday} change={kpiData.highRiskChange} icon={AlertTriangle} tone="danger" delay={0.05} />
        <KpiCard title="Avg Population Risk" value={kpiData.avgRiskScore} suffix="%" change={kpiData.avgRiskChange} icon={Activity} tone="warning" delay={0.1} />
        <KpiCard title="AI Model Accuracy" value={kpiData.modelAccuracy} suffix="%" change={kpiData.modelAccuracyChange} icon={Brain} tone="success" format={(n) => n.toFixed(1)} delay={0.15} />
        <KpiCard title="Active Alerts" value={kpiData.activeAlerts} change={kpiData.activeAlertsChange} icon={BellRing} tone="danger" delay={0.2} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="glass-card border-0 lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base">Risk Trend Analytics</CardTitle>
              <CardDescription>Population risk bands across selected window</CardDescription>
            </div>
            <Tabs value={range} onValueChange={setRange}>
              <TabsList className="h-8">
                <TabsTrigger value="7d" className="h-6 text-xs">Daily</TabsTrigger>
                <TabsTrigger value="14d" className="h-6 text-xs">Weekly</TabsTrigger>
                <TabsTrigger value="30d" className="h-6 text-xs">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sliced}>
                  <defs>
                    <linearGradient id="lowG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-6)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--color-chart-6)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="medG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="highG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-4)" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="var(--color-chart-4)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="low" stackId="1" stroke="var(--color-chart-6)" fill="url(#lowG)" name="Low" />
                  <Area type="monotone" dataKey="medium" stackId="1" stroke="var(--color-chart-3)" fill="url(#medG)" name="Medium" />
                  <Area type="monotone" dataKey="high" stackId="1" stroke="var(--color-chart-4)" fill="url(#highG)" name="High" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Risk Distribution</CardTitle>
            <CardDescription>Current patient population</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDistribution} dataKey="value" innerRadius={60} outerRadius={95} paddingAngle={3}>
                    {riskDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1.5">
              {riskDistribution.map((r) => (
                <div key={r.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
                    {r.name}
                  </div>
                  <span className="font-semibold">{r.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="glass-card border-0 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Risk by Disease Category</CardTitle>
            <CardDescription>Stacked breakdown across the active population</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diseaseCategories}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="low" stackId="a" fill="var(--color-chart-6)" radius={[0, 0, 0, 0]} name="Low" />
                  <Bar dataKey="medium" stackId="a" fill="var(--color-chart-3)" name="Medium" />
                  <Bar dataKey="high" stackId="a" fill="var(--color-chart-4)" radius={[8, 8, 0, 0]} name="High" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">AI Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: TrendingUp, tone: "text-destructive", bg: "bg-destructive/10", text: "Cardiac ward risk increased by 18% this week.", sub: "Recommend additional staffing." },
              { icon: Activity, tone: "text-warning-foreground", bg: "bg-warning/15", text: "ICU occupancy projected to hit 92% by Friday.", sub: "Plan early discharges." },
              { icon: Brain, tone: "text-primary", bg: "bg-primary/10", text: "Model retraining improved recall by +1.4 pts.", sub: "Deployed 2h ago." },
            ].map((i, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.08 }}
                className="flex gap-3 rounded-xl bg-muted/40 p-3"
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${i.bg}`}>
                  <i.icon className={`h-4 w-4 ${i.tone}`} />
                </div>
                <div className="text-xs">
                  <p className="font-medium leading-snug">{i.text}</p>
                  <p className="mt-0.5 text-muted-foreground">{i.sub}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent Critical Alerts</CardTitle>
          <CardDescription>Last 24 hours · auto-refreshing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/60">
            {alerts.slice(0, 4).map((a) => (
              <div key={a.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className={`h-2.5 w-2.5 rounded-full ${a.severity === "critical" ? "bg-destructive" : a.severity === "high" ? "bg-warning" : "bg-primary"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.ward} · confidence {a.confidence}%</p>
                </div>
                <Badge variant="outline" className="text-[10px]">{a.time}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
