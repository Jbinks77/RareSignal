"use client";

import { useState, useCallback } from "react";
import {
  Plus, Trash2, TrendingUp, TrendingDown, Wallet,
  BarChart2, ArrowUpRight, ArrowDownRight, ExternalLink,
  Minus, RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { usePortfolio, type PortfolioEntry, LANGUAGE_FLAGS } from "@/lib/portfolio-context";
import {
  CONDITION_MULTIPLIERS,
  type CardCondition,
} from "@/lib/mock-data";
import { AddCardModal } from "@/components/add-card-modal";

// Multiplicateurs de langue (même logique que /api/cardmarket/price)
const LANGUAGE_MULTIPLIERS: Record<string, number> = {
  fr: 0.95, en: 1.00, de: 0.98, es: 0.92, it: 0.90, pt: 0.88, jp: 0.75, kr: 0.70,
};

// Calcule le meilleur prix disponible pour une entrée
function getBestPrice(entry: PortfolioEntry): { price: number | null; isLive: boolean } {
  if (entry.livePrice != null) {
    return { price: entry.livePrice, isLive: true };
  }
  const market = entry.card.marketPriceAtAdd;
  if (!market) return { price: null, isLive: false };
  const condMult = CONDITION_MULTIPLIERS[entry.condition] ?? 1.0;
  const langMult = LANGUAGE_MULTIPLIERS[entry.card.language] ?? 1.0;
  return { price: +(market * condMult * langMult).toFixed(2), isLive: false };
}

// Extrait le VRAI prix Cardmarket depuis les données pokemontcg.io
// Utilise les vrais champs Cardmarket par condition — pas des multiplicateurs génériques
function extractCardmarketPrice(
  cmPrices: Record<string, number | null>,
  condition: string,
  language: string
): number | null {
  const avg = cmPrices.averageSellPrice as number | null;      // Prix moyen NM vendu
  const trend = cmPrices.trendPrice as number | null;          // Prix tendance
  const low = cmPrices.lowPrice as number | null;              // Annonce la moins chère (toutes cond.)
  const lowExPlus = cmPrices.lowPriceExPlus as number | null;  // Annonce la moins chère EX+
  const avg30 = cmPrices.avg30 as number | null;               // Moyenne 30 jours

  // Référence NM — trendPrice est le prix Cardmarket spécifique aux cartes NM
  // averageSellPrice mélange toutes conditions donc on l'utilise en dernier recours
  const nmBase = trend ?? avg ?? avg30;
  if (!nmBase) return null;

  let condPrice: number;

  if (condition === "NM") {
    // averageSellPrice = prix moyen réel des ventes NM sur Cardmarket
    condPrice = nmBase;

  } else if (condition === "EX") {
    // lowPriceExPlus = vrai prix minimum annonce EX ou mieux sur Cardmarket
    if (lowExPlus && lowExPlus > 0) {
      // Moyenne entre le min réel EX+ et 80% NM (évite les outliers à 0.01€)
      condPrice = Math.min((lowExPlus + nmBase * 0.80) / 2, nmBase * 0.85);
    } else {
      condPrice = nmBase * 0.75;
    }

  } else if (condition === "LP") {
    // lowPrice = vrai prix le plus bas Cardmarket (souvent cartes LP ou GD)
    if (low && low > 0 && low < nmBase * 0.70) {
      condPrice = low; // Prix de marché réel pour cartes jouées
    } else {
      condPrice = nmBase * 0.50;
    }

  } else { // PO
    // Les PO se vendent toujours sous le lowPrice affiché
    if (low && low > 0) {
      condPrice = low * 0.50;
    } else {
      condPrice = nmBase * 0.20;
    }
  }

  // Multiplicateur de langue (pokemontcg.io agrège toutes les langues)
  const langMult = LANGUAGE_MULTIPLIERS[language] ?? 1.0;
  return +(condPrice * langMult).toFixed(2);
}

// Calcule le prix depuis le prix de référence stocké lors de l'ajout (fallback)
function computeLocalPrice(entry: PortfolioEntry): number | null {
  const market = entry.card.marketPriceAtAdd;
  if (!market) return null;
  const condMult = CONDITION_MULTIPLIERS[entry.condition] ?? 1.0;
  const langMult = LANGUAGE_MULTIPLIERS[entry.card.language] ?? 1.0;
  return +(market * condMult * langMult).toFixed(2);
}

export default function PortfolioPage() {
  const { entries, removeCard, updateCondition, updateQuantity, updateLivePrice, loaded } = usePortfolio();
  const [modalOpen, setModalOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  // Récupère les vrais prix Cardmarket depuis pokemontcg.io
  const fetchLivePrices = useCallback(async () => {
    if (entries.length === 0 || refreshing) return;
    setRefreshing(true);
    setRefreshError(null);

    let liveCount = 0;
    let localCount = 0;

    await Promise.allSettled(
      entries.map(async (entry) => {
        // Stratégie 1 : appel DIRECT depuis le navigateur à pokemontcg.io
        // (le navigateur n'a pas les restrictions réseau du serveur Node.js)
        try {
          const res = await fetch(
            `https://api.pokemontcg.io/v2/cards/${encodeURIComponent(entry.card.apiId)}`,
            { headers: { Accept: "application/json" } }
          );
          if (res.ok) {
            const { data } = await res.json();
            const cmPrices = data?.cardmarket?.prices;
            if (cmPrices) {
              const price = extractCardmarketPrice(cmPrices, entry.condition, entry.card.language);
              if (price !== null) {
                updateLivePrice(entry.id, price);
                liveCount++;
                return;
              }
            }
          }
        } catch {
          // pokemontcg.io inaccessible depuis le navigateur, essayer le proxy serveur
        }

        // Stratégie 2 : via le proxy Next.js (/api/cardmarket/price)
        // (fonctionne en production sur Vercel où le réseau n'est pas limité)
        try {
          const params = new URLSearchParams({
            cardId: entry.card.apiId,
            condition: entry.condition,
            language: entry.card.language,
          });
          const res = await fetch(`/api/cardmarket/price?${params}`);
          if (res.ok) {
            const data = await res.json();
            if (data.price !== null && data.price !== undefined) {
              updateLivePrice(entry.id, data.price);
              liveCount++;
              return;
            }
          }
        } catch {
          // proxy aussi bloqué
        }

        // Stratégie 3 : calcul local depuis le prix de référence stocké lors de l'ajout
        const local = computeLocalPrice(entry);
        if (local !== null) {
          updateLivePrice(entry.id, local);
          localCount++;
        }
      })
    );

    if (liveCount === 0 && localCount === 0) {
      setRefreshError("Aucune donnée de prix disponible. Ajoutez vos cartes via la recherche pour obtenir les prix Cardmarket.");
    } else if (liveCount > 0) {
      setRefreshError(null);
      setLastRefresh(new Date());
    } else {
      setRefreshError(`Prix Cardmarket indisponibles (réseau) — ${localCount} carte${localCount > 1 ? "s" : ""} calculée${localCount > 1 ? "s" : ""} depuis vos données de référence.`);
      setLastRefresh(new Date());
    }
    setRefreshing(false);
  }, [entries, refreshing, updateLivePrice]);

  // Calcul stats globales
  const enriched = entries.map((entry) => {
    const { price: currentPrice, isLive } = getBestPrice(entry);
    const totalPaid = entry.purchasePrice * entry.quantity;
    const totalCurrent = currentPrice ? currentPrice * entry.quantity : null;
    const gain = totalCurrent != null ? totalCurrent - totalPaid : null;
    const gainPct = totalCurrent != null && totalPaid > 0
      ? ((totalCurrent - totalPaid) / totalPaid) * 100
      : null;
    return { entry, currentPrice, isLive, totalPaid, totalCurrent, gain, gainPct };
  });

  const totalInvested = enriched.reduce((s, e) => s + e.totalPaid, 0);
  const totalCurrentKnown = enriched.filter((e) => e.totalCurrent != null).reduce((s, e) => s + (e.totalCurrent ?? 0), 0);
  const totalGain = enriched.filter((e) => e.gain != null).reduce((s, e) => s + (e.gain ?? 0), 0);
  const totalGainPct = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;
  const withPriceCount = enriched.filter((e) => e.currentPrice != null).length;
  const liveCount = enriched.filter((e) => e.isLive).length;

  function handleRemove(id: string) {
    setRemovingId(id);
    setTimeout(() => { removeCard(id); setRemovingId(null); }, 300);
  }

  function formatLastRefresh(): string {
    if (!lastRefresh) return "Jamais actualisé";
    const diffMs = Date.now() - lastRefresh.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin === 0) return "À l'instant";
    if (diffMin === 1) return "Il y a 1 min";
    return `Il y a ${diffMin} min`;
  }

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mon Portfolio</h1>
          <p className="text-sm text-white/40 mt-1">
            Suivez vos achats et l&apos;évolution de la valeur de votre collection
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {entries.length > 0 && (
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={fetchLivePrices}
                disabled={refreshing}
                className="flex items-center gap-2 px-3 py-2 bg-white/[0.04] border border-white/10 text-white/60 text-xs font-medium rounded-xl hover:bg-white/[0.07] hover:text-white/80 transition-all disabled:opacity-40"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Actualisation..." : "Actualiser les prix"}
              </button>
              <span className="text-[10px] text-white/25 text-right">
                {liveCount > 0 && `${liveCount}/${entries.length} prix live · `}
                {formatLastRefresh()}
              </span>
            </div>
          )}
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gold/10 border border-gold/20 text-gold text-sm font-medium rounded-xl hover:bg-gold/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Error */}
      {refreshError && (
        <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          {refreshError} — Les prix affichés sont des estimations basées sur vos données d&apos;ajout.
        </div>
      )}

      {/* Stats */}
      {enriched.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-white/40" />
              <span className="text-[11px] text-white/40 uppercase tracking-wider">Total investi</span>
            </div>
            <p className="text-2xl font-bold">{totalInvested.toFixed(2)}€</p>
            <p className="text-[10px] text-white/25 mt-0.5">Prix d&apos;achat réel</p>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-gold" />
              <span className="text-[11px] text-white/40 uppercase tracking-wider">Valeur estimée</span>
            </div>
            <p className="text-2xl font-bold text-gold">
              {withPriceCount > 0 ? `${totalCurrentKnown.toFixed(2)}€` : "—"}
            </p>
            <p className="text-[10px] text-white/25 mt-0.5">
              {liveCount > 0 ? `${liveCount} prix live · ` : ""}{withPriceCount}/{entries.length} cartes
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              {totalGain >= 0
                ? <TrendingUp className="w-4 h-4 text-emerald-400" />
                : <TrendingDown className="w-4 h-4 text-red-400" />}
              <span className="text-[11px] text-white/40 uppercase tracking-wider">Gain / Perte</span>
            </div>
            <p className={`text-2xl font-bold ${withPriceCount === 0 ? "text-white/20" : totalGain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {withPriceCount === 0 ? "—" : `${totalGain >= 0 ? "+" : ""}${totalGain.toFixed(2)}€`}
            </p>
            {withPriceCount > 0 && (
              <p className={`text-[10px] mt-0.5 ${totalGainPct >= 0 ? "text-emerald-400/60" : "text-red-400/60"}`}>
                {totalGainPct >= 0 ? "+" : ""}{totalGainPct.toFixed(1)}% sur investissement
              </p>
            )}
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 className="w-4 h-4 text-violet" />
              <span className="text-[11px] text-white/40 uppercase tracking-wider">Collection</span>
            </div>
            <p className="text-2xl font-bold">{entries.reduce((s, e) => s + e.quantity, 0)}</p>
            <p className="text-[10px] text-white/25 mt-0.5">
              {entries.length} titre{entries.length > 1 ? "s" : ""} différent{entries.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}

      {/* Tableau */}
      {enriched.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mb-6">
            <BarChart2 className="w-10 h-10 text-white/10" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Votre portfolio est vide</h2>
          <p className="text-sm text-white/40 mb-6 max-w-sm">
            Ajoutez vos cartes avec le prix que vous les avez payées. Nous calculerons automatiquement votre gain ou perte.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gold/10 border border-gold/20 text-gold text-sm font-medium rounded-xl hover:bg-gold/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Ajouter ma première carte
          </button>
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-[11px] text-white/40 uppercase tracking-wider">
                  <th className="text-left py-3 px-4">Carte</th>
                  <th className="text-center py-3 px-4">Langue</th>
                  <th className="text-center py-3 px-4">État</th>
                  <th className="text-center py-3 px-4">Qté</th>
                  <th className="text-right py-3 px-4">Prix payé</th>
                  <th className="text-right py-3 px-4">Valeur actuelle</th>
                  <th className="text-right py-3 px-4">Gain / Perte</th>
                  <th className="text-right py-3 px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {enriched.map(({ entry, currentPrice, isLive, totalPaid, totalCurrent, gain, gainPct }) => (
                  <tr
                    key={entry.id}
                    className={`transition-all duration-300 ${
                      removingId === entry.id ? "opacity-0 translate-x-2" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* Carte */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-12 rounded-md overflow-hidden flex-shrink-0 relative bg-white/5">
                          <Image
                            src={entry.card.imageUrl}
                            alt={entry.card.name}
                            fill
                            className="object-cover"
                            sizes="36px"
                            unoptimized
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 group">
                            <p className="text-sm font-medium">{entry.card.name}</p>
                            <ExternalLink className="w-3 h-3 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-[10px] text-white/40 font-mono">
                            {entry.card.number} · {entry.card.set}
                          </p>
                          <p className="text-[9px] text-white/25">
                            {entry.card.rarity ?? "—"} · ajouté le{" "}
                            {new Date(entry.addedAt).toLocaleDateString("fr-FR", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Langue */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex flex-col items-center gap-0.5">
                        <span className="text-lg leading-none">{LANGUAGE_FLAGS[entry.card.language] ?? "🌐"}</span>
                        <span className="text-[9px] text-white/30 uppercase">{entry.card.language}</span>
                      </div>
                    </td>

                    {/* État */}
                    <td className="py-3 px-4 text-center">
                      <select
                        value={entry.condition}
                        onChange={(e) => updateCondition(entry.id, e.target.value as CardCondition)}
                        className={`text-[11px] font-semibold px-2 py-1 rounded-full border bg-transparent cursor-pointer appearance-none text-center ${
                          entry.condition === "NM" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
                          : entry.condition === "EX" ? "border-blue-500/30 text-blue-400 bg-blue-500/5"
                          : entry.condition === "LP" ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/5"
                          : "border-red-500/30 text-red-400 bg-red-500/5"
                        }`}
                      >
                        {(["NM", "EX", "LP", "PO"] as CardCondition[]).map((c) => (
                          <option key={c} value={c} className="bg-[#12121A] text-white">{c}</option>
                        ))}
                      </select>
                    </td>

                    {/* Quantité */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => updateQuantity(entry.id, entry.quantity - 1)}
                          className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3 text-white/40" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{entry.quantity}</span>
                        <button
                          onClick={() => updateQuantity(entry.id, entry.quantity + 1)}
                          className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3 text-white/40" />
                        </button>
                      </div>
                    </td>

                    {/* Prix payé */}
                    <td className="py-3 px-4 text-right">
                      <p className="text-sm font-semibold">{entry.purchasePrice.toFixed(2)}€</p>
                      {entry.quantity > 1 && (
                        <p className="text-[10px] text-white/25">{totalPaid.toFixed(2)}€ total</p>
                      )}
                    </td>

                    {/* Valeur actuelle */}
                    <td className="py-3 px-4 text-right">
                      {currentPrice != null ? (
                        <>
                          <p className="text-sm font-semibold text-gold">{currentPrice.toFixed(2)}€</p>
                          {entry.quantity > 1 && (
                            <p className="text-[10px] text-white/25">{(currentPrice * entry.quantity).toFixed(2)}€ total</p>
                          )}
                          <p className="text-[9px] text-white/20">
                            {isLive ? (
                              <span className="text-emerald-400/60">● Live Cardmarket</span>
                            ) : (
                              "Estimé · Cardmarket"
                            )}
                          </p>
                        </>
                      ) : (
                        <span className="text-xs text-white/20">— non dispo</span>
                      )}
                    </td>

                    {/* Gain/Perte */}
                    <td className="py-3 px-4 text-right">
                      {gain != null && gainPct != null ? (
                        <div className={`${gain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          <div className="flex items-center justify-end gap-0.5">
                            {gain >= 0
                              ? <ArrowUpRight className="w-3.5 h-3.5" />
                              : <ArrowDownRight className="w-3.5 h-3.5" />}
                            <span className="text-sm font-semibold">
                              {gain >= 0 ? "+" : ""}{gain.toFixed(2)}€
                            </span>
                          </div>
                          <p className="text-[10px] opacity-60">
                            {gainPct >= 0 ? "+" : ""}{gainPct.toFixed(1)}%
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-white/20">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleRemove(entry.id)}
                        className="w-7 h-7 rounded-lg bg-white/[0.03] hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 flex items-center justify-center transition-all group"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-white/20 group-hover:text-red-400 transition-colors" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* Total footer */}
              {enriched.length > 1 && (
                <tfoot>
                  <tr className="border-t border-white/10 bg-white/[0.02] text-sm">
                    <td colSpan={4} className="py-3 px-4 text-white/40 text-xs font-medium">
                      TOTAL ({entries.reduce((s, e) => s + e.quantity, 0)} cartes)
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">{totalInvested.toFixed(2)}€</td>
                    <td className="py-3 px-4 text-right font-semibold text-gold">
                      {withPriceCount > 0 ? `${totalCurrentKnown.toFixed(2)}€` : "—"}
                    </td>
                    <td className={`py-3 px-4 text-right font-semibold ${withPriceCount === 0 ? "text-white/20" : totalGain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {withPriceCount === 0 ? "—" : `${totalGain >= 0 ? "+" : ""}${totalGain.toFixed(2)}€`}
                    </td>
                    <td className="py-3 px-4"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {/* Info Cardmarket */}
      {enriched.length > 0 && (
        <p className="text-[10px] text-white/20 text-center">
          Prix Cardmarket · {LANGUAGE_FLAGS.fr} cartes françaises = ~95% du prix moyen international · {LANGUAGE_FLAGS.jp} japonaises = ~75% · Condition appliquée : NM×1.0, EX×0.75, LP×0.55, PO×0.30
        </p>
      )}

      <AddCardModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdded={() => setModalOpen(false)}
      />
    </div>
  );
}
