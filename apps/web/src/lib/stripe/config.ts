import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

export type PlanName = "free" | "pro" | "expert";

export interface PlanConfig {
  name: string;
  slug: PlanName;
  priceId: string | null;
  priceMonthly: number;
  features: string[];
}

export const plansConfig: Record<PlanName, PlanConfig> = {
  free: {
    name: "Free",
    slug: "free",
    priceId: null,
    priceMonthly: 0,
    features: [
      "5 tracked cards",
      "2 alerts",
      "Cardmarket prices only",
      "Weekly updates",
    ],
  },
  pro: {
    name: "Pro",
    slug: "pro",
    priceId: "price_pro_monthly",
    priceMonthly: 9.99,
    features: [
      "50 tracked cards",
      "Unlimited alerts",
      "3 platforms",
      "Real-time updates",
      "Arbitrage alerts",
      "Price predictions",
    ],
  },
  expert: {
    name: "Expert",
    slug: "expert",
    priceId: "price_expert_monthly",
    priceMonthly: 24.99,
    features: [
      "Unlimited cards",
      "Unlimited alerts",
      "3 platforms",
      "Real-time updates",
      "Arbitrage alerts",
      "AI agent",
      "API access",
      "Priority support",
    ],
  },
};
