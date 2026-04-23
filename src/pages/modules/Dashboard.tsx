import {
  BarChart3,
  Beef,
  CalendarClock,
  Coins,
  Leaf,
  MapPinned,
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
import { CATEGORY_LABEL } from "@/data/types";
import { StatCard } from "@/components/agro/StatCard";
import { SectionCard } from "@/components/agro/SectionCard";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { CHART_DANGER, CHART_PALETTE, CHART_PRIMARY } from "@/lib/chart-colors";
import { parseISODateLocal } from "@/lib/utils";

export default function DashboardPage() {
  const { properties, crops, livestock, transactions } = useFarm();
  const { user } = useAuth();
  const firstName = (user?.name ?? "Produtor").split(" ")[0];

  const now = new Date();
  const monthly = transactions.filter((t) => {
    const d = parseISODateLocal(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalRevenue = transactions.filter((t) => t.type === "receita").reduce((s, t) => s + t.value, 0);
  const totalExpense = transactions.filter((t) => t.type === "despesa").reduce((s, t) => s + t.value, 0);
  const balance = totalRevenue - totalExpense;
  const monthRevenue = monthly.filter((t) => t.type === "receita").reduce((s, t) => s + t.value, 0);
  const monthExpense = monthly.filter((t) => t.type === "despesa").reduce((s, t) => s + t.value, 0);

  const totalHa = properties.reduce((s, p) => s + p.totalHa, 0);
  const usedHa = properties.reduce((s, p) => s + p.cultivableHa + p.pastureHa, 0);
  const usedPct = totalHa > 0 ? Math.round((usedHa / totalHa) * 100) : 0;
  const animalsCount = livestock.reduce((s, l) => s + (l.count ?? 1), 0);
  const activeCrops = crops.filter((c) => c.status !== "colhida").length;

  // Chart: receitas vs despesas últimos 6 meses
  const months: { key: string; label: string; receitas: number; despesas: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
      receitas: 0,
      despesas: 0,
    });
  }
  transactions.forEach((t) => {
    const d = parseISODateLocal(t.date);
    const k = `${d.getFullYear()}-${d.getMonth()}`;
    const m = months.find((x) => x.key === k);
    if (m) {
      if (t.type === "receita") m.receitas += t.value;
      else m.despesas += t.value;
    }
  });

  // Pie de despesas por categoria
  const expByCat = new Map<string, number>();
  transactions
    .filter((t) => t.type === "despesa")
    .forEach((t) => expByCat.set(t.category, (expByCat.get(t.category) ?? 0) + t.value));
  const pieData = Array.from(expByCat.entries()).map(([k, v]) => ({
    name: CATEGORY_LABEL[k as keyof typeof CATEGORY_LABEL] ?? k,
    value: v,
  }));
  const PIE_COLORS = CHART_PALETTE;

  // Próximos eventos (colheitas próximas)
  const upcoming = [...crops]
    .filter((c) => c.status !== "colhida")
    .sort((a, b) => a.harvestForecast.localeCompare(b.harvestForecast))
    .slice(0, 4);

  // Resumo por safra
  const seasonMap = new Map<string, { season: string; revenue: number; cost: number }>();
  crops.forEach((c) => {
    const x = seasonMap.get(c.season) ?? { season: c.season, revenue: 0, cost: 0 };
    x.revenue += c.estimatedRevenue;
    x.cost += c.estimatedCost;
    seasonMap.set(c.season, x);
  });
  const seasons = Array.from(seasonMap.values());

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-earth p-6 text-white shadow-elegant md:p-8">
        <div className="relative z-10 max-w-2xl">
          <Badge className="mb-3 bg-white/15 text-white hover:bg-white/15">
            <Leaf className="mr-1 h-3 w-3" /> Safra 2024/2025
          </Badge>
          <h2 className="font-display text-2xl font-bold leading-tight md:text-3xl">
            Bem-vindo de volta, {firstName} 🌾
          </h2>
          <p className="mt-1 max-w-xl text-sm text-white/85">
            Sua operação rural está rendendo {fmtBRL(balance)} em saldo acumulado. Veja abaixo o desempenho consolidado das suas {properties.length} propriedades.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Saldo atual" value={fmtBRL(balance)} icon={Wallet} tone="primary" trend={{ value: "12%", up: true }} />
        <StatCard label="Receitas do mês" value={fmtBRL(monthRevenue)} icon={TrendingUp} tone="success" hint={`${monthly.filter(t=>t.type==='receita').length} lançamentos`} />
        <StatCard label="Despesas do mês" value={fmtBRL(monthExpense)} icon={TrendingDown} tone="danger" hint={`${monthly.filter(t=>t.type==='despesa').length} lançamentos`} />
        <StatCard label="Lucro estimado" value={fmtBRL(monthRevenue - monthExpense)} icon={Coins} tone="accent" trend={{ value: "8%", up: true }} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Hectares cadastrados" value={`${totalHa.toLocaleString("pt-BR")} ha`} icon={MapPinned} tone="muted" />
        <StatCard label="Hectares em uso" value={`${usedHa.toLocaleString("pt-BR")} ha`} icon={Sprout} tone="success" hint={`${usedPct}% da área total`} />
        <StatCard label="Cabeças de gado" value={animalsCount.toLocaleString("pt-BR")} icon={Beef} tone="accent" />
        <StatCard label="Plantações ativas" value={String(activeCrops)} icon={Leaf} tone="primary" />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard
          title="Receitas x Despesas"
          subtitle="Últimos 6 meses"
          className="lg:col-span-2"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={months} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))" }}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                  formatter={(v: number) => fmtBRL(v)}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="receitas" name="Receitas" fill={CHART_PRIMARY} radius={[8,8,0,0]} maxBarSize={36} />
                <Bar dataKey="despesas" name="Despesas" fill={CHART_DANGER} radius={[8,8,0,0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Despesas por categoria" subtitle="Composição dos gastos">
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => fmtBRL(v)} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-1.5 text-[11px]">
            {pieData.slice(0, 6).map((p, i) => (
              <li key={p.name} className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="truncate">{p.name}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Resumo por safra" subtitle="Receita estimada vs custo" className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left">Safra</th>
                  <th className="px-4 py-2.5 text-right">Receita</th>
                  <th className="px-4 py-2.5 text-right">Custo</th>
                  <th className="px-4 py-2.5 text-right">Lucro</th>
                </tr>
              </thead>
              <tbody>
                {seasons.map((s) => (
                  <tr key={s.season} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-foreground">{s.season}</td>
                    <td className="px-4 py-3 text-right text-success">{fmtBRL(s.revenue)}</td>
                    <td className="px-4 py-3 text-right text-danger">{fmtBRL(s.cost)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">{fmtBRL(s.revenue - s.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Próximos eventos" subtitle="Colheitas e alertas" actions={<BarChart3 className="h-4 w-4 text-muted-foreground" />}>
          <ul className="space-y-3">
            {upcoming.map((c) => {
              const prop = properties.find((p) => p.id === c.propertyId);
              return (
                <li key={c.id} className="flex items-start gap-3 rounded-xl border border-border bg-secondary/40 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CalendarClock className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      Colheita de {c.culture}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {prop?.name} • {c.field}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-accent">
                      Prevista: {parseISODateLocal(c.harvestForecast).toLocaleDateString("pt-BR")}
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
