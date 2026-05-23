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
  primary: { bg: "bg-primary/10 border-primary/20", text: "text-primary", chart: "var(--color-chart-1)" },
  danger:  { bg: "bg-destructive/10 border-destructive/20", text: "text-destructive", chart: "var(--color-chart-4)" },
  warning: { bg: "bg-warning/15 border-warning/20", text: "text-warning-foreground", chart: "var(--color-chart-2)" },
  success: { bg: "bg-primary/5 border-primary/20", text: "text-primary", chart: "var(--color-chart-1)" },
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
      <Card className="glass-card relative overflow-hidden border border-white/40 shadow-elevated rounded-3xl hover:-translate-y-1 transition-transform duration-300 group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-mono font-bold tracking-tight text-foreground">{display}</span>
                {suffix && <span className="text-sm font-bold text-muted-foreground">{suffix}</span>}
              </div>
            </div>
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm transition-colors group-hover:bg-primary/20", t.bg)}>
              <Icon className={cn("h-6 w-6", t.text)} />
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between gap-3 relative z-10">
            <div className={cn(
              "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wider shadow-sm",
              positive ? "bg-primary/10 text-primary border border-primary/20" : "bg-destructive/10 text-destructive border border-destructive/20"
            )}>
              {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(change)}%
            </div>
            <div className="h-10 w-24 opacity-80 group-hover:opacity-100 transition-opacity">
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
