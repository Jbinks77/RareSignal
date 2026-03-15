"use client";

import { useState } from "react";
import {
  Bell,
  Plus,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  ArrowLeftRight,
  X,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { mockAlerts } from "@/lib/mock-data";

const typeConfig = {
  price_spike: { label: "Hausse de prix", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  price_drop: { label: "Baisse de prix", icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10" },
  new_listing: { label: "Nouveau listing", icon: ShoppingBag, color: "text-blue-400", bg: "bg-blue-500/10" },
  arbitrage: { label: "Arbitrage", icon: ArrowLeftRight, color: "text-gold", bg: "bg-gold/10" },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [showModal, setShowModal] = useState(false);

  const toggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes alertes</h1>
          <p className="text-sm text-white/40 mt-1">
            {alerts.filter((a) => a.active).length} alertes actives
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold/10 text-gold rounded-lg text-sm font-medium hover:bg-gold/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle alerte
        </button>
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {alerts.map((alert) => {
          const config = typeConfig[alert.type];
          return (
            <div
              key={alert.id}
              className={`bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:border-white/10 transition-all ${
                !alert.active ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
                  <config.icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{alert.cardName}</p>
                    <span className="text-[10px] text-white/40 font-mono">{alert.cardNumber}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">{alert.condition}</p>
                </div>
                <div className="text-right mr-4">
                  {alert.triggeredAt ? (
                    <div>
                      <p className="text-[10px] text-white/30">Déclenchée</p>
                      <p className="text-xs text-gold">
                        {new Date(alert.triggeredAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-white/20">En attente</p>
                  )}
                </div>
                <button
                  onClick={() => toggleAlert(alert.id)}
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors"
                >
                  {alert.active ? (
                    <ToggleRight className="w-8 h-5 text-gold" />
                  ) : (
                    <ToggleLeft className="w-8 h-5 text-white/20" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create alert modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-[#12121A] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Nouvelle alerte</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5 text-white/40" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Carte</label>
                <input
                  type="text"
                  placeholder="Nom de la carte..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/40"
                />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Type d&apos;alerte</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(typeConfig).map(([key, config]) => (
                    <button
                      key={key}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-xs hover:border-gold/30 transition-colors`}
                    >
                      <config.icon className={`w-4 h-4 ${config.color}`} />
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Seuil</label>
                <input
                  type="number"
                  placeholder="Valeur..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/40"
                />
              </div>
              <button className="w-full py-2.5 bg-gold text-[#08080E] font-semibold rounded-lg hover:bg-gold-light transition-colors text-sm">
                Créer l&apos;alerte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
