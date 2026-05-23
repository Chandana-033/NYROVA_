import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, Stethoscope, Code2, LogIn } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { setSession, ROLE_HOME, type Role } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in · VitaPredict" }] }),
});

const ROLES: { key: Role; label: string; icon: typeof ShieldCheck; desc: string }[] = [
  { key: "admin", label: "Administrator", icon: ShieldCheck, desc: "Hospital-wide analytics & oversight" },
  { key: "doctor", label: "Doctor", icon: Stethoscope, desc: "Clinical ward & patient risk view" },
  { key: "developer", label: "Developer", icon: Code2, desc: "Model internals, training & API" },
];

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("dr.kapoor@stmarys.health");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      setSession({
        name: role === "doctor" ? "Dr. R. Kapoor" : role === "developer" ? "A. Mehta" : "Dr. R. Kapoor",
        email,
        role,
        hospital: "St. Mary's Medical Center",
      });
      navigate({ to: ROLE_HOME[role] });
    }, 500);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.15),transparent_55%),radial-gradient(circle_at_75%_85%,rgba(20,184,166,0.12),transparent_55%)]" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-soft">
            <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">VitaPredict</h1>
            <p className="text-[11px] text-muted-foreground">AI Health Intelligence Platform</p>
          </div>
        </div>

        <Card className="glass-card border-0 shadow-elegant">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Sign in to your workspace</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Demo authentication · pick a role to access the matching dashboard.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {ROLES.map((r) => {
                const active = role === r.key;
                return (
                  <button
                    type="button"
                    key={r.key}
                    onClick={() => setRole(r.key)}
                    className={`group rounded-xl border p-3 text-left transition ${
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card/40 hover:border-primary/40"
                    }`}
                  >
                    <r.icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="mt-2 text-xs font-semibold">{r.label}</div>
                    <div className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{r.desc}</div>
                  </button>
                );
              })}
            </div>

            <form onSubmit={submit} className="mt-5 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Work email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Password</Label>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
              </div>

              <Button type="submit" disabled={loading} className="w-full gradient-primary text-white">
                <LogIn className="mr-2 h-4 w-4" />
                {loading ? "Signing in…" : `Continue as ${ROLES.find((r) => r.key === role)!.label}`}
              </Button>
            </form>

            <p className="mt-4 text-center text-[10px] text-muted-foreground">
              Protected by HIPAA-compliant access controls · audit logged
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
