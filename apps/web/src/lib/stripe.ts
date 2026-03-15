// ============================================================
// RareSignal — Stripe Configuration
// ============================================================
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as any,
  typescript: true,
});

// Plan definitions
export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "5 cartes suivies",
      "Alertes prix de base",
      "Historique 7 jours",
      "1 plateforme (Cardmarket)",
    ],
    limits: {
      trackedCards: 5,
      alerts: 3,
      historyDays: 7,
      platforms: 1,
      refreshRate: 3600, // 1h
    },
  },
  pro: {
    name: "Pro",
    price: 9.99,
    priceId: "price_pro_monthly", // Will be replaced with actual Stripe price ID
    features: [
      "50 cartes suivies",
      "Alertes illimitées",
      "Historique 90 jours",
      "3 plateformes",
      "Alertes précommandes",
      "Score de tendance IA",
    ],
    limits: {
      trackedCards: 50,
      alerts: -1, // unlimited
      historyDays: 90,
      platforms: 3,
      refreshRate: 900, // 15min
    },
  },
  expert: {
    name: "Expert",
    price: 24.99,
    priceId: "price_expert_monthly", // Will be replaced with actual Stripe price ID
    features: [
      "Cartes illimitées",
      "Alertes illimitées",
      "Historique illimité",
      "3 plateformes + API",
      "Alertes précommandes prioritaires",
      "Agent IA personnel",
      "Accès API REST",
      "Webhooks personnalisés",
    ],
    limits: {
      trackedCards: -1, // unlimited
      alerts: -1,
      historyDays: -1,
      platforms: 3,
      refreshRate: 300, // 5min
    },
  },
} as const;

export type PlanType = keyof typeof PLANS;
