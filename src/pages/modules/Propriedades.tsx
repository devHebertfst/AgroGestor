import { useState } from "react";
import { MapPinned, Plus, Trash2, Pencil, Sprout, Trees } from "lucide-react";
import { fmtNum, useFarm } from "@/context/FarmContext";
import { Property } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "@/components/agro/SectionCard";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const empty: Omit<Property, "id"> = {
  name: "", location: "", totalHa: 0, cultivableHa: 0, pastureHa: 0, freeHa: 0, notes: "",
};

export default function PropriedadesPage() {
  const { properties, addProperty, updateProperty, removeProperty } = useFarm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);

  const totalHa = properties.reduce((s, p) => s + p.totalHa, 0);
  const cultHa = properties.reduce((s, p) => s + p.cultivableHa, 0);
  const pastHa = properties.reduce((s, p) => s + p.pastureHa, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-gradient-card p-5 shadow-card">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total de propriedades</p>
          <p className="mt-1 font-display text-3xl font-bold text-foreground">{properties.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-gradient-card p-5 shadow-card">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Hectares totais</p>
          <p className="mt-1 font-display text-3xl font-bold text-foreground">{fmtNum(totalHa)} <span className="text-base font-medium text-muted-foreground">ha</span></p>
        </div>
        <div className="rounded-2xl border border-border bg-gradient-card p-5 shadow-card">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Cultivável / pasto</p>
          <p className="mt-1 font-display text-3xl font-bold text-foreground">{fmtNum(cultHa)} / {fmtNum(pastHa)}</p>
        </div>
      </div>

      <SectionCard
        title="Suas propriedades"
        subtitle="Cadastre fazendas, sítios e estâncias"
        actions={
          <Button className="rounded-full" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="mr-1.5 h-4 w-4" /> Nova propriedade
          </Button>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((p) => {
            const usedPct = p.totalHa > 0 ? Math.round(((p.cultivableHa + p.pastureHa) / p.totalHa) * 100) : 0;
            return (
              <div key={p.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition hover:shadow-elegant">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <MapPinned className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-base font-bold text-foreground">{p.name}</h4>
                      <p className="text-xs text-muted-foreground">{p.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(p); setOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => { removeProperty(p.id); toast("Propriedade removida"); }}>
                      <Trash2 className="h-4 w-4 text-danger" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-semibold">{fmtNum(p.totalHa)} ha</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-1"><Sprout className="h-3 w-3" /> Cultivável</span><span>{fmtNum(p.cultivableHa)} ha</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-1"><Trees className="h-3 w-3" /> Pasto</span><span>{fmtNum(p.pastureHa)} ha</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Livre</span><span>{fmtNum(p.freeHa)} ha</span></div>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-[11px] text-muted-foreground"><span>Uso da área</span><span>{usedPct}%</span></div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${usedPct}%` }} />
                  </div>
                </div>

                {p.notes && <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{p.notes}</p>}
              </div>
            );
          })}
        </div>
      </SectionCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar propriedade" : "Nova propriedade"}</DialogTitle>
          </DialogHeader>
          <PropertyForm
            initial={editing ?? { ...empty, id: "" } as Property}
            onSave={(data) => {
              if (editing) { updateProperty({ ...editing, ...data }); toast.success("Propriedade atualizada"); }
              else { addProperty(data); toast.success("Propriedade criada"); }
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PropertyForm({ initial, onSave }: { initial: Property; onSave: (p: Omit<Property, "id">) => void }) {
  const [f, setF] = useState<Property>(initial);
  return (
    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSave({ ...f }); }}>
      <div><Label>Nome</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required /></div>
      <div><Label>Localização</Label><Input value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} /></div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div><Label>Total (ha)</Label><Input type="number" min="0" value={f.totalHa} onChange={(e) => setF({ ...f, totalHa: +e.target.value })} /></div>
        <div><Label>Cultivável (ha)</Label><Input type="number" min="0" value={f.cultivableHa} onChange={(e) => setF({ ...f, cultivableHa: +e.target.value })} /></div>
        <div><Label>Pasto (ha)</Label><Input type="number" min="0" value={f.pastureHa} onChange={(e) => setF({ ...f, pastureHa: +e.target.value })} /></div>
        <div><Label>Livre (ha)</Label><Input type="number" min="0" value={f.freeHa} onChange={(e) => setF({ ...f, freeHa: +e.target.value })} /></div>
      </div>
      <div><Label>Observações</Label><Textarea rows={3} value={f.notes ?? ""} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
      <DialogFooter><Button type="submit" className="w-full">Salvar</Button></DialogFooter>
    </form>
  );
}
