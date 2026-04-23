import {
  AlertTriangle,
  Beef,
  CalendarClock,
  CheckCircle2,
  CheckSquare,
  Coins,
  Package,
  Sprout,
  Wallet,
} from "lucide-react";
import { fmtBRL, fmtDate, fmtNum, useFarm } from "@/context/FarmContext";
import { SectionCard } from "@/components/agro/SectionCard";
import { StatCard } from "@/components/agro/StatCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EVENT_CATEGORY_LABEL, TASK_SECTOR_LABEL } from "@/data/types";
import { cn, parseISODateLocal } from "@/lib/utils";

const daysFromToday = (iso: string) => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.ceil((parseISODateLocal(iso).getTime() - start.getTime()) / 86400000);
};

export default function CentroControlePage() {
  const {
    properties,
    crops,
    livestock,
    stockItems,
    accounts,
    tasks,
    events,
    transactions,
    sanitaryRecords,
  } = useFarm();

  const pendingTasks = tasks.filter((task) => task.status !== "concluida").sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const lateTasks = pendingTasks.filter((task) => daysFromToday(task.dueDate) < 0);
  const upcomingEvents = events.filter((event) => !event.done && daysFromToday(event.date) >= 0).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6);
  const dueAccounts = accounts.filter((account) => account.status !== "pago" && daysFromToday(account.dueDate) <= 10).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const criticalStock = stockItems.filter((item) => item.quantity <= item.minQuantity).sort((a, b) => (a.quantity / Math.max(a.minQuantity, 1)) - (b.quantity / Math.max(b.minQuantity, 1)));
  const harvests = crops.filter((crop) => crop.status !== "colhida" && daysFromToday(crop.harvestForecast) >= 0).sort((a, b) => a.harvestForecast.localeCompare(b.harvestForecast)).slice(0, 5);
  const pendingVaccines = livestock.filter((item) => {
    const records = sanitaryRecords.filter((record) => record.livestockId === item.id && record.procedure === "vacinacao");
    if (!records.length) return true;
    return daysFromToday([...records].sort((a, b) => b.date.localeCompare(a.date))[0].date) < -150;
  });

  const costByProperty = properties.map((property) => {
    const financeCost = transactions
      .filter((transaction) => transaction.propertyId === property.id && transaction.type === "despesa")
      .reduce((sum, transaction) => sum + transaction.value, 0);
    const accountCost = accounts
      .filter((account) => account.propertyId === property.id && account.type === "pagar" && account.status !== "pago")
      .reduce((sum, account) => sum + account.value, 0);
    return { property, cost: financeCost + accountCost };
  }).sort((a, b) => b.cost - a.cost);

  const attentionScore = lateTasks.length + dueAccounts.length + criticalStock.length + pendingVaccines.length + harvests.length;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border/80 bg-gradient-earth p-6 text-white shadow-elegant md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Badge className="mb-3 bg-white/15 text-white hover:bg-white/15">Painel gerencial</Badge>
            <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-4xl">
              Centro de Controle da Operação
            </h2>
            <p className="mt-2 text-sm text-white/82">
              Acompanhe pendências, riscos e prioridades para decidir o que precisa de ação imediata na fazenda.
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-wider text-white/70">Itens que exigem atenção</p>
            <p className="mt-1 font-display text-4xl font-extrabold">{attentionScore}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Tarefas atrasadas" value={String(lateTasks.length)} icon={CheckSquare} tone="danger" />
        <StatCard label="Contas vencendo" value={String(dueAccounts.length)} icon={Wallet} tone="warning" />
        <StatCard label="Estoque crítico" value={String(criticalStock.length)} icon={Package} tone="danger" />
        <StatCard label="Colheitas próximas" value={String(harvests.length)} icon={Sprout} tone="primary" />
        <StatCard label="Vacinação pendente" value={String(pendingVaccines.length)} icon={Beef} tone="warning" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard title="Prioridades imediatas" subtitle="Ordenadas por urgência" className="xl:col-span-2">
          <div className="grid gap-3 md:grid-cols-2">
            {lateTasks.slice(0, 4).map((task) => {
              const property = properties.find((item) => item.id === task.propertyId);
              return (
                <PriorityCard
                  key={task.id}
                  icon={CheckSquare}
                  title={task.title}
                  detail={`${task.assignee} - ${property?.name ?? "Sem propriedade"}`}
                  meta={`${Math.abs(daysFromToday(task.dueDate))} dias em atraso`}
                  tone="danger"
                />
              );
            })}
            {dueAccounts.slice(0, 4).map((account) => (
              <PriorityCard
                key={account.id}
                icon={Coins}
                title={account.description}
                detail={`${account.type === "pagar" ? "A pagar" : "A receber"} - ${fmtBRL(account.value)}`}
                meta={daysFromToday(account.dueDate) < 0 ? "Vencida" : `Vence em ${daysFromToday(account.dueDate)} dias`}
                tone={daysFromToday(account.dueDate) < 0 ? "danger" : "warning"}
              />
            ))}
            {criticalStock.slice(0, 4).map((item) => (
              <PriorityCard
                key={item.id}
                icon={Package}
                title={item.name}
                detail={`${fmtNum(item.quantity)} ${item.unit} disponíveis`}
                meta={`Mínimo: ${fmtNum(item.minQuantity)} ${item.unit}`}
                tone="danger"
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Propriedades com maior custo" subtitle="Despesas e contas abertas">
          <div className="space-y-3">
            {costByProperty.map(({ property, cost }) => {
              const max = Math.max(...costByProperty.map((item) => item.cost), 1);
              return (
                <div key={property.id} className="rounded-xl border border-border bg-secondary/35 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{property.name}</p>
                      <p className="text-xs text-muted-foreground">{property.location}</p>
                    </div>
                    <p className="text-sm font-bold text-foreground">{fmtBRL(cost)}</p>
                  </div>
                  <Progress value={(cost / max) * 100} className="mt-3 h-2" />
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Eventos próximos" subtitle="Calendário operacional">
          <div className="space-y-2">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CalendarClock className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-semibold text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{EVENT_CATEGORY_LABEL[event.category]} - {fmtDate(event.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Colheitas próximas" subtitle="Safras em monitoramento">
          <div className="space-y-2">
            {harvests.map((crop) => {
              const property = properties.find((item) => item.id === crop.propertyId);
              return (
                <div key={crop.id} className="rounded-xl border border-border bg-secondary/35 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">{crop.culture}</p>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/10">{daysFromToday(crop.harvestForecast)} dias</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{property?.name} - {crop.field}</p>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Tarefas por setor" subtitle="Carga operacional aberta">
          <div className="space-y-2">
            {Object.entries(TASK_SECTOR_LABEL).map(([sector, label]) => {
              const total = pendingTasks.filter((task) => task.sector === sector).length;
              const max = Math.max(...Object.keys(TASK_SECTOR_LABEL).map((key) => pendingTasks.filter((task) => task.sector === key).length), 1);
              return (
                <div key={sector}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold">{total}</span>
                  </div>
                  <Progress value={(total / max) * 100} className="h-2" />
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function PriorityCard({
  icon: Icon,
  title,
  detail,
  meta,
  tone,
}: {
  icon: typeof AlertTriangle;
  title: string;
  detail: string;
  meta: string;
  tone: "danger" | "warning";
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
      <div className="flex items-start gap-3">
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", tone === "danger" ? "bg-danger/15 text-danger" : "bg-warning/15 text-warning")}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="break-words text-sm font-semibold text-foreground">{title}</p>
            <Badge className={cn("rounded-full", tone === "danger" ? "bg-danger/15 text-danger hover:bg-danger/15" : "bg-warning/15 text-warning hover:bg-warning/15")}>
              {meta}
            </Badge>
          </div>
          <p className="mt-1 break-words text-xs text-muted-foreground">{detail}</p>
        </div>
      </div>
    </div>
  );
}
