import { Crop, FarmEvent, Livestock, Property, Transaction } from "./types";

const id = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2));

export const seedProperties: Property[] = [
  {
    id: "prop-1",
    name: "Fazenda Boa Vista",
    location: "Rio Verde / GO",
    totalHa: 1240,
    cultivableHa: 820,
    pastureHa: 320,
    freeHa: 100,
    notes: "Sede principal da operação. Solo argiloso, irrigação parcial.",
  },
  {
    id: "prop-2",
    name: "Sítio Três Marias",
    location: "Patos de Minas / MG",
    totalHa: 380,
    cultivableHa: 210,
    pastureHa: 140,
    freeHa: 30,
    notes: "Área de transição lavoura-pecuária.",
  },
  {
    id: "prop-3",
    name: "Estância Aurora",
    location: "Dourados / MS",
    totalHa: 760,
    cultivableHa: 420,
    pastureHa: 300,
    freeHa: 40,
  },
];

export const seedCrops: Crop[] = [
  {
    id: "crop-1",
    culture: "Soja",
    season: "2024/2025",
    propertyId: "prop-1",
    field: "Talhão A1",
    hectares: 320,
    plantingDate: "2024-10-12",
    harvestForecast: "2025-02-20",
    status: "em_andamento",
    expectedYield: 62,
    estimatedCost: 980000,
    estimatedRevenue: 1680000,
  },
  {
    id: "crop-2",
    culture: "Milho",
    season: "2024/2025",
    propertyId: "prop-1",
    field: "Talhão B2",
    hectares: 180,
    plantingDate: "2025-02-25",
    harvestForecast: "2025-07-10",
    status: "planejada",
    expectedYield: 145,
    estimatedCost: 540000,
    estimatedRevenue: 920000,
  },
  {
    id: "crop-3",
    culture: "Feijão",
    season: "2023/2024",
    propertyId: "prop-2",
    field: "Talhão C1",
    hectares: 90,
    plantingDate: "2024-03-05",
    harvestForecast: "2024-06-20",
    status: "colhida",
    expectedYield: 28,
    actualYield: 31,
    estimatedCost: 210000,
    estimatedRevenue: 360000,
  },
  {
    id: "crop-4",
    culture: "Capim Mombaça",
    season: "Permanente",
    propertyId: "prop-3",
    field: "Pasto Norte",
    hectares: 220,
    plantingDate: "2023-09-15",
    harvestForecast: "2025-12-31",
    status: "em_andamento",
    expectedYield: 12,
    estimatedCost: 95000,
    estimatedRevenue: 0,
  },
  {
    id: "crop-5",
    culture: "Soja",
    season: "2023/2024",
    propertyId: "prop-3",
    field: "Talhão D3",
    hectares: 280,
    plantingDate: "2023-10-20",
    harvestForecast: "2024-02-28",
    status: "colhida",
    expectedYield: 60,
    actualYield: 64,
    estimatedCost: 820000,
    estimatedRevenue: 1490000,
  },
];

export const seedLivestock: Livestock[] = [
  {
    id: "ani-1",
    tag: "Lote 01 - Boi gordo",
    type: "boi",
    breed: "Nelore",
    sex: "macho",
    ageMonths: 32,
    weightKg: 510,
    propertyId: "prop-1",
    status: "ativo",
    purchaseDate: "2024-04-10",
    purchaseValue: 2800,
    estimatedValue: 3650,
    count: 120,
  },
  {
    id: "ani-2",
    tag: "Lote 02 - Bezerros",
    type: "bezerro",
    breed: "Angus x Nelore",
    sex: "macho",
    ageMonths: 9,
    weightKg: 210,
    propertyId: "prop-2",
    status: "ativo",
    purchaseDate: "2024-08-22",
    purchaseValue: 1850,
    estimatedValue: 2200,
    count: 64,
  },
  {
    id: "ani-3",
    tag: "Lote 03 - Matrizes",
    type: "vaca",
    breed: "Nelore PO",
    sex: "femea",
    ageMonths: 48,
    weightKg: 430,
    propertyId: "prop-3",
    status: "ativo",
    purchaseDate: "2023-11-05",
    purchaseValue: 4200,
    estimatedValue: 4800,
    count: 85,
  },
  {
    id: "ani-4",
    tag: "Touro Reprodutor #07",
    type: "touro",
    breed: "Brahman",
    sex: "macho",
    ageMonths: 60,
    weightKg: 920,
    propertyId: "prop-1",
    status: "ativo",
    purchaseDate: "2022-06-18",
    purchaseValue: 22000,
    estimatedValue: 28000,
    count: 1,
  },
  {
    id: "ani-5",
    tag: "Lote 04 - Novilhas",
    type: "novilha",
    breed: "Nelore",
    sex: "femea",
    ageMonths: 22,
    weightKg: 340,
    propertyId: "prop-3",
    status: "ativo",
    purchaseDate: "2024-02-15",
    purchaseValue: 2600,
    estimatedValue: 3100,
    count: 48,
  },
];

