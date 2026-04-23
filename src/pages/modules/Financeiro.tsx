import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
  Wallet,
  Trash2,
} from "lucide-react";
import { fmtBRL, fmtDate, useFarm } from "@/context/FarmContext";
import {
  CATEGORY_LABEL,
  Transaction,
  TxCategory,
  TxType,
} from "@/data/types";
import { StatCard } from "@/components/agro/StatCard";
import { SectionCard } from "@/components/agro/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { parseISODateLocal } from "@/lib/utils";

export default function FinanceiroPage() {
  const { transactions, properties, crops, livestock, addTransaction, removeTransaction } = useFarm();
  const [filterType, setFilterType] = useState<"all" | TxType>("all");
  const [filterCat, setFilterCat] = useState<"all" | TxCategory>("all");
  const [period, setPeriod] = useState<"all" | "30" | "90" | "year">("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const now = new Date();
    return transactions.filter((t) => {
      if (filterType !== "all" && t.type !== filterType) return false;
      if (filterCat !== "all" && t.category !== filterCat) return false;
      if (q && !t.description.toLowerCase().includes(q.toLowerCase())) return false;
      if (period !== "all") {
        const d = parseISODateLocal(t.date);
        const diff = (now.getTime() - d.getTime()) / 86400000;
        if (period === "30" && diff > 30) return false;
        if (period === "90" && diff > 90) return false;
        if (period === "year" && d.getFullYear() !== now.getFullYear()) return false;
      }
      return true;
    });
  }, [transactions, filterType, filterCat, q, period]);

  const totRev = filtered.filter((t) => t.type === "receita").reduce((s, t) => s + t.value, 0);
  const totExp = filtered.filter((t) => t.type === "despesa").reduce((s, t) => s + t.value, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total receitas (filtro)" value={fmtBRL(totRev)} icon={TrendingUp} tone="success" />
        <StatCard label="Total despesas (filtro)" value={fmtBRL(totExp)} icon={TrendingDown} tone="danger" />
        <StatCard label="Saldo do período" value={fmtBRL(totRev - totExp)} icon={Wallet} tone="primary" />
      </div>

      <SectionCard
        title="Lançamentos"
        subtitle={`${filtered.length} registros encontrados`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full">
                <Plus className="mr-1.5 h-4 w-4" /> Novo lançamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Novo lançamento financeiro</DialogTitle>
              </DialogHeader>
              <NewTxForm
                onSave={(t) => {
                  addTransaction(t);
                  toast.success("Lançamento adicionado");
                  setOpen(false);
                }}
                properties={properties}
                crops={crops}
                livestock={livestock}
              />
            </DialogContent>
          </Dialog>
        }
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar descrição..." className="pl-9" />
          </div>
          <Select value={filterType} onValueChange={(v) => setFilterType(v as "all" | TxType)}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="receita">Receitas</SelectItem>
              <SelectItem value="despesa">Despesas</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCat} onValueChange={(v) => setFilterCat(v as "all" | TxCategory)}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={(v) => setPeriod(v as "all" | "30" | "90" | "year")}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo período</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
              <SelectItem value="year">Este ano</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 text-left">Data</th>
                <th className="px-4 py-2.5 text-left">Descrição</th>
                <th className="px-4 py-2.5 text-left">Categoria</th>
                <th className="px-4 py-2.5 text-left">Propriedade</th>
                <th className="px-4 py-2.5 text-right">Valor</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const prop = properties.find((p) => p.id === t.propertyId);
                return (
                  <tr key={t.id} className="border-t border-border hover:bg-secondary/40">
                    <td className="px-4 py-3 text-muted-foreground">{fmtDate(t.date)}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{t.description}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="rounded-full font-normal">{CATEGORY_LABEL[t.category]}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{prop?.name ?? "—"}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${t.type === "receita" ? "text-success" : "text-danger"}`}>
                      {t.type === "receita" ? "+" : "−"} {fmtBRL(t.value)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="icon" variant="ghost" onClick={() => { removeTransaction(t.id); toast("Lançamento removido"); }}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">Nenhum lançamento encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

function NewTxForm({
  onSave,
  properties,
  crops,
  livestock,
}: {
  onSave: (t: Omit<Transaction, "id">) => void;
  properties: ReturnType<typeof useFarm>["properties"];
  crops: ReturnType<typeof useFarm>["crops"];
  livestock: ReturnType<typeof useFarm>["livestock"];
}) {
  const [form, setForm] = useState({
    description: "",
    type: "despesa" as TxType,
    category: "sementes" as TxCategory,
    value: "",
    date: new Date().toISOString().slice(0, 10),
    propertyId: properties[0]?.id ?? "",
    cropId: "" as string,
    livestockId: "" as string,
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.description || !form.value) return;
        onSave({
          description: form.description,
          type: form.type,
          category: form.category,
          value: Number(form.value),
          date: form.date,
          propertyId: form.propertyId || undefined,
          cropId: form.cropId || undefined,
          livestockId: form.livestockId || undefined,
        });
      }}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Descrição</Label>
          <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ex: Compra de sementes" />
        </div>
        <div>
          <Label>Tipo</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as TxType })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="receita">Receita</SelectItem>
              <SelectItem value="despesa">Despesa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Categoria</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as TxCategory })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORY_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Valor (R$)</Label>
          <Input type="number" min="0" step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
        </div>
        <div>
          <Label>Data</Label>
          <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div>
          <Label>Propriedade</Label>
          <Select value={form.propertyId} onValueChange={(v) => setForm({ ...form, propertyId: v })}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>{properties.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Plantação relacionada</Label>
          <Select value={form.cropId || "none"} onValueChange={(v) => setForm({ ...form, cropId: v === "none" ? "" : v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— nenhuma —</SelectItem>
              {crops.map((c) => <SelectItem key={c.id} value={c.id}>{c.culture} • {c.season}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label>Rebanho relacionado</Label>
          <Select value={form.livestockId || "none"} onValueChange={(v) => setForm({ ...form, livestockId: v === "none" ? "" : v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— nenhum —</SelectItem>
              {livestock.map((l) => <SelectItem key={l.id} value={l.id}>{l.tag}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" className="w-full">Salvar lançamento</Button>
      </DialogFooter>
    </form>
  );
}
