import { useMemo, useState } from "react";
import { Plus, Sprout, Trash2 } from "lucide-react";
import { fmtBRL, fmtDate, fmtNum, useFarm } from "@/context/FarmContext";
import { Crop, CROP_STATUS_LABEL, CropStatus } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/agro/SectionCard";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const statusTone: Record<CropStatus, string> = {
  planejada: "bg-muted text-muted-foreground",
  em_andamento: "bg-success/15 text-success",
  colhida: "bg-accent/15 text-accent",
};

export default function PlantacoesPage() {
  const { crops, properties, addCrop, removeCrop } = useFarm();
  const [open, setOpen] = useState(false);
  const [fCulture, setFCulture] = useState("all");
  const [fSeason, setFSeason] = useState("all");
  const [fStatus, setFStatus] = useState<"all" | CropStatus>("all");

  const cultures = Array.from(new Set(crops.map((c) => c.culture)));
  const seasons = Array.from(new Set(crops.map((c) => c.season)));

  const filtered = useMemo(() => crops.filter((c) =>
    (fCulture === "all" || c.culture === fCulture) &&
    (fSeason === "all" || c.season === fSeason) &&
    (fStatus === "all" || c.status === fStatus)
  ), [crops, fCulture, fSeason, fStatus]);

  // resumo por cultura
  const byCulture = new Map<string, { hectares: number; cost: number; revenue: number }>();
  crops.forEach((c) => {
    const x = byCulture.get(c.culture) ?? { hectares: 0, cost: 0, revenue: 0 };
    x.hectares += c.hectares; x.cost += c.estimatedCost; x.revenue += c.estimatedRevenue;
    byCulture.set(c.culture, x);
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from(byCulture.entries()).map(([culture, v]) => (
          <div key={culture} className="rounded-2xl border border-border bg-gradient-card p-5 shadow-card">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/15 text-success"><Sprout className="h-5 w-5" /></div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Cultura</p>
                <p className="font-display text-base font-bold text-foreground">{culture}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div><p className="text-muted-foreground">Hectares</p><p className="font-semibold text-foreground">{fmtNum(v.hectares)} ha</p></div>
              <div><p className="text-muted-foreground">Custo/ha</p><p className="font-semibold text-foreground">{fmtBRL(v.cost / Math.max(v.hectares, 1))}</p></div>
              <div><p className="text-muted-foreground">Receita</p><p className="font-semibold text-success">{fmtBRL(v.revenue)}</p></div>
              <div><p className="text-muted-foreground">Lucro</p><p className="font-semibold text-foreground">{fmtBRL(v.revenue - v.cost)}</p></div>
            </div>
          </div>
        ))}
      </div>

      <SectionCard
        title="Plantações & safras"
        subtitle={`${filtered.length} plantações listadas`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Select value={fCulture} onValueChange={setFCulture}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas culturas</SelectItem>
                {cultures.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={fSeason} onValueChange={setFSeason}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas safras</SelectItem>
                {seasons.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={fStatus} onValueChange={(v) => setFStatus(v as "all" | CropStatus)}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                {Object.entries(CROP_STATUS_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button className="rounded-full" onClick={() => setOpen(true)}><Plus className="mr-1.5 h-4 w-4" /> Nova plantação</Button>
          </div>
        }
      >
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 text-left">Cultura / Safra</th>
                <th className="px-4 py-2.5 text-left">Propriedade</th>
                <th className="px-4 py-2.5 text-left">Talhão</th>
                <th className="px-4 py-2.5 text-right">Hectares</th>
                <th className="px-4 py-2.5 text-left">Plantio</th>
                <th className="px-4 py-2.5 text-left">Colheita</th>
                <th className="px-4 py-2.5 text-right">Lucro est.</th>
                <th className="px-4 py-2.5 text-left">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const prop = properties.find((p) => p.id === c.propertyId);
                return (
                  <tr key={c.id} className="border-t border-border hover:bg-secondary/40">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">{c.culture}</div>
                      <div className="text-xs text-muted-foreground">{c.season}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{prop?.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.field}</td>
                    <td className="px-4 py-3 text-right">{fmtNum(c.hectares)} ha</td>
                    <td className="px-4 py-3 text-muted-foreground">{fmtDate(c.plantingDate)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{fmtDate(c.harvestForecast)}</td>
                    <td className="px-4 py-3 text-right font-semibold">{fmtBRL(c.estimatedRevenue - c.estimatedCost)}</td>
                    <td className="px-4 py-3">
                      <Badge className={`rounded-full font-medium ${statusTone[c.status]}`}>{CROP_STATUS_LABEL[c.status]}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="icon" variant="ghost" onClick={() => { removeCrop(c.id); toast("Plantação removida"); }}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">Nenhuma plantação encontrada.</td></tr>}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Nova plantação</DialogTitle></DialogHeader>
          <CropForm
            properties={properties}
            onSave={(c) => { addCrop(c); toast.success("Plantação criada"); setOpen(false); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CropForm({ properties, onSave }: { properties: ReturnType<typeof useFarm>["properties"]; onSave: (c: Omit<Crop, "id">) => void }) {
  const [f, setF] = useState<Omit<Crop, "id">>({
    culture: "Soja", season: "2024/2025", propertyId: properties[0]?.id ?? "",
    field: "", hectares: 0, plantingDate: new Date().toISOString().slice(0, 10),
    harvestForecast: new Date().toISOString().slice(0, 10), status: "planejada",
    expectedYield: 0, estimatedCost: 0, estimatedRevenue: 0,
  });
  return (
    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSave(f); }}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div><Label>Cultura</Label><Input value={f.culture} onChange={(e) => setF({ ...f, culture: e.target.value })} /></div>
        <div><Label>Safra</Label><Input value={f.season} onChange={(e) => setF({ ...f, season: e.target.value })} /></div>
        <div className="sm:col-span-2">
          <Label>Propriedade</Label>
          <Select value={f.propertyId} onValueChange={(v) => setF({ ...f, propertyId: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{properties.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Talhão</Label><Input value={f.field} onChange={(e) => setF({ ...f, field: e.target.value })} /></div>
        <div><Label>Hectares</Label><Input type="number" value={f.hectares} onChange={(e) => setF({ ...f, hectares: +e.target.value })} /></div>
        <div><Label>Plantio</Label><Input type="date" value={f.plantingDate} onChange={(e) => setF({ ...f, plantingDate: e.target.value })} /></div>
        <div><Label>Colheita</Label><Input type="date" value={f.harvestForecast} onChange={(e) => setF({ ...f, harvestForecast: e.target.value })} /></div>
        <div>
          <Label>Status</Label>
          <Select value={f.status} onValueChange={(v) => setF({ ...f, status: v as CropStatus })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{Object.entries(CROP_STATUS_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Produtividade (sc/ha)</Label><Input type="number" value={f.expectedYield} onChange={(e) => setF({ ...f, expectedYield: +e.target.value })} /></div>
        <div><Label>Custo estimado</Label><Input type="number" value={f.estimatedCost} onChange={(e) => setF({ ...f, estimatedCost: +e.target.value })} /></div>
        <div><Label>Receita estimada</Label><Input type="number" value={f.estimatedRevenue} onChange={(e) => setF({ ...f, estimatedRevenue: +e.target.value })} /></div>
      </div>
      <DialogFooter><Button type="submit" className="w-full">Salvar plantação</Button></DialogFooter>
    </form>
  );
}
