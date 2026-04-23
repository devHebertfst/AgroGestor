import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/agro/AppSidebar";
import { Bell, Moon, Search, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/context/ThemeContext";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Visão geral da operação rural" },
  "/financeiro": { title: "Financeiro", subtitle: "Receitas, despesas, contas e fluxo de caixa" },
  "/estoque": { title: "Estoque", subtitle: "Insumos, materiais, alertas e validade" },
  "/tarefas": { title: "Tarefas", subtitle: "Quadro operacional da fazenda" },
  "/propriedades": { title: "Propriedades", subtitle: "Áreas, hectares e talhões" },
  "/plantacoes": { title: "Plantações & Safras", subtitle: "Lavouras em andamento e manejos" },
  "/rebanho": { title: "Rebanho", subtitle: "Lotes, patrimônio e histórico sanitário" },
  "/calendario": { title: "Calendário", subtitle: "Lembretes, atividades e agenda da fazenda" },
  "/relatorios": { title: "Relatórios", subtitle: "Indicadores consolidados da fazenda" },
};

export default function AppLayout() {
  const loc = useLocation();
  const meta = titles[loc.pathname] ?? { title: "AgroGestor", subtitle: "" };
  const { theme, toggle } = useTheme();

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
              <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Alertas">
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
              </Button>
              <div className="hidden items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 sm:flex">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary text-xs text-primary-foreground">AG</AvatarFallback>
                </Avatar>
                <div className="text-left leading-tight">
                  <p className="text-xs font-semibold text-foreground">AgroGestor</p>
                  <p className="text-[10px] text-muted-foreground">Protótipo local</p>
                </div>
              </div>
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
