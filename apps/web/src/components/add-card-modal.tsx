"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Plus, Check, Loader2, Euro, Package } from "lucide-react";
import Image from "next/image";
import {
  type CardCondition,
  CONDITION_LABELS,
  CONDITION_COLORS,
  CONDITION_MULTIPLIERS,
} from "@/lib/mock-data";
import { usePortfolio, type PortfolioCard, type CardLanguage, LANGUAGE_FLAGS, LANGUAGE_LABELS } from "@/lib/portfolio-context";
import { searchLocalCards } from "@/lib/cards-database";

// Traduction noms français → anglais (pokemontcg.io utilise les noms anglais)
const FR_TO_EN: Record<string, string> = {
  "dracaufeu": "charizard",
  "florizarre": "venusaur",
  "tortank": "blastoise",
  "bulbizarre": "bulbasaur",
  "salamèche": "charmander",
  "carapuce": "squirtle",
  "ronflex": "snorlax",
  "mewtwo": "mewtwo",
  "mew": "mew",
  "noctali": "umbreon",
  "mentali": "espeon",
  "pyroli": "flareon",
  "aquali": "vaporeon",
  "voltali": "jolteon",
  "phyllali": "leafeon",
  "givrali": "glaceon",
  "nymphali": "sylveon",
  "évoli": "eevee",
  "evoli": "eevee",
  "lugia": "lugia",
  "ho-oh": "ho-oh",
  "pikachu": "pikachu",
  "raichu": "raichu",
  "magicarpe": "magikarp",
  "léviator": "gyarados",
  "leviator": "gyarados",
  "ectoplasma": "gengar",
  "lokhlass": "lapras",
  "hypnomade": "hypno",
  "alakazam": "alakazam",
  "mackogneur": "machamp",
  "golem": "golem",
  "kangourex": "kangaskhan",
  "voltorbe": "voltorb",
  "électrode": "electrode",
  "electrode": "electrode",
  "excelangue": "lickitung",
  "rhinoféros": "rhydon",
  "rhinoferos": "rhydon",
  "smogo": "koffing",
  "weezing": "weezing",
  "scarabrute": "scyther",
  "insécateur": "scizor",
  "insecartur": "scizor",
  "tygnon": "hitmonchan",
  "kicklee": "hitmonlee",
  "tauros": "tauros",
  "fushigidane": "bulbasaur",
  "tentacruel": "tentacruel",
  "racaillou": "geodude",
  "onix": "onix",
  "psykokwak": "psyduck",
  "caninos": "growlithe",
  "arcanin": "arcanine",
  "abra": "abra",
  "kadabra": "kadabra",
  "machoc": "machop",
  "chenipan": "caterpie",
  "chrysallide": "metapod",
  "papilusion": "butterfree",
  "aspicot": "weedle",
  "coconfort": "kakuna",
  "dardargnan": "beedrill",
  "roucool": "pidgey",
  "roucoups": "pidgeotto",
  "roucarnage": "pidgeot",
  "rattata": "rattata",
  "rattatac": "raticate",
  "envol": "spearow",
  "airmure": "fearow",
  "arbok": "arbok",
  "akwakwak": "poliwag",
  "ptitard": "poliwag",
  "têtarte": "poliwag",
  "tartard": "poliwrath",
  "vipélierre": "ekans",
  "vipereine": "arbok",
  "magnéti": "magnemite",
  "magneton": "magneton",
  "doduo": "doduo",
  "dodrio": "dodrio",
  "otaria": "seel",
  "lamantine": "dewgong",
  "articuno": "articuno",
  "électhor": "zapdos",
  "electhor": "zapdos",
  "sulfura": "moltres",
  "minidraco": "dratini",
  "draco": "dragonair",
  "dracolosse": "dragonite",
  "giratina": "giratina",
  "dialga": "dialga",
  "palkia": "palkia",
  "darkrai": "darkrai",
  "arceus": "arceus",
  "reshiram": "reshiram",
  "zekrom": "zekrom",
  "kyurem": "kyurem",
  "xerneas": "xerneas",
  "yveltal": "yveltal",
  "zygarde": "zygarde",
  "solgaleo": "solgaleo",
  "lunala": "lunala",
  "necrozma": "necrozma",
  "marshadow": "marshadow",
  "zacian": "zacian",
  "zamazenta": "zamazenta",
  "éternatusv": "eternatus",
  "eternatus": "eternatus",
  "calyrex": "calyrex",
  "rayquaza": "rayquaza",
  "groudon": "groudon",
  "kyogre": "kyogre",
  "regice": "regice",
  "regirock": "regirock",
  "registeel": "registeel",
  "latias": "latias",
  "latios": "latios",
  "jirachi": "jirachi",
  "déoxys": "deoxys",
  "deoxys": "deoxys",
  "gardevoir": "gardevoir",
  "togekiss": "togekiss",
  "mucuscule": "snom",
  "tiplouf": "piplup",
  "prinplouf": "prinplup",
  "pingoléon": "empoleon",
  "pingloen": "empoleon",
  "gruikui": "tepig",
  "flamajou": "pignite",
  "brasegali": "emboar",
  "moustillon": "oshawott",
  "mtraneroar": "dewott",
  "clamiral": "samurott",
  "vipéfeu": "fennekin",
  "feunnec": "fennekin",
  "roussil": "braixen",
  "goupelin": "delphox",
  "marisson": "chespin",
  "qwilfish": "qwilfish",
  "froakie": "froakie",
  "croâporal": "frogadier",
  "amphinobi": "greninja",
  "ouisticram": "pansear",
  "litten": "litten",
  "torracat": "torracat",
  "incineroar": "incineroar",
  "plumeline": "oricorio",
  "tokorico": "rowlet",
  "efflèche": "dartrix",
  "archéduc": "decidueye",
  "otaquin": "popplio",
  "bébécaille": "brionne",
  "tokopisco": "primarina",
  "brindibou": "rowlet",
  "gourmelet": "greedent",
  "scorbunny": "scorbunny",
  "lapin-feu": "raboot",
  "jackrobin": "cinderace",
  "larméléon": "sobble",
  "arrozard": "drizzile",
  "angoliath": "inteleon",
  "ouistempo": "grookey",
  "badabouin": "thwackey",
  "gorythmic": "rillaboom",
  "morpeko": "morpeko",
  "falinks": "falinks",
  "duralugon": "duraludon",
  "draïeul": "drakloak",
  "skwovet": "skwovet",
  "koraidon": "koraidon",
  "miraidon": "miraidon",
  "terapagos": "terapagos",
  "wo-chien": "wo-chien",
  "chien-pao": "chien-pao",
  "ting-lu": "ting-lu",
  "chi-yu": "chi-yu",
};

