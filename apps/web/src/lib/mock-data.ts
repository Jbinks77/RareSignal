// ============================================================
// RareSignal — Mock Data (100% Français)
// ============================================================

export type CardCondition = "NM" | "EX" | "LP" | "PO";
export type CardRarity = "Commun" | "Peu Commun" | "Rare" | "Ultra Rare" | "Rare Secrète" | "Rare Illustration";

// Multiplicateurs de prix selon la condition
export const CONDITION_MULTIPLIERS: Record<CardCondition, number> = {
  NM: 1.0,     // Near Mint = prix de référence
  EX: 0.75,    // Excellent = -25%
  LP: 0.55,    // Légèrement Jouée = -45%
  PO: 0.30,    // Mauvais État = -70%
};

export const CONDITION_LABELS: Record<CardCondition, string> = {
  NM: "Near Mint",
  EX: "Excellent",
  LP: "Légèrement Jouée",
  PO: "Mauvais État",
};

export const CONDITION_COLORS: Record<CardCondition, string> = {
  NM: "text-green-400",
  EX: "text-blue-400",
  LP: "text-yellow-400",
  PO: "text-red-400",
};

export interface PokemonCard {
  id: string;
  name: string;
  cardNumber: string;       // ex: "201/196"
  set: string;              // Nom du set en français
  setCode: string;          // Code du set français
  rarity: CardRarity;
  condition: CardCondition;
  imageUrl: string;
  // Prix en NM (référence) — les prix pour d'autres conditions sont calculés
  priceCardmarket: number;
  priceEbay: number;
  priceVinted: number;
  variation7d: number;
  variation30d: number;
  score: number;
  volume: number;
}

export interface PricePoint {
  date: string;
  cardmarket: number;
  ebay: number;
  vinted: number;
}

export interface Alert {
  id: string;
  cardName: string;
  cardNumber: string;
  type: "price_drop" | "price_spike" | "new_listing" | "arbitrage";
  condition: string;
  threshold: number;
  active: boolean;
  triggeredAt: string | null;
  createdAt: string;
}

export interface Preorder {
  id: string;
  name: string;
  price: number;
  source: "Philibert" | "UltraJeux" | "Cardmarket";
  imageUrl: string;
  detectedAt: string;
  releaseDate: string;
  stockEstimate: "En stock" | "Stock limité" | "Rupture imminente";
  isNew: boolean;
  url: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "alert" | "preorder" | "system";
  read: boolean;
  createdAt: string;
}

// Helper: calcule le prix pour une condition donnée
export function getPriceForCondition(nmPrice: number, condition: CardCondition): number {
  return +(nmPrice * CONDITION_MULTIPLIERS[condition]).toFixed(2);
}

