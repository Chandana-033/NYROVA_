import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCounter } from "@/hooks/use-theme";
import { sparkline } from "@/lib/mock-data";

interface Props {
  title: string;
  value: number;
  suffix?: string;
  change: number;
  icon: LucideIcon;
  tone?: "primary" | "danger" | "warning" | "success";
  format?: (n: number) => string;
  delay?: number;
}

const toneMap = {
  primary: { bg: "bg-primary/10", text: "text-primary", chart: "var(--color-chart-1)" },
  danger:  { bg: "bg-destructive/10", text: "text-destructive", chart: "var(--color-chart-4)" },
  warning: { bg: "bg-warning/15", text: "text-warning-foreground", chart: "var(--color-chart-3)" },
  success: { bg: "bg-success/15", text: "text-success", chart: "var(--color-chart-6)" },
};

export function KpiCard({ title, value, suffix, change, icon: Icon, tone = "primary", format, delay = 0 }: Props) {
  const animated = useCounter(value);
  const display = format ? format(animated) : Math.round(animated).toLocaleString();
  const t = toneMap[tone];
  const data = sparkline(value > 100 ? value / 30 : value);
  const positive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="glass-card relative overflow-hidden border-0">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">{title}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight">{display}</span>
                {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
              </div>
            </div>
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", t.bg)}>
              <Icon className={cn("h-5 w-5", t.text)} />
            </div>
          </div>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            )}>
              {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(change)}%
              <span className="text-muted-foreground/70 font-normal">vs last week</span>
            </div>
            <div className="h-10 w-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id={`spark-${title}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={t.chart} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={t.chart} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="y" stroke={t.chart} strokeWidth={2}
                        fill={`url(#spark-${title})`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
