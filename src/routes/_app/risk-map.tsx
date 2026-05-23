import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { regions, wardHeatmap } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/risk-map")({
  component: RiskMapPage,
  head: () => ({ meta: [{ title: "Risk Map · Nyrova" }] }),
});

const riskColor = (r: number) =>
  r > 75 ? "oklch(0.63 0.23 28)" : r > 50 ? "oklch(0.78 0.16 75)" : "oklch(0.70 0.16 160)";

function RiskMapPage() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Population Risk Map"
        description="Geographic and ward-level risk density across the hospital network."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select defaultValue="all">
              <SelectTrigger className="h-9 w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="main">Main Campus</SelectItem>
                <SelectItem value="north">North Branch</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="h-9 w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="cardiac">Cardiac</SelectItem>
                <SelectItem value="resp">Respiratory</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="7d">
              <SelectTrigger className="h-9 w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="glass-card border-0 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Facility Risk Heatmap</CardTitle>
            <CardDescription>Hover clusters to inspect region details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/5 via-background to-secondary/30">
              <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
              {regions.map((r, i) => {
                const size = 60 + (r.risk / 100) * 80;
                return (
                  <motion.div
                    key={r.name}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.08, type: "spring" }}
                    style={{ left: `${r.x}%`, top: `${r.y}%`, width: size, height: size, background: `radial-gradient(circle, ${riskColor(r.risk)}66 0%, transparent 70%)` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className="absolute inset-0 m-auto flex h-3 w-3 items-center justify-center rounded-full" style={{ background: riskColor(r.risk) }}>
                      <div className="absolute h-3 w-3 animate-ping rounded-full opacity-60" style={{ background: riskColor(r.risk) }} />
                    </div>
                    {hovered === i && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        className="glass-card absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg p-2.5 text-xs shadow-elevated"
                      >
                        <div className="font-semibold flex items-center gap-1.5"><MapPin className="h-3 w-3" />{r.name}</div>
                        <div className="mt-1 text-muted-foreground">Risk: <span className="font-semibold" style={{ color: riskColor(r.risk) }}>{r.risk}%</span></div>
                        <div className="text-muted-foreground">{r.patients} patients</div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
              <div className="absolute bottom-3 left-3 glass-card flex items-center gap-3 rounded-lg p-2 text-[10px]">
                <span className="font-medium">Intensity:</span>
                <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" />Low</div>
                <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" />Medium</div>
                <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive" />High</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Ward Heatmap</CardTitle>
            <CardDescription>Risk vs bed occupancy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {wardHeatmap.map((w) => (
              <div key={w.ward} className="rounded-lg border border-border bg-card/40 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{w.ward}</span>
                  <Badge variant="outline" className="text-[10px]" style={{ color: riskColor(w.risk), borderColor: riskColor(w.risk) }}>
                    {w.risk}% risk
                  </Badge>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                  <div>
                    <div className="mb-1 flex justify-between"><span>Risk</span><span>{w.risk}%</span></div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full" style={{ width: `${w.risk}%`, background: riskColor(w.risk) }} />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between"><span>Occupancy</span><span>{w.occupancy}%</span></div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${w.occupancy}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
