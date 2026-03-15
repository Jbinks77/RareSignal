"use client";

import {
  CreditCard,
  Bell,
  TrendingUp,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  Plus,
} from "lucide-react";
import { mockCards, mockStats, mockNotifications, CONDITION_MULTIPLIERS } from "@/lib/mock-data";
import { usePortfolio } from "@/lib/portfolio-context";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const ParticlesBackground = dynamic(
  () => import("@/components/particles-background").then((m) => m.ParticlesBackground),
  { ssr: false }
);

const statCards = [
  { label: "Cartes suivies", value: mockStats.trackedCards, icon: CreditCard, color: "gold" },
  { label: "Alertes actives", value: mockStats.activeAlerts, icon: Bell, color: "violet" },
  { label: "Opportunités", value: mockStats.opportunitiesToday, icon: Zap, color: "emerald" },
  { label: "Tendance marché", value: `+${mockStats.marketTrend}%`, icon: TrendingUp, color: "gold" },
];

export default function DashboardPage() {
  const topCards = [...mockCards].sort((a, b) => b.score - a.score).slice(0, 5);
  const { entries, loaded } = usePortfolio();

  // Stats portfolio calculées côté client (nouvelle structure avec purchasePrice)
  const portfolioEnriched = entries.map((entry) => {
    const market = entry.card.marketPriceAtAdd;
    const currentPrice = market ? +(market * CONDITION_MULTIPLIERS[entry.condition]).toFixed(2) : null;
    return { entry, currentPrice };
  });

  const portfolioInvested = portfolioEnriched.reduce((s, e) => s + e.entry.purchasePrice * e.entry.quantity, 0);
  const portfolioValue = portfolioEnriched.filter(e => e.currentPrice != null).reduce((s, e) => s + (e.currentPrice ?? 0) * e.entry.quantity, 0);
  const portfolioGain = portfolioValue - portfolioInvested;

  return (
    <div className="space-y-6 animate-fade-in relative">
      <ParticlesBackground />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Bonjour, <span className="text-gold">Trader</span>
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Voici votre résumé du marché Pokémon
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:border-white/10 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/40 uppercase tracking-wider">
                {stat.label}
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  stat.color === "gold"
                    ? "bg-gold/10"
                    : stat.color === "violet"
                    ? "bg-violet/10"
                    : "bg-emerald-500/10"
                }`}
              >
                <stat.icon
                  className={`w-4 h-4 ${
                    stat.color === "gold"
                      ? "text-gold"
                      : stat.color === "violet"
                      ? "text-violet"
                      : "text-emerald-400"
                  }`}
                />
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top cards trending */}
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Top cartes en hausse</h2>
            <Link href="/cards" className="text-xs text-gold hover:text-gold-light transition-colors">
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {topCards.map((card, i) => (
              <Link
                key={card.id}
                href={`/cards/${card.id}`}
                className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-xs text-white/30 w-4">#{i + 1}</span>
                <div className="w-10 h-14 rounded-md bg-gradient-to-br from-violet/20 to-gold/20 overflow-hidden flex-shrink-0 relative">
                  <Image src={card.imageUrl} alt={card.name} fill className="object-cover" sizes="40px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{card.name}</p>
                  <p className="text-xs text-white/40">
                    <span className="font-mono text-white/50">{card.cardNumber}</span> · {card.set}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{card.priceCardmarket.toFixed(2)}€</p>
                  <div
                    className={`flex items-center justify-end gap-0.5 text-xs ${
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
                  </div>
                </div>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                    card.score >= 90
                      ? "bg-gold/15 text-gold"
                      : card.score >= 75
                      ? "bg-violet/15 text-violet"
                      : "bg-white/5 text-white/50"
                  }`}
                >
                  {card.score}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent alerts */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Dernières alertes</h2>
            <Link href="/alerts" className="text-xs text-gold hover:text-gold-light transition-colors">
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {mockNotifications.slice(0, 5).map((notif) => (
              <div
                key={notif.id}
                className="p-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start gap-2">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      notif.type === "alert"
                        ? "bg-gold"
                        : notif.type === "preorder"
                        ? "bg-violet"
                        : "bg-white/30"
                    }`}
                  />
                  <div>
                    <p className="text-xs font-medium">{notif.title}</p>
                    <p className="text-xs text-white/40 mt-0.5">{notif.message}</p>
                    <p className="text-[10px] text-white/25 mt-1">
                      {new Date(notif.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio widget */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gold" />
            <h2 className="text-sm font-semibold">Mon Portfolio</h2>
            {loaded && entries.length > 0 && (
              <span className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                {entries.length} carte{entries.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <Link href="/portfolio" className="text-xs text-gold hover:text-gold-light transition-colors">
            Voir tout
          </Link>
        </div>

        {!loaded ? (
          <div className="p-6 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-white/30 mb-3">Aucune carte suivie pour l&apos;instant</p>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1.5 text-xs text-gold border border-gold/20 px-3 py-1.5 rounded-lg hover:bg-gold/10 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Ajouter mes premières cartes
            </Link>
          </div>
        ) : (
          <div>
            {/* Résumé valeur */}
            <div className="grid grid-cols-3 divide-x divide-white/5 border-b border-white/5">
              <div className="px-4 py-3">
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Investi</p>
                <p className="text-lg font-bold">{portfolioInvested.toFixed(2)}€</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Gain / Perte</p>
                <p className={`text-lg font-bold ${portfolioGain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {portfolioGain >= 0 ? "+" : ""}{portfolioGain.toFixed(2)}€
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Cartes</p>
                <p className="text-lg font-bold">{entries.length}</p>
              </div>
            </div>

            {/* Top 3 cartes */}
            <div className="divide-y divide-white/5">
              {portfolioEnriched.slice(0, 3).map(({ entry, currentPrice }) => {
                const gain = currentPrice != null ? currentPrice - entry.purchasePrice : null;
                const gainPct = gain != null && entry.purchasePrice > 0 ? (gain / entry.purchasePrice) * 100 : null;
                return (
                  <Link
                    key={entry.id}
                    href="/portfolio"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="w-7 h-10 rounded overflow-hidden flex-shrink-0 relative bg-white/5">
                      <Image src={entry.card.imageUrl} alt={entry.card.name} fill className="object-cover" sizes="28px" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{entry.card.name}</p>
                      <p className="text-[10px] text-white/40 font-mono">{entry.card.number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-gold">
                        {currentPrice != null ? `${currentPrice.toFixed(2)}€` : `${entry.purchasePrice.toFixed(2)}€`}
                      </p>
                      {gainPct != null && (
                        <p className={`text-[10px] flex items-center justify-end gap-0.5 ${gain! >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {gain! >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {gainPct >= 0 ? "+" : ""}{gainPct.toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
