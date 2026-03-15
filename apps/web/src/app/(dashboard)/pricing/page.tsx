"use client";

import { Check, Crown, Zap, Star } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "0",
    period: "/mois",
    description: "Pour découvrir la plateforme",
    icon: Star,
    features: [
      "3 alertes maximum",
      "Classement top 10",
      "Données J-30 uniquement",
      "Notifications in-app",
    ],
    cta: "Plan actuel",
    disabled: true,
    popular: false,
  },
  {
    name: "Pro",
    price: "9,99",
    period: "/mois",
    description: "Pour les traders actifs",
    icon: Zap,
    features: [
      "Alertes illimitées",
      "Données temps réel",
      "Arbitrage Vinted/eBay",
      "Export CSV",
      "Graphiques avancés",
      "Historique 90 jours",
    ],
    cta: "Commencer l'essai",
    disabled: false,
    popular: true,
  },
  {
    name: "Expert",
    price: "24,99",
    period: "/mois",
    description: "Pour les professionnels",
    icon: Crown,
    features: [
      "Tout le plan Pro",
      "Accès API",
      "Alertes SMS",
      "Historique 1 an",
      "Chatbot IA illimité",
      "Support prioritaire",
      "Analyses IA avancées",
    ],
    cta: "Commencer l'essai",
    disabled: false,
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-3xl font-bold">
          Choisissez votre <span className="text-gold">plan</span>
        </h1>
        <p className="text-sm text-white/40 mt-2">
          Débloquez tout le potentiel de RareSignal pour maximiser vos investissements Pokémon
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white/[0.03] border rounded-2xl p-6 transition-all ${
              plan.popular
                ? "border-gold/30 gold-glow scale-[1.02]"
                : "border-white/[0.06] hover:border-white/10"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold text-[#08080E] text-[10px] font-bold rounded-full uppercase tracking-wider">
                Populaire
              </div>
            )}
            <div className="text-center mb-6">
              <div
                className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                  plan.popular ? "bg-gold/15" : "bg-white/5"
                }`}
              >
                <plan.icon
                  className={`w-6 h-6 ${plan.popular ? "text-gold" : "text-white/40"}`}
                />
              </div>
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <p className="text-xs text-white/40 mt-1">{plan.description}</p>
              <div className="mt-4">
                <span className="text-3xl font-bold">{plan.price}€</span>
                <span className="text-sm text-white/40">{plan.period}</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-white/70">
                  <Check
                    className={`w-4 h-4 flex-shrink-0 ${
                      plan.popular ? "text-gold" : "text-white/30"
                    }`}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              disabled={plan.disabled}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                plan.disabled
                  ? "bg-white/5 text-white/30 cursor-not-allowed"
                  : plan.popular
                  ? "bg-gold text-[#08080E] hover:bg-gold-light"
                  : "bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