// --- Cartes (prix en NM) ---
export const mockCards: PokemonCard[] = [
  {
    id: "1",
    name: "Dracaufeu VMAX",
    cardNumber: "074/073",
    set: "Destinées de Champion",
    setCode: "DCP",
    rarity: "Rare Secrète",
    condition: "NM",
    imageUrl: "https://images.pokemontcg.io/swsh35/74.png",
    priceCardmarket: 285.00, priceEbay: 310.50, priceVinted: 230.00,
    variation7d: 12.5, variation30d: 28.3, score: 94, volume: 87
  },
  {
    id: "2",
    name: "Pikachu VMAX",
    cardNumber: "188/185",
    set: "Voltage Éclatant",
    setCode: "VE",
    rarity: "Rare Secrète",
    condition: "NM",
    imageUrl: "https://images.pokemontcg.io/swsh4/188.png",
    priceCardmarket: 195.00, priceEbay: 215.00, priceVinted: 160.00,
    variation7d: 8.2, variation30d: 15.1, score: 88, volume: 124
  },
  {
    id: "3",
    name: "Mew VMAX",
    cardNumber: "268/264",
    set: "Poing de Fusion",
    setCode: "PF",
    rarity: "Ultra Rare",
    condition: "NM",
    imageUrl: "https://images.pokemontcg.io/swsh8/268.png",
    priceCardmarket: 142.50, priceEbay: 155.00, priceVinted: 110.00,
    variation7d: 15.8, variation30d: 32.4, score: 91, volume: 56
  },
  {
    id: "4",
    name: "Rayquaza VMAX",
    cardNumber: "217/225",
    set: "Évolution Céleste",
    setCode: "EC",
    rarity: "Ultra Rare",
    condition: "NM",
    imageUrl: "https://images.pokemontcg.io/swsh7/217.png",
    priceCardmarket: 320.00, priceEbay: 345.00, priceVinted: 270.00,
    variation7d: -3.2, variation30d: 5.7, score: 72, volume: 43
  },
  {
    id: "5",
    name: "Noctali VMAX",
    cardNumber: "214/225",
    set: "Évolution Céleste",
    setCode: "EC",
    rarity: "Ultra Rare",
    condition: "NM",
    imageUrl: "https://images.pokemontcg.io/swsh7/214.png",
    priceCardmarket: 410.00, priceEbay: 440.00, priceVinted: 350.00,
    variation7d: 5.1, variation30d: 18.9, score: 85, volume: 38
  },
  {
    id: "6",
    name: "Giratina VSTAR",
    cardNumber: "201/196",
    set: "Origine Perdue",
    setCode: "OP",
    rarity: "Ultra Rare",
    condition: "NM",
    imageUrl: "https://images.pokemontcg.io/swsh11/201.png",
    priceCardmarket: 55.00, priceEbay: 62.00, priceVinted: 42.00,
    variation7d: 22.4, variation30d: 45.2, score: 96, volume: 210
  },
  {
    id: "7",
    name: "Lugia VSTAR",
    cardNumber: "211/195",
    set: "Tempête Argentée",
    setCode: "TA",
    rarity: "Ultra Rare",
    condition: "EX",
    imageUrl: "https://images.pokemontcg.io/swsh12/211.png",
    priceCardmarket: 88.00, priceEbay: 95.00, priceVinted: 68.00,
    variation7d: 18.3, variation30d: 35.7, score: 93, volume: 95
  },
  {
    id: "8",
    name: "Mewtwo GX",
    cardNumber: "SV59/SV94",
    set: "Destinées Occultes",
    setCode: "DO",
    rarity: "Rare Secrète",
    condition: "NM",
    imageUrl: "https://images.pokemontcg.io/sma/SV59.png",
    priceCardmarket: 72.00, priceEbay: 80.00, priceVinted: 55.00,
    variation7d: 6.8, variation30d: 12.3, score: 78, volume: 67
  },
  {
    id: "9",
    name: "Mentali VMAX",
    cardNumber: "270/264",
    set: "Poing de Fusion",
    setCode: "PF",
    rarity: "Ultra Rare",
    condition: "NM",
    imageUrl: "https://images.pokemontcg.io/swsh8/270.png",
    priceCardmarket: 165.00, priceEbay: 180.00, priceVinted: 135.00,
    variation7d: -1.5, variation30d: 8.2, score: 65, volume: 32
  },
  {
    id: "10",
    name: "Dracaufeu ex",
    cardNumber: "228/197",
    set: "Flammes Obsidiennes",
    setCode: "FO",
    rarity: "Rare Illustration",
    condition: "NM",
    imageUrl: "https://images.pokemontcg.io/sv3/228.png",
    priceCardmarket: 125.00, priceEbay: 138.00, priceVinted: 98.00,
    variation7d: 9.7, variation30d: 22.1, score: 87, volume: 156
  },
  {
    id: "11",
    name: "Wo-Chien ex",
    cardNumber: "232/193",
    set: "Évolutions à Paldea",
    setCode: "EPA",
    rarity: "Rare Illustration",
    condition: "NM",
    imageUrl: "https://images.pokemontcg.io/sv2/232.png",
    priceCardmarket: 38.00, priceEbay: 42.00, priceVinted: 28.00,
    variation7d: 4.5, variation30d: 10.8, score: 71, volume: 189
  },
  {
    id: "12",
    name: "Miraidon ex",
    cardNumber: "253/198",
    set: "Écarlate et Violet",
    setCode: "EV",
    rarity: "Rare Illustration",
    condition: "NM",
    imageUrl: "https://images.pokemontcg.io/sv1/253.png",
    priceCardmarket: 52.00, priceEbay: 58.00, priceVinted: 40.00,
    variation7d: 11.2, variation30d: 19.5, score: 82, volume: 144
  },
  {
    id: "13",
    name: "Koraidon ex",
    cardNumber: "254/198",
    set: "Écarlate et Violet",
    setCode: "EV",
    rarity: "Rare Illustration",
    condition: "EX",
    imageUrl: "https://images.pokemontcg.io/sv1/254.png",
    priceCardmarket: 45.00, priceEbay: 50.00, priceVinted: 34.00,
    variation7d: 7.3, variation30d: 14.6, score: 76, volume: 98
  },
  {
    id: "14",
    name: "Ectoplasma VMAX",
    cardNumber: "271/264",
    set: "Poing de Fusion",
    setCode: "PF",
    rarity: "Ultra Rare",
    condition: "NM",
    imageUrl: "https://images.pokemontcg.io/swsh8/271.png",
    priceCardmarket: 28.00, priceEbay: 32.00, priceVinted: 20.00,
    variation7d: 14.2, variation30d: 28.9, score: 83, volume: 230
  },
  {
    id: "15",
    name: "Arceus VSTAR",
    cardNumber: "184/172",
    set: "Stars Étincelantes",
    setCode: "SE",
    rarity: "Ultra Rare",
    condition: "LP",
    imageUrl: "https://images.pokemontcg.io/swsh9/184.png",
    priceCardmarket: 18.50, priceEbay: 22.00, priceVinted: 14.00,
    variation7d: -5.2, variation30d: -2.1, score: 45, volume: 310
  },
  {
    id: "16",
    name: "Palkia VSTAR",
    cardNumber: "208/189",
    set: "Astres Radieux",
    setCode: "AR",
    rarity: "Ultra Rare",
    condition: "NM",
    imageUrl: "https://images.pokemontcg.io/swsh10/208.png",
    priceCardmarket: 95.00, priceEbay: 105.00, priceVinted: 75.00,
    variation7d: 3.8, variation30d: 9.4, score: 69, volume: 52
  },
  {
    id: "17",
    name: "Gourmelet",
    cardNumber: "209/197",
    set: "Flammes Obsidiennes",
    setCode: "FO",
    rarity: "Rare",
    condition: "NM",
    imageUrl: "https://images.pokemontcg.io/sv3/209.png",
    priceCardmarket: 8.50, priceEbay: 10.00, priceVinted: 5.50,
    variation7d: 25.0, variation30d: 60.0, score: 89, volume: 450
  },
  {
    id: "18",
    name: "Dialga VSTAR",
    cardNumber: "198/189",
    set: "Astres Radieux",
    setCode: "AR",
    rarity: "Ultra Rare",
    condition: "NM",
    imageUrl: "https://images.pokemontcg.io/swsh10/198.png",
    priceCardmarket: 22.00, priceEbay: 26.00, priceVinted: 16.00,
    variation7d: 8.9, variation30d: 15.3, score: 74, volume: 178
  },
  {
    id: "19",
    name: "Pikachu",
    cardNumber: "173/165",
    set: "EV3.5 — 151",
    setCode: "EV3.5",
    rarity: "Rare Illustration",
    condition: "NM",
    imageUrl: "https://images.pokemontcg.io/sv3pt5/173.png",
    priceCardmarket: 12.00, priceEbay: 14.50, priceVinted: 8.00,
    variation7d: 33.0, variation30d: 55.0, score: 92, volume: 520
  },
  {
    id: "20",
    name: "Dracaufeu ex",
    cardNumber: "199/165",
    set: "EV3.5 — 151",
    setCode: "EV3.5",
    rarity: "Ultra Rare",
    condition: "NM",
    imageUrl: "https://images.pokemontcg.io/sv3pt5/199.png",
    priceCardmarket: 68.00, priceEbay: 75.00, priceVinted: 52.00,
    variation7d: 10.5, variation30d: 24.8, score: 86, volume: 290
  },
  {
    id: "21",
    name: "Mew ex",
    cardNumber: "205/165",
    set: "EV3.5 — 151",
    setCode: "EV3.5",
    rarity: "Rare Illustration",
    condition: "NM",
    imageUrl: "https://images.pokemontcg.io/sv3pt5/205.png",
    priceCardmarket: 95.00, priceEbay: 108.00, priceVinted: 78.00,
    variation7d: 6.2, variation30d: 18.5, score: 80, volume: 74
  },
  {
    id: "22",
    name: "Alakazam ex",
    cardNumber: "201/165",
    set: "EV3.5 — 151",
    setCode: "EV3.5",
    rarity: "Rare Illustration",
    condition: "NM",
    imageUrl: "https://images.pokemontcg.io/sv3pt5/201.png",
    priceCardmarket: 42.00, priceEbay: 48.00, priceVinted: 32.00,
    variation7d: 2.1, variation30d: 7.8, score: 58, volume: 110
  },
];