const today = new Date();
const d = (monthsAgo: number, day = 10) => {
  const dt = new Date(today.getFullYear(), today.getMonth() - monthsAgo, day);
  return dt.toISOString().slice(0, 10);
};

export const seedTransactions: Transaction[] = [
  { id: id(), description: "Venda de soja - safra 23/24", type: "receita", category: "venda_producao", value: 1490000, date: d(8, 12), propertyId: "prop-3", cropId: "crop-5" },
  { id: id(), description: "Compra de sementes de soja", type: "despesa", category: "sementes", value: 145000, date: d(7, 5), propertyId: "prop-1", cropId: "crop-1" },
  { id: id(), description: "Adubação NPK", type: "despesa", category: "fertilizantes", value: 220000, date: d(6, 18), propertyId: "prop-1", cropId: "crop-1" },
  { id: id(), description: "Diesel - frota agrícola", type: "despesa", category: "combustivel", value: 38500, date: d(5, 8), propertyId: "prop-1" },
  { id: id(), description: "Mão de obra mensal", type: "despesa", category: "mao_de_obra", value: 62000, date: d(4, 28), propertyId: "prop-1" },
  { id: id(), description: "Venda de bois - Lote 01", type: "receita", category: "venda_animais", value: 285000, date: d(3, 15), propertyId: "prop-1", livestockId: "ani-1" },
  { id: id(), description: "Vacinação aftosa", type: "despesa", category: "vacinacao", value: 18400, date: d(3, 22), propertyId: "prop-3" },
  { id: id(), description: "Ração suplementar", type: "despesa", category: "racao", value: 27800, date: d(2, 6), propertyId: "prop-2" },
  { id: id(), description: "Defensivos - lagarta", type: "despesa", category: "defensivos", value: 96000, date: d(2, 14), propertyId: "prop-1", cropId: "crop-1" },
  { id: id(), description: "Manutenção colheitadeira", type: "despesa", category: "manutencao", value: 24500, date: d(1, 9), propertyId: "prop-1" },
  { id: id(), description: "Venda de feijão safra 23/24", type: "receita", category: "venda_producao", value: 360000, date: d(1, 20), propertyId: "prop-2", cropId: "crop-3" },
  { id: id(), description: "Mão de obra mensal", type: "despesa", category: "mao_de_obra", value: 65000, date: d(0, 5), propertyId: "prop-1" },
  { id: id(), description: "Adiantamento venda soja 24/25", type: "receita", category: "venda_producao", value: 420000, date: d(0, 12), propertyId: "prop-1", cropId: "crop-1" },
  { id: id(), description: "Sementes de milho safrinha", type: "despesa", category: "sementes", value: 78000, date: d(0, 18), propertyId: "prop-1", cropId: "crop-2" },
];

const fwd = (days: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().slice(0, 10);
};

export const seedEvents: FarmEvent[] = [
  { id: "ev-1", title: "Aplicação de defensivo - Talhão A1", description: "Pulverização contra lagarta da soja.", date: fwd(1), time: "06:00", category: "manutencao", priority: "alta", propertyId: "prop-1" },
  { id: "ev-2", title: "Vacinação aftosa - Lote 03", date: fwd(3), time: "08:30", category: "vacinacao", priority: "alta", propertyId: "prop-3" },
  { id: "ev-3", title: "Plantio do milho safrinha", description: "Início do plantio no Talhão B2.", date: fwd(7), time: "05:30", category: "plantio", priority: "media", propertyId: "prop-1" },
  { id: "ev-4", title: "Reunião com cooperativa", date: fwd(10), time: "14:00", category: "reuniao", priority: "media" },
  { id: "ev-5", title: "Vencimento financiamento Banco do Brasil", date: fwd(14), category: "financeiro", priority: "alta" },
  { id: "ev-6", title: "Manutenção preventiva colheitadeira", date: fwd(20), time: "09:00", category: "manutencao", priority: "baixa", propertyId: "prop-1" },
  { id: "ev-7", title: "Previsão de início da colheita - Soja", date: fwd(28), category: "colheita", priority: "alta", propertyId: "prop-1" },
];