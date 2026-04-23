import {
  LayoutDashboard,
  Wallet,
  MapPinned,
  Sprout,
  Beef,
  BarChart3,
  Leaf,
  CalendarDays,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, end: true },
  { title: "Financeiro", url: "/financeiro", icon: Wallet },
  { title: "Propriedades", url: "/propriedades", icon: MapPinned },
  { title: "Plantações", url: "/plantacoes", icon: Sprout },
  { title: "Rebanho", url: "/rebanho", icon: Beef },
  { title: "Calendário", url: "/calendario", icon: CalendarDays },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-elegant">
            <Leaf className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-display text-base font-bold text-sidebar-foreground">
                AgroGestor
              </span>
              <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/75">
                Gestão rural
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            Operação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10 rounded-lg">
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className="flex items-center gap-3 px-3 text-sm text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