// --- Historique de prix (pour les graphiques) ---
function generatePriceHistory(baseCardmarket: number, baseEbay: number, baseVinted: number, days: number = 90): PricePoint[] {
  const points: PricePoint[] = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const noise = () => (Math.random() - 0.45) * 0.08;
    const trend = (days - i) / days * 0.15;
    points.push({
      date: date.toISOString().split("T")[0],
      cardmarket: +(baseCardmarket * (0.85 + trend + noise())).toFixed(2),
      ebay: +(baseEbay * (0.85 + trend + noise())).toFixed(2),
      vinted: +(baseVinted * (0.82 + trend + noise())).toFixed(2),
    });
  }
  return points;
}

export const mockPriceHistories: Record<string, PricePoint[]> = {
  "1": generatePriceHistory(285, 310, 230),
  "2": generatePriceHistory(195, 215, 160),
  "3": generatePriceHistory(142, 155, 110),
  "6": generatePriceHistory(55, 62, 42),
  "7": generatePriceHistory(88, 95, 68),
  "10": generatePriceHistory(125, 138, 98),
  "14": generatePriceHistory(28, 32, 20),
  "17": generatePriceHistory(8.5, 10, 5.5),
  "19": generatePriceHistory(12, 14.5, 8),
  "20": generatePriceHistory(68, 75, 52),
};

