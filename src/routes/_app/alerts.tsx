import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, AlertTriangle, ArrowUpRight, Settings2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { alerts } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/alerts")({
  component: AlertsPage,
  head: () => ({ meta: [{ title: "Alerts · Nyrova" }] }),
});

const sevStyle = (s: string) =>
  s === "critical" ? "bg-destructive/15 text-destructive border-destructive/40"
  : s === "high" ? "bg-warning/15 text-warning-foreground border-warning/40"
  : "bg-primary/10 text-primary border-primary/30";

function AlertsPage() {
  const [high, setHigh] = useState([75]);
  const [med, setMed] = useState([50]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alert Center"
        description="Real-time AI-driven alerts with escalation workflow."
        actions={
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">12 Open</Badge>
            <Badge variant="outline" className="bg-warning/15 text-warning-foreground border-warning/30">5 Escalated</Badge>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {alerts.map((a) => (
            <Card key={a.id} className="glass-card border-0 transition hover:shadow-elevated">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${a.severity === "critical" ? "bg-destructive/15" : a.severity === "high" ? "bg-warning/15" : "bg-primary/10"}`}>
                    <AlertTriangle className={`h-5 w-5 ${a.severity === "critical" ? "text-destructive" : a.severity === "high" ? "text-warning-foreground" : "text-primary"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-sm">{a.title}</h3>
                      <Badge variant="outline" className={sevStyle(a.severity)}>{a.severity}</Badge>
                      <Badge variant="outline" className="text-[10px]">{a.status}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{a.reason}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                      <span>{a.ward}</span>
                      <span>·</span>
                      <span>{a.time}</span>
                      <span>·</span>
                      <span>AI confidence: <span className="font-semibold text-foreground">{a.confidence}%</span></span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="outline" className="h-8 text-xs"><CheckCircle2 className="mr-1 h-3 w-3" />Ack</Button>
                    <Button size="sm" variant="outline" className="h-8 text-xs">Resolve</Button>
                    <Button size="sm" className="h-8 gradient-primary text-white text-xs"><ArrowUpRight className="mr-1 h-3 w-3" />Escalate</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="glass-card border-0 h-fit">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2"><Settings2 className="h-4 w-4 text-primary" /><CardTitle className="text-base">Threshold Configuration</CardTitle></div>
            <CardDescription>Tune auto-alert sensitivity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-xs"><span className="font-medium">High-risk threshold</span><span className="font-semibold text-destructive">{high[0]}%</span></div>
              <Slider value={high} onValueChange={setHigh} min={50} max={100} step={1} />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-xs"><span className="font-medium">Medium-risk threshold</span><span className="font-semibold text-warning-foreground">{med[0]}%</span></div>
              <Slider value={med} onValueChange={setMed} min={20} max={75} step={1} />
            </div>
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex items-center justify-between"><Label htmlFor="auto" className="text-xs">Auto-escalate critical</Label><Switch id="auto" defaultChecked /></div>
              <div className="flex items-center justify-between"><Label htmlFor="email" className="text-xs">Email notifications</Label><Switch id="email" defaultChecked /></div>
              <div className="flex items-center justify-between"><Label htmlFor="sms" className="text-xs">SMS to on-call</Label><Switch id="sms" /></div>
              <div className="flex items-center justify-between"><Label htmlFor="quiet" className="text-xs">Quiet hours (10pm–6am)</Label><Switch id="quiet" /></div>
            </div>
            <Button className="w-full gradient-primary text-white">Save Thresholds</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
