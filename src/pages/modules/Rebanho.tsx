import { useMemo, useState } from "react";
import { Beef, Plus, Trash2 } from "lucide-react";
import { fmtBRL, fmtDate, fmtNum, useFarm } from "@/context/FarmContext";
import {
  AnimalSex, AnimalStatus, AnimalType, ANIMAL_TYPE_LABEL, Livestock,
} from "@/data/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "@/components/agro/SectionCard";
import { StatCard } from "@/components/agro/StatCard";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function RebanhoPage() {
  const { livestock, properties, addLivestock, removeLivestock } = useFarm();
  const [open, setOpen] = useState(false);
  const [fBreed, setFBreed] = useState("all");
  const [fSex, setFSex] = useState<"all" | AnimalSex>("all");
  const [fProp, setFProp] = useState("all");
  const [fStatus, setFStatus] = useState<"all" | AnimalStatus>("all");

  const breeds = Array.from(new Set(livestock.map((l) => l.breed)));

  const filtered = useMemo(() => livestock.filter((l) =>
    (fBreed === "all" || l.breed === fBreed) &&
    (fSex === "all" || l.sex === fSex) &&
    (fProp === "all" || l.propertyId === fProp) &&
    (fStatus === "all" || l.status === fStatus)
  ), [livestock, fBreed, fSex, fProp, fStatus]);

  const totalAnimals = livestock.reduce((s, l) => s + (l.count ?? 1), 0);
  const avgWeight = livestock.length
    ? livestock.reduce((s, l) => s + l.weightKg, 0) / livestock.length : 0;
  const totalValue = livestock.reduce((s, l) => s + l.estimatedValue * (l.count ?? 1), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total de animais" value={totalAnimals.toLocaleString("pt-BR")} icon={Beef} tone="primary" hint={`${livestock.length} lotes/registros`} />
        <StatCard label="Peso médio" value={`${fmtNum(avgWeight)} kg`} icon={Beef} tone="muted" />
        <StatCard label="Valor estimado do rebanho" value={fmtBRL(totalValue)} icon={Beef} tone="success" />
      </div>

      <SectionCard
        title="Lotes & animais"
        subtitle={`${filtered.length} registros`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Select value={fBreed} onValueChange={setFBreed}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas raças</SelectItem>
                {breeds.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={fSex} onValueChange={(v) => setFSex(v as "all" | AnimalSex)}>
              <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos sexos</SelectItem>
                <SelectItem value="macho">Macho</SelectItem>
                <SelectItem value="femea">Fêmea</SelectItem>
              </SelectContent>
            </Select>
            <Select value={fProp} onValueChange={setFProp}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas propriedades</SelectItem>
                {properties.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={fStatus} onValueChange={(v) => setFStatus(v as "all" | AnimalStatus)}>
              <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="vendido">Vendido</SelectItem>
                <SelectItem value="abatido">Abatido</SelectItem>
              </SelectContent>
            </Select>
            <Button className="rounded-full" onClick={() => setOpen(true)}><Plus className="mr-1.5 h-4 w-4" /> Novo lote</Button>
          </div>
        }
      >
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 text-left">Identificação</th>
                <th className="px-4 py-2.5 text-left">Tipo / Raça</th>
                <th className="px-4 py-2.5 text-center">Sexo</th>
                <th className="px-4 py-2.5 text-right">Cabeças</th>
                <th className="px-4 py-2.5 text-right">Peso (kg)</th>
                <th className="px-4 py-2.5 text-right">Idade (m)</th>
                <th className="px-4 py-2.5 text-left">Propriedade</th>
                <th className="px-4 py-2.5 text-right">Valor unit.</th>
                <th className="px-4 py-2.5 text-left">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => {
                const prop = properties.find((p) => p.id === l.propertyId);
                return (
                  <tr key={l.id} className="border-t border-border hover:bg-secondary/40">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">{l.tag}</div>
                      <div className="text-xs text-muted-foreground">Comprado {fmtDate(l.purchaseDate)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-foreground">{ANIMAL_TYPE_LABEL[l.type]}</div>
                      <div className="text-xs text-muted-foreground">{l.breed}</div>
                    </td>
                    <td className="px-4 py-3 text-center capitalize">{l.sex === "macho" ? "♂" : "♀"}</td>
                    <td className="px-4 py-3 text-right font-semibold">{l.count ?? 1}</td>
                    <td className="px-4 py-3 text-right">{fmtNum(l.weightKg)}</td>
                    <td className="px-4 py-3 text-right">{l.ageMonths}</td>
                    <td className="px-4 py-3 text-muted-foreground">{prop?.name}</td>
                    <td className="px-4 py-3 text-right text-success font-semibold">{fmtBRL(l.estimatedValue)}</td>
                    <td className="px-4 py-3">
                      <Badge className={`rounded-full font-medium ${l.status === "ativo" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>{l.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="icon" variant="ghost" onClick={() => { removeLivestock(l.id); toast("Lote removido"); }}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={10} className="px-4 py-10 text-center text-muted-foreground">Nenhum animal encontrado.</td></tr>}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Novo lote / animal</DialogTitle></DialogHeader>
          <LivestockForm properties={properties} onSave={(l) => { addLivestock(l); toast.success("Lote adicionado"); setOpen(false); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LivestockForm({ properties, onSave }: { properties: ReturnType<typeof useFarm>["properties"]; onSave: (l: Omit<Livestock, "id">) => void }) {
  const [f, setF] = useState<Omit<Livestock, "id">>({
    tag: "", type: "boi", breed: "Nelore", sex: "macho", ageMonths: 24, weightKg: 400,
    propertyId: properties[0]?.id ?? "", status: "ativo",
    purchaseDate: new Date().toISOString().slice(0, 10), purchaseValue: 0, estimatedValue: 0, count: 1, notes: "",
  });
  return (
    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSave(f); }}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2"><Label>Identificação</Label><Input value={f.tag} onChange={(e) => setF({ ...f, tag: e.target.value })} /></div>
        <div>
          <Label>Tipo</Label>
          <Select value={f.type} onValueChange={(v) => setF({ ...f, type: v as AnimalType })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{Object.entries(ANIMAL_TYPE_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Raça</Label><Input value={f.breed} onChange={(e) => setF({ ...f, breed: e.target.value })} /></div>
        <div>
          <Label>Sexo</Label>
          <Select value={f.sex} onValueChange={(v) => setF({ ...f, sex: v as AnimalSex })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="macho">Macho</SelectItem><SelectItem value="femea">Fêmea</SelectItem></SelectContent>
          </Select>
        </div>
        <div><Label>Cabeças</Label><Input type="number" value={f.count ?? 1} onChange={(e) => setF({ ...f, count: +e.target.value })} /></div>
        <div><Label>Idade (meses)</Label><Input type="number" value={f.ageMonths} onChange={(e) => setF({ ...f, ageMonths: +e.target.value })} /></div>
        <div><Label>Peso (kg)</Label><Input type="number" value={f.weightKg} onChange={(e) => setF({ ...f, weightKg: +e.target.value })} /></div>
        <div className="sm:col-span-2">
          <Label>Propriedade</Label>
          <Select value={f.propertyId} onValueChange={(v) => setF({ ...f, propertyId: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{properties.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Data compra</Label><Input type="date" value={f.purchaseDate} onChange={(e) => setF({ ...f, purchaseDate: e.target.value })} /></div>
        <div>
          <Label>Status</Label>
          <Select value={f.status} onValueChange={(v) => setF({ ...f, status: v as AnimalStatus })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="ativo">Ativo</SelectItem><SelectItem value="vendido">Vendido</SelectItem><SelectItem value="abatido">Abatido</SelectItem></SelectContent>
          </Select>
        </div>
        <div><Label>Valor compra</Label><Input type="number" value={f.purchaseValue} onChange={(e) => setF({ ...f, purchaseValue: +e.target.value })} /></div>
        <div><Label>Valor estimado</Label><Input type="number" value={f.estimatedValue} onChange={(e) => setF({ ...f, estimatedValue: +e.target.value })} /></div>
        <div className="sm:col-span-2"><Label>Observações</Label><Textarea rows={2} value={f.notes ?? ""} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
      </div>
      <DialogFooter><Button type="submit" className="w-full">Salvar lote</Button></DialogFooter>
    </form>
  );
}
