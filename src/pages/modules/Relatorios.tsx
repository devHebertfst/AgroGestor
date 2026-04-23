import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { fmtBRL, useFarm } from "@/context/FarmContext";
import { CATEGORY_LABEL } from "@/data/types";
import { SectionCard } from "@/components/agro/SectionCard";
import { StatCard } from "@/components/agro/StatCard";
import { Beef, Coins, Sprout, TrendingUp } from "lucide-react";
import { CHART_DANGER, CHART_PALETTE, CHART_PRIMARY } from "@/lib/chart-colors";
import { parseISODateLocal } from "@/lib/utils";

const COLORS = CHART_PALETTE;

export default function RelatoriosPage() {
  const { properties, crops, livestock, transactions } = useFarm();

  const totalRevenue = transactions.filter((t) => t.type === "receita").reduce((s, t) => s + t.value, 0);
  const totalExpense = transactions.filter((t) => t.type === "despesa").reduce((s, t) => s + t.value, 0);

  // Lucro por safra
  const seasonMap = new Map<string, { season: string; lucro: number }>();
  crops.forEach((c) => {
    const s = seasonMap.get(c.season) ?? { season: c.season, lucro: 0 };
    s.lucro += c.estimatedRevenue - c.estimatedCost;
    seasonMap.set(c.season, s);
  });

  // Receita por cultura
  const cultureMap = new Map<string, number>();
  crops.forEach((c) => cultureMap.set(c.culture, (cultureMap.get(c.culture) ?? 0) + c.estimatedRevenue));
  const cultureData = Array.from(cultureMap.entries()).map(([name, value]) => ({ name, value }));

  // Custo por hectare por propriedade
  const propData = properties.map((p) => {
    const cropsOfP = crops.filter((c) => c.propertyId === p.id);
    const ha = cropsOfP.reduce((s, c) => s + c.hectares, 0);
    const cost = cropsOfP.reduce((s, c) => s + c.estimatedCost, 0);
    const revenue = cropsOfP.reduce((s, c) => s + c.estimatedRevenue, 0);
    return {
      name: p.name,
      custoHa: ha ? Math.round(cost / ha) : 0,
      receita: revenue,
      custo: cost,
    };
  });

  // Despesas por categoria
  const expCat = new Map<string, number>();
  transactions.filter((t) => t.type === "despesa").forEach((t) =>
    expCat.set(t.category, (expCat.get(t.category) ?? 0) + t.value));
  const expData = Array.from(expCat.entries()).map(([k, v]) => ({
    name: CATEGORY_LABEL[k as keyof typeof CATEGORY_LABEL] ?? k, value: v,
  }));

  // Receita acumulada (linha)
  const monthly: { label: string; key: string; receita: number; despesa: number }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthly.push({
      label: d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
      key: `${d.getFullYear()}-${d.getMonth()}`, receita: 0, despesa: 0,
    });
  }
  transactions.forEach((t) => {
    const d = parseISODateLocal(t.date);
    const m = monthly.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (m) { if (t.type === "receita") m.receita += t.value; else m.despesa += t.value; }
  });

  const totalLivestockValue = livestock.reduce((s, l) => s + l.estimatedValue * (l.count ?? 1), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Receita total" value={fmtBRL(totalRevenue)} icon={TrendingUp} tone="success" />
        <StatCard label="Lucro consolidado" value={fmtBRL(totalRevenue - totalExpense)} icon={Coins} tone="primary" />
        <StatCard label="Hectares produtivos" value={`${crops.reduce((s, c) => s + c.hectares, 0)} ha`} icon={Sprout} tone="accent" />
        <StatCard label="Patrimônio rebanho" value={fmtBRL(totalLivestockValue)} icon={Beef} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Lucro por safra" subtitle="Estimativa receita − custo" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={Array.from(seasonMap.values())}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="season" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip formatter={(v: number) => fmtBRL(v)} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Bar dataKey="lucro" radius={[8,8,0,0]} fill={CHART_PRIMARY} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Receita por cultura">
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={cultureData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={90} paddingAngle={3}>
                  {cultureData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => fmtBRL(v)} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Receitas vs Despesas" subtitle="Evolução 12 meses" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip formatter={(v: number) => fmtBRL(v)} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="receita" name="Receita" stroke={CHART_PRIMARY} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="despesa" name="Despesa" stroke={CHART_DANGER} strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Despesas por categoria">
          <div className="space-y-2">
            {expData.sort((a, b) => b.value - a.value).map((e, i) => {
              const max = Math.max(...expData.map((x) => x.value));
              const pct = max > 0 ? (e.value / max) * 100 : 0;
              return (
                <div key={e.name}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">{e.name}</span>
                    <span className="font-semibold">{fmtBRL(e.value)}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Comparação entre propriedades" subtitle="Receita, custo e custo/ha">
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={propData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip formatter={(v: number) => fmtBRL(v)} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="receita" name="Receita" fill={CHART_PRIMARY} radius={[8,8,0,0]} maxBarSize={36} />
              <Bar dataKey="custo" name="Custo" fill={CHART_DANGER} radius={[8,8,0,0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );
}
