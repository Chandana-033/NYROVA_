import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, Stethoscope, Code2, ChevronRight, Brain, Lock, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { setSession, ROLE_HOME, type Role } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  component: LandingPage,
  head: () => ({ meta: [{ title: "Nyrova | Privacy-Preserving Healthcare Intelligence" }] }),
});

const ROLES: { key: Role; label: string; icon: typeof ShieldCheck; desc: string }[] = [
  { key: "admin", label: "Admin", icon: ShieldCheck, desc: "Hospital-wide analytics" },
  { key: "doctor", label: "Doctor", icon: Stethoscope, desc: "Clinical ward" },
  { key: "developer", label: "Dev", icon: Code2, desc: "Model internals" },
];

function LandingPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("dr.kapoor@nyrova.health");
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

  const scrollToLogin = () => {
    document.getElementById("login-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
     <div className="relative min-h-screen w-full overflow-y-auto overflow-x-hidden bg-background">
       {/* Background blobs */}
       <div className="fixed top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
       <div className="fixed bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-accent/20 blur-[120px] pointer-events-none" />
       
       {/* Navbar */}
       <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 backdrop-blur-xl border-b border-white/20 bg-background/50">
         <div className="flex items-center gap-3">
           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-soft">
             <Activity className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
           </div>
           <span className="text-2xl font-bold font-heading text-foreground tracking-tight">Nyrova</span>
         </div>
         <Button onClick={scrollToLogin} className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-soft font-medium">
           Predict Risk <ChevronRight className="ml-2 w-4 h-4" />
         </Button>
       </nav>

       {/* Hero Section */}
       <main className="relative pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="max-w-4xl"
         >
           <h1 className="text-5xl md:text-7xl font-heading font-black text-foreground leading-[1.15] tracking-tight">
             Privacy-Preserving <br/><span className="text-primary italic">Healthcare Intelligence</span>
           </h1>
           <p className="mt-6 text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
             Nyrova combines federated learning with explainable AI to deliver highly accurate disease predictions without ever compromising patient privacy.
           </p>
           <div className="mt-10 flex flex-wrap gap-4 justify-center">
             <Button onClick={scrollToLogin} size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 text-lg h-14 shadow-elevated">
               Get Started
             </Button>
             <Button variant="outline" size="lg" className="rounded-full px-8 text-lg h-14 border-white/40 bg-white/20 hover:bg-white/40 text-foreground transition-all backdrop-blur-md">
               Learn More
             </Button>
           </div>
         </motion.div>

         {/* Animated Illustration Mockup */}
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, delay: 0.2 }}
           className="mt-24 w-full max-w-5xl relative"
         >
           <div className="aspect-[16/9] w-full rounded-[2rem] glass-card overflow-hidden flex items-center justify-center p-4 md:p-8 border border-white/60">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full h-full">
                <div className="md:col-span-2 bg-white/40 rounded-3xl p-8 flex flex-col justify-between shadow-sm border border-white/20">
                  <div>
                    <div className="h-4 w-32 bg-primary/20 rounded-full mb-5 animate-pulse"></div>
                    <div className="h-8 w-64 bg-foreground/10 rounded-full mb-8"></div>
                  </div>
                  <div className="flex gap-4 items-end h-48">
                    {[40, 70, 45, 90, 65, 80].map((h, i) => (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 0.5 + (i * 0.1), duration: 0.8, type: "spring" }}
                        key={i} 
                        className="flex-1 bg-gradient-to-t from-primary/80 to-primary/30 rounded-t-xl" 
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex-1 bg-white/40 rounded-3xl p-6 flex items-center justify-center flex-col shadow-sm border border-white/20">
                    <Activity className="w-12 h-12 text-primary mb-4" />
                    <div className="text-4xl font-mono text-foreground font-bold tracking-tight">98.4%</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest mt-2 font-bold">Accuracy</div>
                  </div>
                  <div className="flex-1 bg-white/40 rounded-3xl p-6 flex items-center justify-center flex-col shadow-sm border border-white/20">
                    <ShieldCheck className="w-12 h-12 text-accent mb-4" />
                    <div className="text-4xl font-mono text-foreground font-bold tracking-tight">100%</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest mt-2 font-bold">Privacy</div>
                  </div>
                </div>
              </div>
           </div>
         </motion.div>

         {/* Features */}
         <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
           {[
             { icon: Brain, title: "Explainable AI", desc: "SHAP-powered insights explaining exactly why a clinical prediction was made." },
             { icon: Lock, title: "Federated Learning", desc: "Train on decentralized hospital data without ever centralizing patient records." },
             { icon: BarChart3, title: "Clinical Analytics", desc: "Premium dashboards giving administrators macro-level insights into ward health." }
           ].map((feat, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ delay: idx * 0.1 }}
               className="glass-card p-8 rounded-3xl text-left hover:-translate-y-2 transition-transform duration-300 border border-white/40"
             >
               <div className="h-14 w-14 rounded-2xl bg-white/60 flex items-center justify-center mb-6 shadow-sm">
                 <feat.icon className="w-7 h-7 text-primary" />
               </div>
               <h3 className="text-2xl font-heading font-semibold text-foreground mb-3">{feat.title}</h3>
               <p className="text-muted-foreground font-sans leading-relaxed text-[15px]">{feat.desc}</p>
             </motion.div>
           ))}
         </div>
       </main>

       {/* Login Section */}
       <section id="login-section" className="py-24 relative z-10 flex items-center justify-center bg-white/10 backdrop-blur-2xl border-t border-white/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-md px-4"
          >
            <Card className="glass-card border border-white/50 shadow-elevated rounded-[2rem] overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-heading font-bold text-foreground">Sign in to workspace</h2>
                  <p className="mt-2 text-sm text-muted-foreground font-sans">
                    Pick a role to access the matching dashboard
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {ROLES.map((r) => {
                    const active = role === r.key;
                    return (
                      <button
                        type="button"
                        key={r.key}
                        onClick={() => setRole(r.key)}
                        className={`group rounded-2xl border p-4 text-center transition-all duration-300 ${
                          active
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-white/40 bg-white/30 hover:border-primary/40 hover:bg-white/60"
                        }`}
                      >
                        <r.icon className={`h-6 w-6 mx-auto mb-3 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="text-xs font-semibold text-foreground">{r.label}</div>
                      </button>
                    );
                  })}
                </div>

                <form onSubmit={submit} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Work email</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="h-12 rounded-xl bg-white/60 border-white/50 focus:border-primary focus:ring-primary font-mono text-sm shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Password</Label>
                    <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="h-12 rounded-xl bg-white/60 border-white/50 focus:border-primary focus:ring-primary font-mono text-sm shadow-sm" />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold text-base mt-6 shadow-soft">
                    {loading ? "Authenticating…" : `Access ${ROLES.find((r) => r.key === role)!.label} Portal`}
                  </Button>
                </form>

                <p className="mt-6 text-center text-xs text-muted-foreground font-sans">
                  Protected by HIPAA-compliant controls · Audit Logged
                </p>
              </CardContent>
            </Card>
          </motion.div>
       </section>
     </div>
  );
}
