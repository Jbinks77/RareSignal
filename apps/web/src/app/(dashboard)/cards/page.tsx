"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { mockCards, pokemonSets, type CardCondition, CONDITION_LABELS, CONDITION_COLORS, getPriceForCondition } from "@/lib/mock-data";
import Link from "next/link";
import Image from "next/image";

export default function CardsPage() {
  const [search, setSearch] = useState("");
  const [selectedSet, setSelectedSet] = useState<string>("all");
  const [selectedCondition, setSelectedCondition] = useState<CardCondition | "all">("all");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [maxBudget, setMaxBudget] = useState<string>("");
  const [sortBy, setSortBy] = useState<"score" | "price" | "variation">("score");

  const filteredCards = useMemo(() => {
    let cards = [...mockCards];

    if (search) {
      const q = search.toLowerCase();
      cards = cards.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.cardNumber.toLowerCase().includes(q) ||
          c.set.toLowerCase().includes(q)
      );
    }
    if (selectedSet !== "all") {
      cards = cards.filter((c) => c.set === selectedSet);
    }
    if (selectedCondition !== "all") {
      cards = cards.filter((c) => c.condition === selectedCondition);
    }
    if (selectedRarity !== "all") {
      cards = cards.filter((c) => c.rarity === selectedRarity);
    }
    if (maxBudget) {
      cards = cards.filter((c) => c.priceCardmarket <= parseFloat(maxBudget));
    }

    cards.sort((a, b) => {
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "price") return b.priceCardmarket - a.priceCardmarket;
      return b.variation7d - a.variation7d;
    });

    return cards;
  }, [search, selectedSet, selectedCondition, selectedRarity, maxBudget, sortBy]);

  const conditions: CardCondition[] = ["NM", "EX", "LP", "PO"];
  const rarities = ["Common", "Uncommon", "Rare", "Ultra Rare", "Secret Rare", "Illustration Rare"];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Analyse des prix</h1>
        <p className="text-sm text-white/40 mt-1">
          Classement des cartes par score d&apos;opportunité — prix ajustés selon la condition
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Nom, numéro (ex: 215/247)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/40 transition-colors"
          />
        </div>
        <select
          value={selectedSet}
          onChange={(e) => setSelectedSet(e.target.value)}
          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70 focus:outline-none focus:border-gold/40 appearance-none cursor-pointer"
        >
          <option value="all">Tous les sets</option>
          {pokemonSets.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={selectedCondition}
          onChange={(e) => setSelectedCondition(e.target.value as CardCondition | "all")}
          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70 focus:outline-none focus:border-gold/40 appearance-none cursor-pointer"
        >
          <option value="all">Tout état</option>
          {conditions.map((c) => (
            <option key={c} value={c}>{c} — {CONDITION_LABELS[c]}</option>
          ))}
        </select>
        <select
          value={selectedRarity}
          onChange={(e) => setSelectedRarity(e.target.value)}
          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70 focus:outline-none focus:border-gold/40 appearance-none cursor-pointer"
        >
          <option value="all">Toute rareté</option>
          {rarities.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Budget max €"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
          className="w-32 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/40 transition-colors"
        />
      </div>

      {/* Condition price info banner */}
      {selectedCondition !== "all" && selectedCondition !== "NM" && (
        <div className="bg-white/[0.02] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white/50 flex items-center gap-2">
          <span className={`font-semibold ${CONDITION_COLORS[selectedCondition]}`}>{selectedCondition}</span>
          <span>—</span>
          <span>Les prix affichés sont les prix <strong className="text-white/70">NM (référence)</strong>. Pour la condition {CONDITION_LABELS[selectedCondition]}, comptez environ <strong className="text-white/70">{Math.round((1 - ({"EX": 0.75, "LP": 0.55, "PO": 0.30} as any)[selectedCondition]) * 100)}% de moins</strong>.</span>
        </div>
      )}

      {/* Sort bar */}
      <div className="flex items-center gap-2 text-xs text-white/40">
        <span>Trier par :</span>
        {(["score", "price", "variation"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className={`px-3 py-1 rounded-full transition-colors ${
              sortBy === s ? "bg-gold/15 text-gold" : "hover:bg-white/5"
            }`}
          >
            {s === "score" ? "Score" : s === "price" ? "Prix" : "Variation 7j"}
          </button>
        ))}
        <span className="ml-auto">{filteredCards.length} cartes</span>
      </div>

      {/* Cards table */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-xs text-white/40 uppercase tracking-wider">
                <th className="text-left py-3 px-4 w-8">#</th>
                <th className="text-left py-3 px-4">Carte</th>
                <th className="text-left py-3 px-4">Set</th>
                <th className="text-center py-3 px-4">État</th>
                <th className="text-right py-3 px-4">Cardmarket</th>
                <th className="text-right py-3 px-4">eBay</th>
                <th className="text-right py-3 px-4">Vinted</th>
                <th className="text-right py-3 px-4">7j</th>
                <th className="text-center py-3 px-4">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCards.map((card, i) => {
                const condition = selectedCondition !== "all" ? selectedCondition : card.condition;
                const priceCM = getPriceForCondition(card.priceCardmarket, condition);
                const priceEB = getPriceForCondition(card.priceEbay, condition);
                const priceVI = getPriceForCondition(card.priceVinted, condition);

                return (
                  <tr
                    key={card.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-3 px-4 text-xs text-white/30">{i + 1}</td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/cards/${card.id}`}
                        className="flex items-center gap-3"
                      >
                        <div className="w-8 h-11 rounded bg-gradient-to-br from-violet/20 to-gold/20 overflow-hidden flex-shrink-0 relative">
                          <Image src={card.imageUrl} alt={card.name} fill className="object-cover" sizes="32px" />
                        </div>
                        <div>
                          <p className="text-sm font-medium group-hover:text-gold transition-colors">
                            {card.name}
                          </p>
                          <p className="text-[10px] text-white/40 font-mono">
                            {card.cardNumber} · <span className="text-white/25">{card.rarity}</span>
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-xs text-white/50">{card.set}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          condition === "NM"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : condition === "EX"
                            ? "bg-blue-500/10 text-blue-400"
                            : condition === "LP"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {condition}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-medium text-gold">
                      {priceCM.toFixed(2)}€
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-violet">
                      {priceEB.toFixed(2)}€
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-emerald-400">
                      {priceVI.toFixed(2)}€
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                          card.variation7d >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {card.variation7d >= 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {card.variation7d >= 0 ? "+" : ""}
                        {card.variation7d}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block w-10 py-1 rounded-md text-xs font-bold ${
                          card.score >= 90
                            ? "bg-gold/15 text-gold"
                            : card.score >= 75
                            ? "bg-violet/15 text-violet"
                            : card.score >= 50
                            ? "bg-white/5 text-white/60"
                            : "bg-white/5 text-white/30"
                        }`}
                      >
                        {card.score}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
