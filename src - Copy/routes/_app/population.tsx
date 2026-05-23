import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search, Download, ArrowUpDown, ChevronLeft, ChevronRight, TrendingUp, TrendingDown,
} from "lucide-react";
import {
  Area, AreaChart, ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { populationRows, sparkline, wards } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/population")({
  component: PopulationPage,
  head: () => ({ meta: [{ title: "Population Table · VitaPredict" }] }),
});

const levelStyle = (l: string) =>
  l === "High" ? "bg-destructive/15 text-destructive border-destructive/30"
  : l === "Medium" ? "bg-warning/15 text-warning-foreground border-warning/30"
  : "bg-success/15 text-success border-success/30";

function PopulationPage() {
  const [q, setQ] = useState("");
  const [ward, setWard] = useState("all");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<typeof populationRows[number] | null>(null);

  const filtered = useMemo(() =>
    populationRows.filter(r =>
      (ward === "all" || r.ward === ward) &&
      (q === "" || r.id.toLowerCase().includes(q.toLowerCase()) || r.category.toLowerCase().includes(q.toLowerCase()))
    ), [q, ward]);

  const perPage = 10;
  const pageRows = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Population Risk Table"
        description="Anonymized, aggregated patient cohort with AI risk scoring."
        actions={
          <Button className="gap-2 gradient-primary text-white" size="sm"><Download className="h-4 w-4" /> Export CSV</Button>
        }
      />

      <Card className="glass-card border-0">
        <CardContent className="p-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by ID or category…" value={q} onChange={(e) => setQ(e.target.value)} className="h-9 pl-9" />
            </div>
            <Select value={ward} onValueChange={setWard}>
              <SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="All wards" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wards</SelectItem>
                {wards.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/40">
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead><div className="flex items-center gap-1">Risk Score <ArrowUpDown className="h-3 w-3" /></div></TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setSelected(r)}>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell className="text-sm">{r.ward}</TableCell>
                    <TableCell className="text-sm">{r.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full" style={{ width: `${r.score}%`, background: r.score > 75 ? "var(--color-chart-4)" : r.score > 50 ? "var(--color-chart-3)" : "var(--color-chart-6)" }} />
                        </div>
                        <span className="text-xs font-semibold">{r.score}</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className={levelStyle(r.level)}>{r.level}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.updated}</TableCell>
                    <TableCell>{r.trend === "up" ? <TrendingUp className="h-4 w-4 text-destructive" /> : <TrendingDown className="h-4 w-4 text-success" />}</TableCell>
                    <TableCell><span className="text-xs">{r.status}</span></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>{filtered.length} patients</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft className="h-3 w-3" /></Button>
              <span>Page {page + 1} of {totalPages}</span>
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}><ChevronRight className="h-3 w-3" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-mono">{selected.id}</DialogTitle>
                <DialogDescription>{selected.ward} · {selected.category} · Anonymized cohort entry</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-3 rounded-xl bg-muted/40 p-4">
                <div><div className="text-xs text-muted-foreground">Risk Score</div><div className="text-2xl font-bold">{selected.score}</div></div>
                <div><div className="text-xs text-muted-foreground">Level</div><div className="text-2xl font-bold">{selected.level}</div></div>
                <div><div className="text-xs text-muted-foreground">Status</div><div className="text-2xl font-bold">{selected.status}</div></div>
              </div>
              <div>
                <div className="mb-2 text-xs font-medium">14-day risk trend</div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparkline(selected.score)}>
                      <defs>
                        <linearGradient id="rh" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="y" stroke="var(--color-primary)" fill="url(#rh)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs">
                <div className="font-semibold mb-1 text-primary">AI Explanation</div>
                <p className="text-muted-foreground">Risk driven primarily by elevated blood pressure (32%) and prior admissions (24%). Confidence: 89%.</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