// --- Alertes ---
export const mockAlerts: Alert[] = [
  { id: "a1", cardName: "Dracaufeu VMAX", cardNumber: "074/073", type: "price_spike", condition: "Prix > 300€ sur Cardmarket", threshold: 300, active: true, triggeredAt: "2026-03-12T14:30:00Z", createdAt: "2026-02-15T10:00:00Z" },
  { id: "a2", cardName: "Giratina VSTAR", cardNumber: "201/196", type: "price_spike", condition: "Hausse > 20% sur 7j", threshold: 20, active: true, triggeredAt: "2026-03-13T08:15:00Z", createdAt: "2026-03-01T09:00:00Z" },
  { id: "a3", cardName: "Pikachu VMAX", cardNumber: "188/185", type: "price_drop", condition: "Prix < 180€ sur Vinted", threshold: 180, active: true, triggeredAt: null, createdAt: "2026-02-20T11:30:00Z" },
  { id: "a4", cardName: "Noctali VMAX", cardNumber: "214/225", type: "arbitrage", condition: "Marge Vinted/CM > 25%", threshold: 25, active: true, triggeredAt: "2026-03-11T16:45:00Z", createdAt: "2026-01-10T08:00:00Z" },
  { id: "a5", cardName: "Lugia VSTAR", cardNumber: "211/195", type: "new_listing", condition: "Nouveau listing NM < 80€", threshold: 80, active: false, triggeredAt: "2026-03-09T12:00:00Z", createdAt: "2026-02-28T14:00:00Z" },
  { id: "a6", cardName: "Mew VMAX", cardNumber: "268/264", type: "price_spike", condition: "Hausse > 15% sur 7j", threshold: 15, active: true, triggeredAt: "2026-03-13T09:00:00Z", createdAt: "2026-03-05T10:00:00Z" },
  { id: "a7", cardName: "Pikachu", cardNumber: "173/165", type: "price_spike", condition: "Hausse > 30% sur 7j", threshold: 30, active: true, triggeredAt: "2026-03-12T11:20:00Z", createdAt: "2026-03-10T15:00:00Z" },
];

