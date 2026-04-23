import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import {
  Crop,
  FarmEvent,
  Livestock,
  Property,
  Transaction,
} from "@/data/types";
import {
  seedCrops,
  seedEvents,
  seedLivestock,
  seedProperties,
  seedTransactions,
} from "@/data/seed";
import { formatISODateBR } from "@/lib/utils";

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

interface FarmCtx {
  properties: Property[];
  crops: Crop[];
  livestock: Livestock[];
  transactions: Transaction[];
  events: FarmEvent[];
  addProperty: (p: Omit<Property, "id">) => void;
  updateProperty: (p: Property) => void;
  removeProperty: (id: string) => void;
  addCrop: (c: Omit<Crop, "id">) => void;
  updateCrop: (c: Crop) => void;
  removeCrop: (id: string) => void;
  addLivestock: (l: Omit<Livestock, "id">) => void;
  updateLivestock: (l: Livestock) => void;
  removeLivestock: (id: string) => void;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  updateTransaction: (t: Transaction) => void;
  removeTransaction: (id: string) => void;
  addEvent: (e: Omit<FarmEvent, "id">) => void;
  updateEvent: (e: FarmEvent) => void;
  removeEvent: (id: string) => void;
  toggleEventDone: (id: string) => void;
}

const Ctx = createContext<FarmCtx | null>(null);

export function FarmProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(seedProperties);
  const [crops, setCrops] = useState<Crop[]>(seedCrops);
  const [livestock, setLivestock] = useState<Livestock[]>(seedLivestock);
  const [transactions, setTransactions] =
    useState<Transaction[]>(seedTransactions);
  const [events, setEvents] = useState<FarmEvent[]>(seedEvents);

  const value = useMemo<FarmCtx>(
    () => ({
      properties,
      crops,
      livestock,
      transactions,
      events,
      addProperty: (p) =>
        setProperties((s) => [...s, { ...p, id: uid() }]),
      updateProperty: (p) =>
        setProperties((s) => s.map((x) => (x.id === p.id ? p : x))),
      removeProperty: (id) =>
        setProperties((s) => s.filter((x) => x.id !== id)),
      addCrop: (c) => setCrops((s) => [...s, { ...c, id: uid() }]),
      updateCrop: (c) =>
        setCrops((s) => s.map((x) => (x.id === c.id ? c : x))),
      removeCrop: (id) => setCrops((s) => s.filter((x) => x.id !== id)),
      addLivestock: (l) =>
        setLivestock((s) => [...s, { ...l, id: uid() }]),
      updateLivestock: (l) =>
        setLivestock((s) => s.map((x) => (x.id === l.id ? l : x))),
      removeLivestock: (id) =>
        setLivestock((s) => s.filter((x) => x.id !== id)),
      addTransaction: (t) =>
        setTransactions((s) => [{ ...t, id: uid() }, ...s]),
      updateTransaction: (t) =>
        setTransactions((s) => s.map((x) => (x.id === t.id ? t : x))),
      removeTransaction: (id) =>
        setTransactions((s) => s.filter((x) => x.id !== id)),
      addEvent: (e) => setEvents((s) => [...s, { ...e, id: uid() }]),
      updateEvent: (e) => setEvents((s) => s.map((x) => (x.id === e.id ? e : x))),
      removeEvent: (id) => setEvents((s) => s.filter((x) => x.id !== id)),
      toggleEventDone: (id) =>
        setEvents((s) => s.map((x) => (x.id === id ? { ...x, done: !x.done } : x))),
    }),
    [properties, crops, livestock, transactions, events],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFarm() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFarm must be used within FarmProvider");
  return ctx;
}

// formatting helpers
export const fmtBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
export const fmtNum = (n: number) =>
  n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
export const fmtDate = (iso: string) => {
  return formatISODateBR(iso);
};
