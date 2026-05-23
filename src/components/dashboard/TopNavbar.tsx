import { Bell, Moon, Search, Sun, ChevronDown, ShieldCheck, LogOut } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/hooks/use-theme";
import { useAuth, clearSession } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

export function TopNavbar() {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const initials = (user?.name ?? "DR")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    clearSession();
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/20 bg-background/40 px-3 backdrop-blur-2xl md:px-6">
      <SidebarTrigger className="-ml-1" />
      <div className="relative hidden flex-1 max-w-md md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search wards, alerts, reports…" className="h-9 pl-9 bg-white/50 border-white/40 focus:border-primary shadow-sm rounded-xl font-mono text-xs" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 lg:flex shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary">All systems operational</span>
        </div>
        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme" suppressHydrationWarning className="hover:bg-white/40 rounded-xl">
          {mounted ? (
            theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
          ) : (
            <span className="h-4 w-4" />
          )}
        </Button>
        <Button variant="ghost" size="icon" className="relative hover:bg-white/40 rounded-xl" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <Badge variant="destructive" className="absolute -right-0.5 -top-0.5 h-4 min-w-4 px-1 text-[9px] bg-primary">7</Badge>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 gap-2 px-2 hover:bg-white/40 rounded-xl">
              <Avatar className="h-8 w-8 shadow-sm">
                <AvatarFallback className="gradient-primary text-[11px] text-white font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <div className="text-xs font-semibold leading-tight">{user?.name ?? "Guest"}</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-tight">
                  {user?.role ?? "—"} · {user?.hospital ?? ""}
                </div>
              </div>
              <ChevronDown className="hidden h-3 w-3 text-muted-foreground md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl glass-card border-white/50">
            <DropdownMenuLabel className="font-heading">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem className="capitalize font-medium">
              <ShieldCheck className="mr-2 h-4 w-4 text-primary" /> Role: {user?.role ?? "—"}
            </DropdownMenuItem>
            <DropdownMenuItem className="font-medium">Profile</DropdownMenuItem>
            <DropdownMenuItem className="font-medium">Audit Log</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive font-bold focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