// --- Précommandes ---
export const mockPreorders: Preorder[] = [
  { id: "p1", name: "Coffret Dresseur d'Élite — Évolutions Prismatiques", price: 54.95, source: "Philibert", imageUrl: "/products/prismatic-etb.png", detectedAt: "2026-03-13T06:00:00Z", releaseDate: "2026-04-15", stockEstimate: "En stock", isNew: true, url: "#" },
  { id: "p2", name: "Display 36 Boosters — Étincelles Déferlantes", price: 139.90, source: "UltraJeux", imageUrl: "/products/surging-sparks-bb.png", detectedAt: "2026-03-12T14:00:00Z", releaseDate: "2026-05-01", stockEstimate: "Stock limité", isNew: true, url: "#" },
  { id: "p3", name: "Coffret Dresseur d'Élite — Flammes Obsidiennes", price: 49.95, source: "Philibert", imageUrl: "/products/obsidian-flames-etb.png", detectedAt: "2026-03-10T08:00:00Z", releaseDate: "2026-03-28", stockEstimate: "En stock", isNew: false, url: "#" },
  { id: "p4", name: "Display 36 Boosters — Évolutions à Paldea", price: 159.90, source: "Cardmarket", imageUrl: "/products/paldea-display.png", detectedAt: "2026-03-08T10:00:00Z", releaseDate: "2026-04-05", stockEstimate: "Rupture imminente", isNew: false, url: "#" },
  { id: "p5", name: "Coffret Collection Premium — Rayquaza VMAX", price: 89.95, source: "UltraJeux", imageUrl: "/products/rayquaza-collection.png", detectedAt: "2026-03-13T09:30:00Z", releaseDate: "2026-05-15", stockEstimate: "En stock", isNew: true, url: "#" },
  { id: "p6", name: "Collection Ultra-Premium — EV3.5 151", price: 119.95, source: "Philibert", imageUrl: "/products/151-upc.png", detectedAt: "2026-03-07T12:00:00Z", releaseDate: "2026-04-20", stockEstimate: "Stock limité", isNew: false, url: "#" },
];

// --- Notifications ---
export const mockNotifications: Notification[] = [
  { id: "n1", title: "Alerte prix", message: "Giratina VSTAR 201/196 a augmenté de 22.4% en 7 jours", type: "alert", read: false, createdAt: "2026-03-13T08:15:00Z" },
  { id: "n2", title: "Nouvelle précommande", message: "Évolutions Prismatiques ETB disponible sur Philibert", type: "preorder", read: false, createdAt: "2026-03-13T06:00:00Z" },
  { id: "n3", title: "Opportunité d'arbitrage", message: "Noctali VMAX 214/225 : marge 25% Vinted/Cardmarket", type: "alert", read: false, createdAt: "2026-03-12T16:45:00Z" },
  { id: "n4", title: "Alerte prix", message: "Dracaufeu VMAX 074/073 a dépassé 300€ sur Cardmarket", type: "alert", read: true, createdAt: "2026-03-12T14:30:00Z" },
  { id: "n5", title: "Nouvelle précommande", message: "Display Étincelles Déferlantes disponible sur UltraJeux", type: "preorder", read: true, createdAt: "2026-03-12T14:00:00Z" },
];

// --- Statistiques ---
export const mockStats = {
  trackedCards: 22,
  activeAlerts: 5,
  opportunitiesToday: 8,
  marketTrend: 7.3,
};

// --- Sets disponibles ---
export const pokemonSets = [
  "Destinées de Champion",
  "Voltage Éclatant",
  "Poing de Fusion",
  "Évolution Céleste",
  "Origine Perdue",
  "Tempête Argentée",
  "Destinées Occultes",
  "Flammes Obsidiennes",
  "Évolutions à Paldea",
  "Écarlate et Violet",
  "Stars Étincelantes",
  "Astres Radieux",
  "EV3.5 — 151",
];
