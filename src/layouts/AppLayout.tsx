import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/agro/AppSidebar";
import { Bell, LogOut, Moon, Search, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Visão geral da operação rural" },
  "/financeiro": { title: "Financeiro", subtitle: "Receitas, despesas e fluxo de caixa" },
  "/propriedades": { title: "Propriedades", subtitle: "Áreas, hectares e talhões" },
  "/plantacoes": { title: "Plantações & Safras", subtitle: "Lavouras em andamento e produtividade" },
  "/rebanho": { title: "Rebanho", subtitle: "Lotes, animais e patrimônio pecuário" },
  "/calendario": { title: "Calendário", subtitle: "Lembretes, atividades e agenda da fazenda" },
  "/relatorios": { title: "Relatórios", subtitle: "Indicadores consolidados da fazenda" },
};

export default function AppLayout() {
  const loc = useLocation();
  const meta = titles[loc.pathname] ?? { title: "AgroGestor", subtitle: "" };
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const initials = (user?.name ?? "JM").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md md:px-6">
            <SidebarTrigger className="text-muted-foreground" />
            <div className="hidden min-w-0 flex-1 md:block">
              <h1 className="font-display text-lg font-bold leading-tight text-foreground">
                {meta.title}
              </h1>
              <p className="truncate text-xs text-muted-foreground">
                {meta.subtitle}
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar talhão, lote, lançamento..."
                  className="h-9 w-72 rounded-full border-border bg-secondary/60 pl-9 text-sm"
                />
              </div>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={toggle} aria-label="Alternar tema">
                {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
              </Button>
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-1 flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 transition hover:bg-secondary">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left leading-tight sm:block">
                      <p className="text-xs font-semibold text-foreground">{user?.name ?? "Convidado"}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">{user?.role ?? "—"}</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="leading-tight">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs font-normal text-muted-foreground">{user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggle}>
                    {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                    Modo {theme === "dark" ? "claro" : "escuro"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-danger focus:text-danger">
                    <LogOut className="mr-2 h-4 w-4" /> Sair da conta
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto w-full max-w-[1440px] animate-fade-in">
              <div className="mb-6 md:hidden">
                <h1 className="font-display text-2xl font-bold text-foreground">
                  {meta.title}
                </h1>
                <p className="text-sm text-muted-foreground">{meta.subtitle}</p>
              </div>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}