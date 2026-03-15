"use client";

import { useState } from "react";
import { ShoppingCart, ExternalLink, Clock, AlertTriangle, Package } from "lucide-react";
import { mockPreorders } from "@/lib/mock-data";

const stockColors = {
  "En stock": "text-emerald-400 bg-emerald-500/10",
  "Stock limité": "text-yellow-400 bg-yellow-500/10",
  "Rupture imminente": "text-red-400 bg-red-500/10",
};

export default function PreordersPage() {
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  const sources = ["Philibert", "UltraJeux", "Cardmarket"];
  const filtered = sourceFilter === "all"
    ? mockPreorders
    : mockPreorders.filter((p) => p.source === sourceFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Précommandes</h1>
        <p className="text-sm text-white/40 mt-1">
          Produits Pokémon TCG détectés en précommande
        </p>
      </div>

      {/* Source filters */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSourceFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            sourceFilter === "all" ? "bg-gold/15 text-gold" : "bg-white/5 text-white/40 hover:bg-white/10"
          }`}
        >
          Toutes les sources
        </button>
        {sources.map((s) => (
          <button
            key={s}
            onClick={() => setSourceFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              sourceFilter === s ? "bg-gold/15 text-gold" : "bg-white/5 text-white/40 hover:bg-white/10"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Preorder cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/10 transition-all group relative"
          >
            {product.isNew && (
              <div className="absolute top-3 right-3 z-10 px-2 py-0.5 bg-gold text-[#08080E] text-[10px] font-bold rounded-full">
                NOUVEAU
              </div>
            )}
            {/* Image placeholder */}
            <div className="h-40 bg-gradient-to-br from-violet/10 to-gold/10 flex items-center justify-center">
              <Package className="w-12 h-12 text-white/10" />
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold leading-tight group-hover:text-gold transition-colors">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet/10 text-violet">
                    {product.source}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${stockColors[product.stockEstimate]}`}>
                    {product.stockEstimate}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-gold">{product.price.toFixed(2)}€</p>
                <div className="text-right">
                  <p className="text-[10px] text-white/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Sortie {new Date(product.releaseDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <p className="text-[10px] text-white/25">
                  Détecté le {new Date(product.detectedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
                <button className="flex items-center gap-1 text-xs text-gold hover:text-gold-light transition-colors">
                  <ExternalLink className="w-3 h-3" />
                  Voir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
