import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Map, BarChart3, Users, BellRing, Scale,
  Lightbulb, FileDown, Settings, Activity, Brain, Stethoscope, Code2,
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
  { title: "Population Table", url: "/population", icon: Users },
  { title: "Alerts", url: "/alerts", icon: BellRing, badge: "12" },
  { title: "Model Insights", url: "/model", icon: Brain },
  { title: "Explainability", url: "/explainability", icon: Lightbulb },
  { title: "Settings", url: "/settings", icon: Settings },
];

const developerItems: Item[] = [
  { title: "Developer Console", url: "/developer", icon: Code2 },
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
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-soft">
            <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight">VitaPredict</span>
              <span className="text-[10px] text-muted-foreground capitalize">{user?.role ?? "Guest"} Workspace</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Workspace</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="flex-1">{item.title}</span>}
                        {!collapsed && item.badge && (
                          <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
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
