"use client";

import { useState } from "react";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, TrendingUp, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { mockCards, mockPriceHistories, type CardCondition, CONDITION_LABELS, CONDITION_COLORS, CONDITION_MULTIPLIERS, getPriceForCondition } from "@/lib/mock-data";
import { PriceChart } from "@/components/price-chart";

export default function CardDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const card = mockCards.find((c) => c.id === id);
  const priceHistory = mockPriceHistories[id];
  const [selectedCondition, setSelectedCondition] = useState<CardCondition>(card?.condition || "NM");

  if (!card) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-white/40">Carte non trouvée</p>
      </div>
    );
  }

  // Prix ajustés selon la condition sélectionnée
  const priceCM = getPriceForCondition(card.priceCardmarket, selectedCondition);
  const priceEB = getPriceForCondition(card.priceEbay, selectedCondition);
  const priceVI = getPriceForCondition(card.priceVinted, selectedCondition);

  const vintedFees = priceVI * 0.15 + 3;
  const netMargin = priceCM - priceVI - vintedFees;
  const netMarginPct = (netMargin / priceVI) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back link */}
      <Link
        href="/cards"
        className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux cartes
      </Link>

      {/* Card header */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Card image placeholder */}
        <div className="w-48 h-64 rounded-xl bg-gradient-to-br from-violet/20 to-gold/20 overflow-hidden flex-shrink-0 border border-white/5 relative">
          <Image src={card.imageUrl} alt={card.name} fill className="object-cover" sizes="192px" priority />
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{card.name}</h1>
            <p className="text-sm text-white/50 font-mono mt-1">{card.cardNumber}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet/10 text-violet">
                {card.set}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/50">
                {card.rarity}
              </span>
            </div>
          </div>

          {/* CONDITION SELECTOR — prominent */}
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">
              État de la carte <span className="text-white/20">(le prix varie considérablement)</span>
            </p>
            <div className="grid grid-cols-4 gap-2">
              {(["NM", "EX", "LP", "PO"] as CardCondition[]).map((cond) => {
                const isActive = selectedCondition === cond;
                const mult = CONDITION_MULTIPLIERS[cond];
                return (
                  <button
                    key={cond}
                    onClick={() => setSelectedCondition(cond)}
                    className={`relative flex flex-col items-center gap-1 py-3 px-2 rounded-xl border transition-all ${
                      isActive
                        ? cond === "NM" ? "border-emerald-500/40 bg-emerald-500/5"
                        : cond === "EX" ? "border-blue-500/40 bg-blue-500/5"
                        : cond === "LP" ? "border-yellow-500/40 bg-yellow-500/5"
                        : "border-red-500/40 bg-red-500/5"
                        : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className={`text-sm font-bold ${isActive ? CONDITION_COLORS[cond] : "text-white/60"}`}>
                      {cond}
                    </span>
                    <span className="text-[10px] text-white/40">{CONDITION_LABELS[cond]}</span>
                    <span className={`text-[10px] font-mono ${
                      mult === 1 ? "text-emerald-400" : "text-white/30"
                    }`}>
                      {mult === 1 ? "100%" : `${Math.round(mult * 100)}%`}
                    </span>
                    {isActive && (
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                        cond === "NM" ? "bg-emerald-400" : cond === "EX" ? "bg-blue-400" : cond === "LP" ? "bg-yellow-400" : "bg-red-400"
                      }`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prices adjusted to condition */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Cardmarket</p>
              <p className="text-xl font-bold text-gold">{priceCM.toFixed(2)}€</p>
              {selectedCondition !== "NM" && (
                <p className="text-[10px] text-white/25 line-through">{card.priceCardmarket.toFixed(2)}€ NM</p>
              )}
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">eBay</p>
              <p className="text-xl font-bold text-violet">{priceEB.toFixed(2)}€</p>
              {selectedCondition !== "NM" && (
                <p className="text-[10px] text-white/25 line-through">{card.priceEbay.toFixed(2)}€ NM</p>
              )}
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Vinted</p>
              <p className="text-xl font-bold text-emerald-400">{priceVI.toFixed(2)}€</p>
              {selectedCondition !== "NM" && (
                <p className="text-[10px] text-white/25 line-through">{card.priceVinted.toFixed(2)}€ NM</p>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[10px] text-white/40">Variation 7j</p>
              <p className={`text-sm font-semibold flex items-center gap-1 ${card.variation7d >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {card.variation7d >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {card.variation7d >= 0 ? "+" : ""}{card.variation7d}%
              </p>
            </div>
            <div>
              <p className="text-[10px] text-white/40">Variation 30j</p>
              <p className={`text-sm font-semibold flex items-center gap-1 ${card.variation30d >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {card.variation30d >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {card.variation30d >= 0 ? "+" : ""}{card.variation30d}%
              </p>
            </div>
            <div>
              <p className="text-[10px] text-white/40">Volume ventes</p>
              <p className="text-sm font-semibold">{card.volume}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/40">Score</p>
              <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${
                card.score >= 90 ? "bg-gold/15 text-gold" : card.score >= 75 ? "bg-violet/15 text-violet" : "bg-white/5 text-white/60"
              }`}>
                {card.score}/100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Price chart */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">Historique des prix</h2>
          <span className="text-[10px] text-white/30 bg-white/5 px-2 py-1 rounded">
            Prix affichés en NM — condition {selectedCondition} = ×{CONDITION_MULTIPLIERS[selectedCondition]}
          </span>
        </div>
        {priceHistory ? (
          <PriceChart data={priceHistory} />
        ) : (
          <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-white/10 mx-auto mb-2" />
              <p className="text-xs text-white/30">Données historiques non disponibles pour cette carte</p>
            </div>
          </div>
        )}
      </div>

      {/* Arbitrage widget */}
      <div className={`bg-white/[0.03] border rounded-xl p-6 ${
        netMarginPct > 20 ? "border-emerald-500/20" : netMarginPct > 10 ? "border-yellow-500/20" : "border-white/[0.06]"
      }`}>
        <h2 className="text-sm font-semibold mb-1 flex items-center gap-2">
          Opportunité d&apos;arbitrage
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${CONDITION_COLORS[selectedCondition].replace("text-", "bg-").replace("400", "500/10")} ${CONDITION_COLORS[selectedCondition]}`}>
            Condition {selectedCondition}
          </span>
          {netMarginPct > 20 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">Excellente</span>}
          {netMarginPct > 10 && netMarginPct <= 20 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400">Bonne</span>}
        </h2>
        <p className="text-[10px] text-white/30 mb-4">Acheter sur Vinted → Revendre sur Cardmarket (même condition {selectedCondition})</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Prix Vinted</p>
            <p className="text-lg font-bold text-emerald-400">{priceVI.toFixed(2)}€</p>
          </div>
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Prix Cardmarket</p>
            <p className="text-lg font-bold text-gold">{priceCM.toFixed(2)}€</p>
          </div>
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Frais (15% + port)</p>
            <p className="text-lg font-bold text-white/50">{vintedFees.toFixed(2)}€</p>
          </div>
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Marge nette</p>
            <p className={`text-lg font-bold ${
              netMarginPct > 20 ? "text-emerald-400" : netMarginPct > 10 ? "text-yellow-400" : "text-white/40"
            }`}>
              {netMargin.toFixed(2)}€ ({netMarginPct.toFixed(1)}%)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
