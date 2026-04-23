import {
  AccountEntry,
  Crop,
  CropManagementRecord,
  FarmEvent,
  FarmTask,
  Livestock,
  Property,
  SanitaryRecord,
  StockItem,
  Transaction,
} from "./types";

const id = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2));

const today = new Date();
const addDays = (days: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const monthsAgo = (months: number, day = 10) => {
  const date = new Date(today.getFullYear(), today.getMonth() - months, day);
  return date.toISOString().slice(0, 10);
};

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
    harvestForecast: addDays(24),
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
    plantingDate: addDays(12),
    harvestForecast: addDays(96),
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
    harvestForecast: addDays(180),
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
];

export const seedTransactions: Transaction[] = [
  { id: id(), description: "Venda de soja - safra 23/24", type: "receita", category: "venda_producao", value: 1490000, date: monthsAgo(8, 12), propertyId: "prop-3", cropId: "crop-5" },
  { id: id(), description: "Compra de sementes de soja", type: "despesa", category: "sementes", value: 145000, date: monthsAgo(7, 5), propertyId: "prop-1", cropId: "crop-1" },
  { id: id(), description: "Adubação NPK", type: "despesa", category: "fertilizantes", value: 220000, date: monthsAgo(6, 18), propertyId: "prop-1", cropId: "crop-1" },
  { id: id(), description: "Diesel - frota agrícola", type: "despesa", category: "combustivel", value: 38500, date: monthsAgo(5, 8), propertyId: "prop-1" },
  { id: id(), description: "Mão de obra mensal", type: "despesa", category: "mao_de_obra", value: 62000, date: monthsAgo(4, 28), propertyId: "prop-1" },
  { id: id(), description: "Venda de bois - Lote 01", type: "receita", category: "venda_animais", value: 285000, date: monthsAgo(3, 15), propertyId: "prop-1", livestockId: "ani-1" },
  { id: id(), description: "Vacinação aftosa", type: "despesa", category: "vacinacao", value: 18400, date: monthsAgo(3, 22), propertyId: "prop-3" },
  { id: id(), description: "Ração suplementar", type: "despesa", category: "racao", value: 27800, date: monthsAgo(2, 6), propertyId: "prop-2" },
  { id: id(), description: "Defensivos - lagarta", type: "despesa", category: "defensivos", value: 96000, date: monthsAgo(2, 14), propertyId: "prop-1", cropId: "crop-1" },
  { id: id(), description: "Manutenção colheitadeira", type: "despesa", category: "manutencao", value: 24500, date: monthsAgo(1, 9), propertyId: "prop-1" },
  { id: id(), description: "Venda de feijão safra 23/24", type: "receita", category: "venda_producao", value: 360000, date: monthsAgo(1, 20), propertyId: "prop-2", cropId: "crop-3" },
  { id: id(), description: "Mão de obra mensal", type: "despesa", category: "mao_de_obra", value: 65000, date: monthsAgo(0, 5), propertyId: "prop-1" },
  { id: id(), description: "Adiantamento venda soja 24/25", type: "receita", category: "venda_producao", value: 420000, date: monthsAgo(0, 12), propertyId: "prop-1", cropId: "crop-1" },
];

export const seedStockItems: StockItem[] = [
  { id: "stock-1", name: "Semente de soja BMX Zeus", category: "sementes", unit: "sacas", quantity: 42, minQuantity: 30, unitCost: 420, expiryDate: addDays(140), propertyId: "prop-1", notes: "Reservado para talhão A1." },
  { id: "stock-2", name: "Fertilizante NPK 04-20-20", category: "fertilizantes", unit: "t", quantity: 18, minQuantity: 24, unitCost: 3200, propertyId: "prop-1", notes: "Reposição programada." },
  { id: "stock-3", name: "Herbicida pós-emergente", category: "defensivos", unit: "L", quantity: 85, minQuantity: 60, unitCost: 78, expiryDate: addDays(230), propertyId: "prop-1" },
  { id: "stock-4", name: "Ração proteica 20%", category: "racao", unit: "sacos", quantity: 16, minQuantity: 40, unitCost: 112, propertyId: "prop-2" },
  { id: "stock-5", name: "Vacina clostridial", category: "vacinas", unit: "doses", quantity: 320, minQuantity: 250, unitCost: 4.8, expiryDate: addDays(80), propertyId: "prop-3" },
  { id: "stock-6", name: "Diesel S10", category: "combustivel", unit: "L", quantity: 2400, minQuantity: 1800, unitCost: 6.15, propertyId: "prop-1" },
  { id: "stock-7", name: "Filtro hidráulico", category: "manutencao", unit: "un", quantity: 3, minQuantity: 6, unitCost: 185, propertyId: "prop-1" },
];

export const seedAccounts: AccountEntry[] = [
  { id: "acc-1", description: "Parcela financiamento trator", type: "pagar", category: "Financiamento", value: 48500, dueDate: addDays(-4), status: "atrasado", propertyId: "prop-1", notes: "Negociar juros antes do fechamento." },
  { id: "acc-2", description: "Compra programada de fertilizantes", type: "pagar", category: "Insumos", value: 126000, dueDate: addDays(5), status: "pendente", propertyId: "prop-1" },
  { id: "acc-3", description: "Recebimento cooperativa - soja", type: "receber", category: "Venda de produção", value: 220000, dueDate: addDays(8), status: "pendente", propertyId: "prop-1" },
  { id: "acc-4", description: "Venda de bezerros", type: "receber", category: "Venda de animais", value: 87500, dueDate: addDays(18), status: "pendente", propertyId: "prop-2" },
  { id: "acc-5", description: "Serviço de manutenção colheitadeira", type: "pagar", category: "Manutenção", value: 18300, dueDate: addDays(1), status: "pendente", propertyId: "prop-1" },
  { id: "acc-6", description: "Adiantamento recebido - milho", type: "receber", category: "Venda de produção", value: 64000, dueDate: addDays(-10), status: "pago", propertyId: "prop-1" },
];

