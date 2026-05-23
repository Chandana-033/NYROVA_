import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Map, BarChart3, Users, BellRing, Scale,
  Lightbulb, FileDown, Settings, Activity, Brain, Stethoscope, Code2,
  HeartPulse,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

type Item = { title: string; url: string; icon: typeof LayoutDashboard; badge?: string };

const adminItems: Item[] = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Disease Predictor", url: "/predict", icon: HeartPulse },
  { title: "Risk Map", url: "/risk-map", icon: Map },
  { title: "Hospital Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Population Table", url: "/population", icon: Users },
  { title: "Alerts", url: "/alerts", icon: BellRing, badge: "86" },
  { title: "Model Insights", url: "/model", icon: Brain },
  { title: "Fairness Report", url: "/fairness", icon: Scale },
  { title: "Explainability", url: "/explainability", icon: Lightbulb },
  { title: "Reports & Export", url: "/reports", icon: FileDown },
  { title: "Settings", url: "/settings", icon: Settings },
];

const doctorItems: Item[] = [
  { title: "Clinical Dashboard", url: "/doctor", icon: Stethoscope },
  { title: "Disease Predictor", url: "/predict", icon: HeartPulse },
  { title: "Population Table", url: "/population", icon: Users },
  { title: "Alerts", url: "/alerts", icon: BellRing, badge: "12" },
  { title: "Model Insights", url: "/model", icon: Brain },
  { title: "Explainability", url: "/explainability", icon: Lightbulb },
  { title: "Settings", url: "/settings", icon: Settings },
];

const developerItems: Item[] = [
  { title: "Developer Console", url: "/developer", icon: Code2 },
  { title: "Disease Predictor", url: "/predict", icon: HeartPulse },
  { title: "Model Insights", url: "/model", icon: Brain },
  { title: "Fairness Report", url: "/fairness", icon: Scale },
  { title: "Explainability", url: "/explainability", icon: Lightbulb },
  { title: "Hospital Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { user } = useAuth();
  const items =
    user?.role === "doctor" ? doctorItems :
    user?.role === "developer" ? developerItems :
    adminItems;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl">
      <SidebarHeader className="border-b border-sidebar-border/50">
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-primary shadow-soft">
            <Activity className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-heading font-bold tracking-tight text-foreground">Nyrova</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5">{user?.role ?? "Guest"} Workspace</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="pt-2">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Workspace</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title} className="mb-1">
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title} className={`transition-all duration-200 ${active ? 'shadow-sm bg-primary/10' : 'hover:bg-primary/5'}`}>
                      <Link to={item.url} className="flex items-center gap-3 py-2">
                        <item.icon className={`h-[18px] w-[18px] shrink-0 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                        {!collapsed && <span className={`flex-1 font-medium ${active ? 'text-primary font-semibold' : 'text-foreground/80'}`}>{item.title}</span>}
                        {!collapsed && item.badge && (
                          <Badge variant="destructive" className="h-5 px-1.5 text-[10px] bg-primary text-primary-foreground">
                            {item.badge}
                          </Badge>
                        )}

                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
