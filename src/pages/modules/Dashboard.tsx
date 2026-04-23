import {
  AlertTriangle,
  BarChart3,
  Beef,
  CalendarClock,
  CheckSquare,
  Coins,
  Leaf,
  MapPinned,
  Package,
  Sprout,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fmtBRL, useFarm } from "@/context/FarmContext";
import { CATEGORY_LABEL, EVENT_CATEGORY_LABEL } from "@/data/types";
import { StatCard } from "@/components/agro/StatCard";
import { SectionCard } from "@/components/agro/SectionCard";
import { Badge } from "@/components/ui/badge";
import { CHART_DANGER, CHART_PALETTE, CHART_PRIMARY } from "@/lib/chart-colors";
import { cn, parseISODateLocal } from "@/lib/utils";

const daysFromToday = (iso: string) => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.ceil((parseISODateLocal(iso).getTime() - start.getTime()) / 86400000);
};

export default function DashboardPage() {
  const {
    properties,
    crops,
    livestock,
    transactions,
    stockItems,
    accounts,
    tasks,
    events,
    sanitaryRecords,
  } = useFarm();

  const now = new Date();
  const monthly = transactions.filter((item) => {
    const date = parseISODateLocal(item.date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  const totalRevenue = transactions.filter((item) => item.type === "receita").reduce((sum, item) => sum + item.value, 0);
  const totalExpense = transactions.filter((item) => item.type === "despesa").reduce((sum, item) => sum + item.value, 0);
  const balance = totalRevenue - totalExpense;
  const monthRevenue = monthly.filter((item) => item.type === "receita").reduce((sum, item) => sum + item.value, 0);
  const monthExpense = monthly.filter((item) => item.type === "despesa").reduce((sum, item) => sum + item.value, 0);

  const totalHa = properties.reduce((sum, property) => sum + property.totalHa, 0);
  const usedHa = properties.reduce((sum, property) => sum + property.cultivableHa + property.pastureHa, 0);
  const usedPct = totalHa > 0 ? Math.round((usedHa / totalHa) * 100) : 0;
  const animalsCount = livestock.reduce((sum, item) => sum + (item.count ?? 1), 0);
  const activeCrops = crops.filter((item) => item.status !== "colhida").length;
  const stockValue = stockItems.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
  const openTasks = tasks.filter((item) => item.status !== "concluida").length;

  const months: { key: string; label: string; receitas: number; despesas: number }[] = [];
  for (let index = 5; index >= 0; index--) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    months.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
      receitas: 0,
      despesas: 0,
    });
  }

  transactions.forEach((item) => {
    const date = parseISODateLocal(item.date);
    const month = months.find((entry) => entry.key === `${date.getFullYear()}-${date.getMonth()}`);
    if (!month) return;
    if (item.type === "receita") month.receitas += item.value;
    else month.despesas += item.value;
  });

  const expByCat = new Map<string, number>();
  transactions
    .filter((item) => item.type === "despesa")
    .forEach((item) => expByCat.set(item.category, (expByCat.get(item.category) ?? 0) + item.value));
  const pieData = Array.from(expByCat.entries()).map(([key, value]) => ({
    name: CATEGORY_LABEL[key as keyof typeof CATEGORY_LABEL] ?? key,
    value,
  }));

  const lowStock = stockItems.filter((item) => item.quantity <= item.minQuantity);
  const overdueAccounts = accounts.filter((item) => item.status === "atrasado");
  const dueSoonAccounts = accounts.filter((item) => item.status === "pendente" && daysFromToday(item.dueDate) >= 0 && daysFromToday(item.dueDate) <= 7);
  const lateTasks = tasks.filter((item) => item.status !== "concluida" && daysFromToday(item.dueDate) < 0);
  const upcomingEvents = events.filter((item) => !item.done && daysFromToday(item.date) >= 0 && daysFromToday(item.date) <= 10);
  const pendingVaccines = livestock.filter((item) => {
    const records = sanitaryRecords.filter((record) => record.livestockId === item.id && record.procedure === "vacinacao");
    if (!records.length) return true;
    const latest = [...records].sort((a, b) => b.date.localeCompare(a.date))[0];
    return daysFromToday(latest.date) < -150;
  });
  const harvestSoon = crops.filter((item) => item.status !== "colhida" && daysFromToday(item.harvestForecast) >= 0 && daysFromToday(item.harvestForecast) <= 30);

  const alerts = [
    ...lowStock.slice(0, 2).map((item) => ({ title: `${item.name} abaixo do mínimo`, detail: `${item.quantity} ${item.unit} em estoque`, tone: "danger" as const })),
    ...overdueAccounts.slice(0, 2).map((item) => ({ title: `Conta vencida: ${item.description}`, detail: `${fmtBRL(item.value)} vence em ${parseISODateLocal(item.dueDate).toLocaleDateString("pt-BR")}`, tone: "danger" as const })),
    ...dueSoonAccounts.slice(0, 2).map((item) => ({ title: `Vencimento próximo: ${item.description}`, detail: `${fmtBRL(item.value)} em ${daysFromToday(item.dueDate)} dias`, tone: "warning" as const })),
    ...lateTasks.slice(0, 2).map((item) => ({ title: `Tarefa atrasada: ${item.title}`, detail: `${item.assignee} - prazo ${parseISODateLocal(item.dueDate).toLocaleDateString("pt-BR")}`, tone: "warning" as const })),
    ...upcomingEvents.slice(0, 2).map((item) => ({ title: `Evento próximo: ${item.title}`, detail: `${EVENT_CATEGORY_LABEL[item.category]} em ${daysFromToday(item.date)} dias`, tone: "primary" as const })),
    ...pendingVaccines.slice(0, 1).map((item) => ({ title: `Vacinação pendente: ${item.tag}`, detail: "Sem vacinação recente no histórico sanitário", tone: "warning" as const })),
    ...harvestSoon.slice(0, 1).map((item) => ({ title: `Colheita próxima: ${item.culture}`, detail: `${item.field} - ${parseISODateLocal(item.harvestForecast).toLocaleDateString("pt-BR")}`, tone: "primary" as const })),
  ].slice(0, 7);

  const seasonMap = new Map<string, { season: string; revenue: number; cost: number }>();
  crops.forEach((item) => {
    const entry = seasonMap.get(item.season) ?? { season: item.season, revenue: 0, cost: 0 };
    entry.revenue += item.estimatedRevenue;
    entry.cost += item.estimatedCost;
    seasonMap.set(item.season, entry);
  });

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-earth p-6 text-white shadow-elegant md:p-8">
        <div className="relative z-10 max-w-2xl">
          <Badge className="mb-3 bg-white/15 text-white hover:bg-white/15">
            <Leaf className="mr-1 h-3 w-3" /> Safra 2024/2025
          </Badge>
          <h2 className="font-display text-2xl font-bold leading-tight md:text-3xl">
            Gestão rural em tempo real
          </h2>
          <p className="mt-1 max-w-xl text-sm text-white/85">
            A operação soma {fmtBRL(balance)} em saldo acumulado, {stockItems.length} itens de estoque e {openTasks} tarefas em aberto.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Saldo atual" value={fmtBRL(balance)} icon={Wallet} tone="primary" trend={{ value: "12%", up: true }} />
        <StatCard label="Receitas do mês" value={fmtBRL(monthRevenue)} icon={TrendingUp} tone="success" hint={`${monthly.filter((item) => item.type === "receita").length} lançamentos`} />
        <StatCard label="Despesas do mês" value={fmtBRL(monthExpense)} icon={TrendingDown} tone="danger" hint={`${monthly.filter((item) => item.type === "despesa").length} lançamentos`} />
        <StatCard label="Valor em estoque" value={fmtBRL(stockValue)} icon={Package} tone="accent" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Hectares cadastrados" value={`${totalHa.toLocaleString("pt-BR")} ha`} icon={MapPinned} tone="muted" />
        <StatCard label="Hectares em uso" value={`${usedHa.toLocaleString("pt-BR")} ha`} icon={Sprout} tone="success" hint={`${usedPct}% da área total`} />
        <StatCard label="Cabeças de gado" value={animalsCount.toLocaleString("pt-BR")} icon={Beef} tone="accent" />
        <StatCard label="Tarefas abertas" value={String(openTasks)} icon={CheckSquare} tone="primary" />
      </div>

      <SectionCard title="Alertas e pendências" subtitle="Gerado automaticamente a partir dos dados atuais">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {alerts.map((alert) => (
            <div key={`${alert.title}-${alert.detail}`} className="rounded-xl border border-border bg-card p-3 shadow-card">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    alert.tone === "danger" && "bg-danger/15 text-danger",
                    alert.tone === "warning" && "bg-warning/15 text-warning",
                    alert.tone === "primary" && "bg-primary/10 text-primary",
                  )}
                >
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold text-foreground">{alert.title}</p>
                  <p className="mt-0.5 break-words text-xs text-muted-foreground">{alert.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Receitas x Despesas" subtitle="Últimos 6 meses" className="lg:col-span-2">
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={months} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(value) => `${(Number(value) / 1000).toFixed(0)}k`} />
                <Tooltip cursor={{ fill: "hsl(var(--muted))" }} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} formatter={(value: number) => fmtBRL(value)} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="receitas" name="Receitas" fill={CHART_PRIMARY} radius={[8, 8, 0, 0]} maxBarSize={36} />
                <Bar dataKey="despesas" name="Despesas" fill={CHART_DANGER} radius={[8, 8, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Despesas por categoria" subtitle="Composição dos gastos">
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={CHART_PALETTE[index % CHART_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => fmtBRL(value)} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-1.5 text-[11px]">
            {pieData.slice(0, 6).map((item, index) => (
              <li key={item.name} className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: CHART_PALETTE[index % CHART_PALETTE.length] }} />
                <span className="truncate">{item.name}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Resumo por safra" subtitle="Receita estimada vs custo" className="lg:col-span-2">
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left">Safra</th>
                  <th className="px-4 py-2.5 text-right">Receita</th>
                  <th className="px-4 py-2.5 text-right">Custo</th>
                  <th className="px-4 py-2.5 text-right">Lucro</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(seasonMap.values()).map((season) => (
                  <tr key={season.season} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-foreground">{season.season}</td>
                    <td className="px-4 py-3 text-right text-success">{fmtBRL(season.revenue)}</td>
                    <td className="px-4 py-3 text-right text-danger">{fmtBRL(season.cost)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">{fmtBRL(season.revenue - season.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Próximos eventos" subtitle="Calendário e colheitas" actions={<BarChart3 className="h-4 w-4 text-muted-foreground" />}>
          <ul className="space-y-3">
            {harvestSoon.slice(0, 4).map((crop) => {
              const property = properties.find((item) => item.id === crop.propertyId);
              return (
                <li key={crop.id} className="flex items-start gap-3 rounded-xl border border-border bg-secondary/40 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CalendarClock className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">Colheita de {crop.culture}</p>
                    <p className="text-xs text-muted-foreground">{property?.name} - {crop.field}</p>
                    <p className="mt-0.5 text-xs font-medium text-accent">
                      Prevista: {parseISODateLocal(crop.harvestForecast).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
