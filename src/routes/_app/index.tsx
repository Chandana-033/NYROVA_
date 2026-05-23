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
  head: () => ({ meta: [{ title: "Overview · Nyrova" }] }),
});

function OverviewPage() {
  const [range, setRange] = useState("30d");
  const sliced = range === "7d" ? riskTrend.slice(-7) : range === "14d" ? riskTrend.slice(-14) : riskTrend;

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Hospital Overview"
        description="Real-time risk monitoring across all wards and patient populations."
        actions={
          <Badge variant="outline" className="gap-2 border-primary/20 bg-primary/5 text-primary shadow-sm px-3 py-1 font-bold tracking-widest uppercase text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Live · updated 12s ago
          </Badge>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard title="Total Patients Monitored" value={kpiData.totalPatients} change={kpiData.totalPatientsChange} icon={Users} tone="primary" delay={0} />
        <KpiCard title="High-Risk Today" value={kpiData.highRiskToday} change={kpiData.highRiskChange} icon={AlertTriangle} tone="danger" delay={0.05} />
        <KpiCard title="Avg Population Risk" value={kpiData.avgRiskScore} suffix="%" change={kpiData.avgRiskChange} icon={Activity} tone="warning" delay={0.1} />
        <KpiCard title="AI Model Accuracy" value={kpiData.modelAccuracy} suffix="%" change={kpiData.modelAccuracyChange} icon={Brain} tone="success" format={(n) => n.toFixed(1)} delay={0.15} />
        <KpiCard title="Active Alerts" value={kpiData.activeAlerts} change={kpiData.activeAlertsChange} icon={BellRing} tone="danger" delay={0.2} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="glass-card border border-white/40 shadow-elevated rounded-3xl lg:col-span-2 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4 relative z-10">
            <div>
              <CardTitle className="text-xl font-heading font-bold text-foreground">Risk Trend Analytics</CardTitle>
              <CardDescription className="text-xs font-medium mt-1">Population risk bands across selected window</CardDescription>
            </div>
            <Tabs value={range} onValueChange={setRange}>
              <TabsList className="h-9 bg-white/50 backdrop-blur-md rounded-xl p-1 shadow-sm">
                <TabsTrigger value="7d" className="h-7 text-xs rounded-lg font-bold">Daily</TabsTrigger>
                <TabsTrigger value="14d" className="h-7 text-xs rounded-lg font-bold">Weekly</TabsTrigger>
                <TabsTrigger value="30d" className="h-7 text-xs rounded-lg font-bold">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sliced}>
                  <defs>
                    <linearGradient id="lowG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-4)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--color-chart-4)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="medG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="highG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} vertical={false} />
                  <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip contentStyle={{ background: "rgba(250,243,232,0.9)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.5)", borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10, fontWeight: 500 }} />
                  <Area type="monotone" dataKey="low" stackId="1" stroke="var(--color-chart-4)" fill="url(#lowG)" name="Low Risk" />
                  <Area type="monotone" dataKey="medium" stackId="1" stroke="var(--color-chart-2)" fill="url(#medG)" name="Medium Risk" />
                  <Area type="monotone" dataKey="high" stackId="1" stroke="var(--color-chart-1)" fill="url(#highG)" name="High Risk" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border border-white/40 shadow-elevated rounded-3xl overflow-hidden relative">
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-xl font-heading font-bold text-foreground">Risk Distribution</CardTitle>
            <CardDescription className="text-xs font-medium mt-1">Current patient population</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 pt-4">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDistribution} dataKey="value" innerRadius={65} outerRadius={95} paddingAngle={4}>
                    {riskDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.name === 'High' ? 'var(--color-chart-1)' : entry.name === 'Medium' ? 'var(--color-chart-2)' : 'var(--color-chart-4)'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "rgba(250,243,232,0.9)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.5)", borderRadius: 16 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {riskDistribution.map((r) => {
                 const color = r.name === 'High' ? 'var(--color-chart-1)' : r.name === 'Medium' ? 'var(--color-chart-2)' : 'var(--color-chart-4)';
                 return (
                   <div key={r.name} className="flex items-center justify-between text-[13px] bg-white/30 px-3 py-2 rounded-xl">
                     <div className="flex items-center gap-2 font-medium">
                       <span className="h-3 w-3 rounded-full shadow-sm" style={{ background: color }} />
                       {r.name} Risk
                     </div>
                     <span className="font-mono font-bold text-foreground">{r.value.toLocaleString()}</span>
                   </div>
                 );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="glass-card border border-white/40 shadow-elevated rounded-3xl lg:col-span-2 overflow-hidden relative">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-heading font-bold text-foreground">Risk by Disease Category</CardTitle>
            <CardDescription className="text-xs font-medium mt-1">Stacked breakdown across the active population</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diseaseCategories}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} vertical={false} />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip contentStyle={{ background: "rgba(250,243,232,0.9)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.5)", borderRadius: 16 }} cursor={{fill: 'rgba(255,255,255,0.2)'}} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10, fontWeight: 500 }} />
                  <Bar dataKey="low" stackId="a" fill="var(--color-chart-4)" radius={[0, 0, 0, 0]} name="Low Risk" />
                  <Bar dataKey="medium" stackId="a" fill="var(--color-chart-2)" name="Medium Risk" />
                  <Bar dataKey="high" stackId="a" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} name="High Risk" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 shadow-elevated rounded-3xl overflow-hidden relative">
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-xl shadow-soft">
                 <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl font-heading font-bold text-primary">AI Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 relative z-10">
            {[
              { icon: TrendingUp, tone: "text-primary", bg: "bg-white/60", text: "Cardiac ward risk increased by 18% this week.", sub: "Recommend additional staffing." },
              { icon: Activity, tone: "text-primary/80", bg: "bg-white/60", text: "ICU occupancy projected to hit 92% by Friday.", sub: "Plan early discharges." },
              { icon: Brain, tone: "text-primary", bg: "bg-primary/10", text: "Model retraining improved recall by +1.4 pts.", sub: "Deployed 2h ago." },
            ].map((i, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.08 }}
                className="flex gap-4 rounded-2xl bg-white/40 p-4 border border-white/50 hover:bg-white/60 transition-colors shadow-sm"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${i.bg}`}>
                  <i.icon className={`h-5 w-5 ${i.tone}`} />
                </div>
                <div className="text-[13px]">
                  <p className="font-semibold leading-snug text-foreground">{i.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground font-medium">{i.sub}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border border-white/40 shadow-soft rounded-3xl overflow-hidden relative">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-heading font-bold text-foreground">Recent Critical Alerts</CardTitle>
          <CardDescription className="text-xs font-medium mt-1">Last 24 hours · auto-refreshing</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="divide-y divide-border/30">
            {alerts.slice(0, 4).map((a) => (
              <div key={a.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 hover:bg-white/10 transition-colors -mx-4 px-4">
                <div className={`h-3 w-3 rounded-full shadow-sm ${a.severity === "critical" ? "bg-primary" : a.severity === "high" ? "bg-accent" : "bg-primary/50"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-foreground">{a.title}</p>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">{a.ward} · Confidence <span className="font-mono text-primary font-bold">{a.confidence}%</span></p>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold tracking-widest uppercase bg-white/50 border-white">{a.time}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