// --- Types API pokemontcg.io ---
interface TcgCard {
  id: string;
  name: string;
  number: string;
  rarity?: string;
  set: { id: string; name: string; series: string };
  images: { small: string; large: string };
  cardmarket?: { prices?: { averageSellPrice?: number; avg7?: number } };
}

interface AddCardModalProps {
  open: boolean;
  onClose: () => void;
  onAdded?: () => void;
}

// Traduit un nom français en anglais pour interroger pokemontcg.io
function translateToEnglish(query: string): string {
  const lower = query.toLowerCase().trim();
  return FR_TO_EN[lower] ?? query.trim();
}

export function AddCardModal({ open, onClose, onAdded }: AddCardModalProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<TcgCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<TcgCard | null>(null);
  const [condition, setCondition] = useState<CardCondition>("NM");
  const [language, setLanguage] = useState<CardLanguage>("fr");
  const [purchasePrice, setPurchasePrice] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { addCard, isTracked } = usePortfolio();

  // Reset à l'ouverture
  useEffect(() => {
    if (open) {
      setSearch("");
      setResults([]);
      setSelectedCard(null);
      setCondition("NM");
      setLanguage("fr");
      setPurchasePrice("");
      setQuantity("1");
      setSuccess(false);
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Fermer avec Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Recherche avec debounce 350ms
  const doSearch = useCallback(async (query: string) => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);

    // Traduit le nom français → anglais si nécessaire
    const englishQuery = translateToEnglish(query);

    try {
      // Cherche par nom OU numéro de carte
      // Note: pas de guillemets autour des wildcards (syntaxe Lucene pokemontcg.io)
      // supertype:Pokémon filtre les cartes Dresseur/Énergie qui faussent les résultats
      const isNumber = /^\d+/.test(englishQuery);
      const q = isNumber
        ? `number:${englishQuery}*`
        : `name:*${englishQuery}* supertype:Pokémon`;

      const res = await fetch(
        `/api/tcg/search?q=${encodeURIComponent(q)}&pageSize=20&orderBy=-set.releaseDate`
      );
      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();

      if (data.data && data.data.length > 0) {
        setResults(data.data);
      } else {
        // Aucun résultat API → tenter la base locale
        const localResults = searchLocalCards(englishQuery, 20);
        setResults(localResults as TcgCard[]);
      }
    } catch {
      // API indisponible → fallback base locale
      const localResults = searchLocalCards(englishQuery, 20);
      if (localResults.length > 0) {
        setResults(localResults as TcgCard[]);
        setError(null);
      } else {
        // Essayer aussi avec la requête originale (au cas où c'est un nom anglais)
        const fallbackResults = searchLocalCards(query.trim(), 20);
        setResults(fallbackResults as TcgCard[]);
        if (fallbackResults.length === 0) {
          setError("Impossible de joindre le serveur. Essayez un autre nom.");
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!search.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);
    searchTimeout.current = setTimeout(() => doSearch(search), 350);
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
  }, [search, doSearch]);

  // Quand on sélectionne une carte : pré-remplir le prix de marché
  function handleSelectCard(card: TcgCard) {
    setSelectedCard(card);
    setSearch("");
    // Prix moyen Cardmarket × multiplicateur condition si disponible
    const marketPrice = card.cardmarket?.prices?.averageSellPrice
      ?? card.cardmarket?.prices?.avg7;
    if (marketPrice) {
      const condPct = CONDITION_MULTIPLIERS[condition];
      setPurchasePrice((marketPrice * condPct).toFixed(2));
    } else {
      setPurchasePrice("");
    }
  }

  // Quand on change la condition, recalculer le prix suggéré
  function handleConditionChange(cond: CardCondition) {
    setCondition(cond);
    if (selectedCard) {
      const marketPrice = selectedCard.cardmarket?.prices?.averageSellPrice
        ?? selectedCard.cardmarket?.prices?.avg7;
      if (marketPrice) {
        setPurchasePrice((marketPrice * CONDITION_MULTIPLIERS[cond]).toFixed(2));
      }
    }
  }

  function handleAdd() {
    if (!selectedCard) return;
    const price = parseFloat(purchasePrice);
    if (isNaN(price) || price <= 0) {
      setError("Veuillez entrer un prix d'achat valide");
      return;
    }
    const qty = parseInt(quantity) || 1;

    const portfolioCard: PortfolioCard = {
      apiId: selectedCard.id,
      name: selectedCard.name,
      number: selectedCard.number,
      set: selectedCard.set.name,
      setId: selectedCard.set.id,
      imageUrl: selectedCard.images.large || selectedCard.images.small,
      rarity: selectedCard.rarity,
      language,
      marketPriceAtAdd: selectedCard.cardmarket?.prices?.averageSellPrice
        ?? selectedCard.cardmarket?.prices?.avg7,
    };

    addCard(portfolioCard, condition, price, qty);
    setSuccess(true);
    setTimeout(() => {
      onAdded?.();
      onClose();
    }, 900);
  }

  const marketPrice = selectedCard?.cardmarket?.prices?.averageSellPrice
    ?? selectedCard?.cardmarket?.prices?.avg7;
  const parsedPurchase = parseFloat(purchasePrice);
  const priceDiff = marketPrice && !isNaN(parsedPurchase)
    ? ((parsedPurchase - marketPrice) / marketPrice) * 100
    : null;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg bg-[#0F0F1A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 flex-shrink-0">
          <div>
            <h2 className="text-sm font-semibold">Ajouter une carte</h2>
            <p className="text-[11px] text-white/40 mt-0.5">
              Recherchez en français ou anglais · Toutes les séries
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5 text-white/60" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Search */}
          {!selectedCard && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Ex: Dracaufeu, Pikachu, Giratina VSTAR, 201..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/40 transition-colors"
              />
              {loading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 animate-spin" />
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Results */}
          {!selectedCard && (
            <div className="max-h-56 overflow-y-auto space-y-0.5">
              {!search.trim() && !loading && (
                <div className="py-6 text-center text-xs text-white/25">
                  Tapez le nom d&apos;une carte ou son numéro pour rechercher
                </div>
              )}
              {search.trim().length >= 2 && !loading && results.length === 0 && !error && (
                <div className="py-6 text-center text-xs text-white/30">
                  Aucune carte trouvée pour &quot;{search}&quot;
                </div>
              )}
              {results.map((card) => {
                const tracked = isTracked(card.id);
                const mktPrice = card.cardmarket?.prices?.averageSellPrice;
                return (
                  <button
                    key={card.id}
                    onClick={() => !tracked && handleSelectCard(card)}
                    disabled={tracked}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${
                      tracked
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-white/5 cursor-pointer"
                    }`}
                  >
                    <div className="w-9 h-12 rounded-md overflow-hidden flex-shrink-0 relative bg-white/5">
                      <Image
                        src={card.images.small}
                        alt={card.name}
                        fill
                        className="object-cover"
                        sizes="36px"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{card.name}</p>
                      <p className="text-[10px] text-white/40">
                        <span className="font-mono">{card.number}</span> · {card.set.name}
                      </p>
                      <p className="text-[10px] text-white/25">{card.rarity ?? "—"}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {mktPrice ? (
                        <>
                          <p className="text-sm font-semibold text-gold">{mktPrice.toFixed(2)}€</p>
                          <p className="text-[10px] text-white/25">Cardmarket NM</p>
                        </>
                      ) : (
                        <p className="text-[10px] text-white/20">Prix N/D</p>
                      )}
                      {tracked && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 justify-end mt-0.5">
                          <Check className="w-3 h-3" /> Suivi
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Selected card */}
          {selectedCard && (
            <div className="space-y-4">
              {/* Card preview */}
              <div className="flex items-center gap-3 p-3 bg-gold/5 border border-gold/20 rounded-xl">
                <div className="w-12 h-16 rounded-md overflow-hidden flex-shrink-0 relative bg-white/5">
                  <Image
                    src={selectedCard.images.small}
                    alt={selectedCard.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gold">{selectedCard.name}</p>
                  <p className="text-[10px] text-white/50">
                    <span className="font-mono">{selectedCard.number}</span> · {selectedCard.set.name}
                  </p>
                  <p className="text-[10px] text-white/30">{selectedCard.rarity ?? "—"}</p>
                  {marketPrice && (
                    <p className="text-[10px] text-white/40 mt-0.5">
                      Cardmarket NM moyen : <span className="text-gold/70">{marketPrice.toFixed(2)}€</span>
                    </p>
                  )}
                </div>
                <button
                  onClick={() => { setSelectedCard(null); setError(null); }}
                  className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Condition */}
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
                  État de la carte
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {(["NM", "EX", "LP", "PO"] as CardCondition[]).map((cond) => (
                    <button
                      key={cond}
                      onClick={() => handleConditionChange(cond)}
                      className={`flex flex-col items-center gap-0.5 py-2.5 px-1 rounded-xl border transition-all ${
                        condition === cond
                          ? cond === "NM" ? "border-emerald-500/40 bg-emerald-500/5"
                          : cond === "EX" ? "border-blue-500/40 bg-blue-500/5"
                          : cond === "LP" ? "border-yellow-500/40 bg-yellow-500/5"
                          : "border-red-500/40 bg-red-500/5"
                          : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className={`text-sm font-bold ${condition === cond ? CONDITION_COLORS[cond] : "text-white/60"}`}>
                        {cond}
                      </span>
                      <span className="text-[9px] text-white/40 text-center leading-tight">
                        {CONDITION_LABELS[cond]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Langue de la carte */}
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
                  Langue de la carte physique
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {(["fr", "en", "jp", "kr", "de", "es", "pt", "it"] as CardLanguage[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl border transition-all text-xs ${
                        language === lang
                          ? "border-gold/40 bg-gold/5 text-gold"
                          : "border-white/5 bg-white/[0.02] text-white/40 hover:bg-white/[0.04] hover:text-white/60"
                      }`}
                    >
                      <span className="text-base leading-none">{LANGUAGE_FLAGS[lang]}</span>
                      <span className="text-[9px] leading-tight">{LANGUAGE_LABELS[lang].split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prix d'achat */}
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Euro className="w-3 h-3" />
                  Prix payé par vous <span className="text-white/20 normal-case">(ce que vous avez réellement dépensé)</span>
                </p>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ex: 45.00"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-base font-semibold text-white placeholder:text-white/20 focus:outline-none focus:border-gold/40 transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 font-semibold">€</span>
                </div>

                {/* Comparaison avec le prix de marché */}
                {marketPrice && !isNaN(parsedPurchase) && parsedPurchase > 0 && priceDiff !== null && (
                  <div className={`mt-2 flex items-center gap-2 text-[11px] rounded-lg px-3 py-2 ${
                    priceDiff <= -10 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : priceDiff <= 5 ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                  }`}>
                    <span className="font-semibold">
                      {priceDiff <= -10 ? "🎉 Bonne affaire !" : priceDiff <= 5 ? "✓ Prix du marché" : "⚠ Au-dessus du marché"}
                    </span>
                    <span className="text-white/40">·</span>
                    <span>
                      Vous payez {Math.abs(priceDiff).toFixed(1)}%{" "}
                      {priceDiff < 0 ? "en dessous" : "au-dessus"} du prix Cardmarket NM ({marketPrice.toFixed(2)}€)
                    </span>
                  </div>
                )}
              </div>

              {/* Quantité */}
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Package className="w-3 h-3" />
                  Quantité
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => String(Math.max(1, parseInt(q) - 1)))}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-colors font-bold"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-16 text-center py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-gold/40"
                  />
                  <button
                    onClick={() => setQuantity((q) => String(parseInt(q) + 1))}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-colors font-bold"
                  >
                    +
                  </button>
                  {parseInt(quantity) > 1 && !isNaN(parsedPurchase) && (
                    <span className="text-xs text-white/30">
                      = <span className="text-white/50">{(parsedPurchase * parseInt(quantity)).toFixed(2)}€</span> total
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex-shrink-0">
          <button
            onClick={handleAdd}
            disabled={!selectedCard || success || !purchasePrice || parseFloat(purchasePrice) <= 0}
            className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              success
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : selectedCard && purchasePrice && parseFloat(purchasePrice) > 0
                ? "bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25"
                : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
            }`}
          >
            {success ? (
              <><Check className="w-4 h-4" /> Ajouté au portfolio !</>
            ) : selectedCard ? (
              <>
                <Plus className="w-4 h-4" />
                {purchasePrice && parseFloat(purchasePrice) > 0
                  ? `Ajouter pour ${purchasePrice}€`
                  : "Entrez le prix payé"}
              </>
            ) : (
              <><Plus className="w-4 h-4" /> Sélectionnez une carte</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