export const seedEvents: FarmEvent[] = [
  { id: "ev-1", title: "Pulverização contra lagarta - Talhão A1", description: "Aplicar conforme recomendação técnica.", date: addDays(1), time: "06:00", category: "pulverizacao", priority: "alta", propertyId: "prop-1", cropId: "crop-1" },
  { id: "ev-2", title: "Vacinação aftosa - Lote 03", date: addDays(3), time: "08:30", category: "vacinacao", priority: "alta", propertyId: "prop-3", livestockId: "ani-3" },
  { id: "ev-3", title: "Plantio do milho safrinha", description: "Início do plantio no Talhão B2.", date: addDays(7), time: "05:30", category: "plantio", priority: "media", propertyId: "prop-1", cropId: "crop-2" },
  { id: "ev-4", title: "Pagamento financiamento Banco do Brasil", date: addDays(10), category: "pagamento", priority: "alta", propertyId: "prop-1" },
  { id: "ev-5", title: "Pesagem lote de bezerros", date: addDays(14), category: "pesagem", priority: "media", propertyId: "prop-2", livestockId: "ani-2" },
  { id: "ev-6", title: "Manutenção preventiva colheitadeira", date: addDays(20), time: "09:00", category: "manutencao", priority: "baixa", propertyId: "prop-1" },
  { id: "ev-7", title: "Previsão de início da colheita - Soja", date: addDays(28), category: "colheita", priority: "alta", propertyId: "prop-1", cropId: "crop-1" },
];

export const seedTasks: FarmTask[] = [
  { id: "task-1", title: "Conferir estoque de fertilizantes", description: "Validar volumes antes da compra programada.", assignee: "Carlos", priority: "alta", dueDate: addDays(2), propertyId: "prop-1", sector: "estoque", status: "pendente" },
  { id: "task-2", title: "Enviar documentos para cooperativa", description: "Notas fiscais e contrato de entrega da soja.", assignee: "Marina", priority: "media", dueDate: addDays(4), propertyId: "prop-1", sector: "financeiro", status: "em_andamento" },
  { id: "task-3", title: "Revisar bebedouros do pasto norte", description: "Checar vazamentos e boias.", assignee: "João", priority: "media", dueDate: addDays(-2), propertyId: "prop-3", sector: "rebanho", status: "pendente" },
  { id: "task-4", title: "Fechar relatório de custos da safra", description: "Consolidar manejo, insumos e mão de obra.", assignee: "Marina", priority: "alta", dueDate: addDays(8), propertyId: "prop-1", sector: "lavoura", status: "em_andamento" },
  { id: "task-5", title: "Limpar galpão de manutenção", description: "Organizar peças e ferramentas.", assignee: "Pedro", priority: "baixa", dueDate: addDays(12), propertyId: "prop-1", sector: "manutencao", status: "concluida" },
];

export const seedSanitaryRecords: SanitaryRecord[] = [
  { id: "san-1", livestockId: "ani-3", procedure: "vacinacao", date: addDays(-18), product: "Vacina clostridial", responsible: "Dra. Helena", cost: 2150, notes: "Aplicação em todo o lote." },
  { id: "san-2", livestockId: "ani-2", procedure: "vermifugacao", date: addDays(-10), product: "Ivermectina 1%", responsible: "João", cost: 980, notes: "Retorno em 90 dias." },
  { id: "san-3", livestockId: "ani-1", procedure: "suplementacao", date: addDays(-6), product: "Sal mineral proteinado", responsible: "Carlos", cost: 4200 },
  { id: "san-4", livestockId: "ani-1", procedure: "exame", date: addDays(-3), product: "Avaliação clínica", responsible: "Dra. Helena", cost: 740 },
];

export const seedCropManagementRecords: CropManagementRecord[] = [
  { id: "mgmt-1", cropId: "crop-1", type: "adubacao", date: addDays(-42), input: "NPK 04-20-20", quantity: 96, cost: 220000, responsible: "Carlos", notes: "Dose média de 300 kg/ha." },
  { id: "mgmt-2", cropId: "crop-1", type: "pulverizacao", date: addDays(-14), input: "Herbicida pós-emergente", quantity: 180, cost: 42000, responsible: "Pedro" },
  { id: "mgmt-3", cropId: "crop-2", type: "preparo_solo", date: addDays(-5), input: "Operação mecanizada", quantity: 180, cost: 36000, responsible: "Carlos" },
  { id: "mgmt-4", cropId: "crop-4", type: "irrigacao", date: addDays(-2), input: "Irrigação pivô", quantity: 220, cost: 18500, responsible: "Pedro" },
  { id: "mgmt-5", cropId: "crop-5", type: "colheita", date: "2024-02-28", input: "Colheita mecanizada", quantity: 280, cost: 98000, responsible: "Carlos" },
];
