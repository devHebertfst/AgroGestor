import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ title, subtitle, actions, children, className }: Props) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5 shadow-card", className)}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-bold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}