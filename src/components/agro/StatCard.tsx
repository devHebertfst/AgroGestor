import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: "primary" | "accent" | "success" | "warning" | "danger" | "muted";
  trend?: { value: string; up?: boolean };
}

const toneMap: Record<NonNullable<Props["tone"]>, string> = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/15 text-accent",
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-warning",
  danger: "bg-danger/15 text-danger",
  muted: "bg-muted text-muted-foreground",
};

export function StatCard({ label, value, hint, icon: Icon, tone = "primary", trend }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium">
          <span className={cn(trend.up ? "text-success" : "text-danger")}>
            {trend.up ? "▲" : "▼"} {trend.value}
          </span>
          <span className="text-muted-foreground">vs mês anterior</span>
        </div>
      )}
    </div>
  );
}
