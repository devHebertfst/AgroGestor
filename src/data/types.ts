export type UUID = string;

export interface Property {
  id: UUID;
  name: string;
  location: string;
  totalHa: number;
  cultivableHa: number;
  pastureHa: number;
  freeHa: number;
  notes?: string;
}

export type CropStatus = "planejada" | "em_andamento" | "colhida";

export interface Crop {
  id: UUID;
  culture: string;
  season: string; // ex: "2024/2025"
  propertyId: UUID;
  field: string; // talhão
  hectares: number;
  plantingDate: string; // ISO
  harvestForecast: string; // ISO
  status: CropStatus;
  expectedYield: number; // sacas/ha or kg/ha
  actualYield?: number;
  estimatedCost: number;
  estimatedRevenue: number;
}

export type AnimalSex = "macho" | "femea";
export type AnimalType = "boi" | "vaca" | "bezerro" | "novilha" | "touro";
export type AnimalStatus = "ativo" | "vendido" | "abatido";

export interface Livestock {
  id: UUID;
  tag: string; // identificação do lote/animal
  type: AnimalType;
  breed: string;
  sex: AnimalSex;
  ageMonths: number;
  weightKg: number;
  propertyId: UUID;
  status: AnimalStatus;
  purchaseDate: string;
  purchaseValue: number;
  estimatedValue: number;
  notes?: string;
  count?: number; // para lotes
}

export type TxType = "receita" | "despesa";
export type TxCategory =
  | "sementes"
  | "fertilizantes"
  | "defensivos"
  | "combustivel"
  | "mao_de_obra"
  | "manutencao"
  | "venda_animais"
  | "venda_producao"
  | "vacinacao"
  | "racao";

export interface Transaction {
  id: UUID;
  description: string;
  type: TxType;
  category: TxCategory;
  value: number;
  date: string; // ISO
  propertyId?: UUID;
  cropId?: UUID;
  livestockId?: UUID;
}

export const CATEGORY_LABEL: Record<TxCategory, string> = {
  sementes: "Sementes",
  fertilizantes: "Fertilizantes",
  defensivos: "Defensivos",
  combustivel: "Combustível",
  mao_de_obra: "Mão de obra",
  manutencao: "Manutenção",
  venda_animais: "Venda de animais",
  venda_producao: "Venda de produção",
  vacinacao: "Vacinação",
  racao: "Ração",
};

export const CROP_STATUS_LABEL: Record<CropStatus, string> = {
  planejada: "Planejada",
  em_andamento: "Em andamento",
  colhida: "Colhida",
};

export const ANIMAL_TYPE_LABEL: Record<AnimalType, string> = {
  boi: "Boi",
  vaca: "Vaca",
  bezerro: "Bezerro",
  novilha: "Novilha",
  touro: "Touro",
};

export type EventCategory =
  | "plantio"
  | "colheita"
  | "vacinacao"
  | "manutencao"
  | "financeiro"
  | "reuniao"
  | "outro";

export type EventPriority = "baixa" | "media" | "alta";

export interface FarmEvent {
  id: UUID;
  title: string;
  description?: string;
  date: string; // ISO yyyy-mm-dd
  time?: string; // HH:mm
  category: EventCategory;
  priority: EventPriority;
  propertyId?: UUID;
  done?: boolean;
}

export const EVENT_CATEGORY_LABEL: Record<EventCategory, string> = {
  plantio: "Plantio",
  colheita: "Colheita",
  vacinacao: "Vacinação",
  manutencao: "Manutenção",
  financeiro: "Financeiro",
  reuniao: "Reunião",
  outro: "Outro",
};

export const EVENT_PRIORITY_LABEL: Record<EventPriority, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};