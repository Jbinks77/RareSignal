import { type PlanName, plansConfig } from "./config";

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PlanDefinition {
  name: string;
  slug: PlanName;
  priceMonthly: number;
  priceId: string | null;
  features: PlanFeature[];
  popular?: boolean;
}

const allFeatures = [
  "Tracked cards",
  "Alerts",
  "Cardmarket prices",
  "3 platforms",
  "Weekly updates",
  "Real-time updates",
  "Arbitrage alerts",
  "Price predictions",
  "AI agent",
  "API access",
  "Priority support",
] as const;

export const plans: PlanDefinition[] = [
  {
    name: "Free",
    slug: "free",
    priceMonthly: 0,
    priceId: null,
    features: [
      { text: "5 tracked cards", included: true },
      { text: "2 alerts", included: true },
      { text: "Cardmarket prices only", included: true },
      { text: "3 platforms", included: false },
      { text: "Weekly updates", included: true },
      { text: "Real-time updates", included: false },
      { text: "Arbitrage alerts", included: false },
      { text: "Price predictions", included: false },
      { text: "AI agent", included: false },
      { text: "API access", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    name: "Pro",
    slug: "pro",
    priceMonthly: 9.99,
    priceId: "price_pro_monthly",
    popular: true,
    features: [
      { text: "50 tracked cards", included: true },
      { text: "Unlimited alerts", included: true },
      { text: "Cardmarket prices", included: true },
      { text: "3 platforms", included: true },
      { text: "Weekly updates", included: true },
      { text: "Real-time updates", included: true },
      { text: "Arbitrage alerts", included: true },
      { text: "Price predictions", included: true },
      { text: "AI agent", included: false },
      { text: "API access", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    name: "Expert",
    slug: "expert",
    priceMonthly: 24.99,
    priceId: "price_expert_monthly",
    features: [
      { text: "Unlimited cards", included: true },
      { text: "Unlimited alerts", included: true },
      { text: "Cardmarket prices", included: true },
      { text: "3 platforms", included: true },
      { text: "Weekly updates", included: true },
      { text: "Real-time updates", included: true },
      { text: "Arbitrage alerts", included: true },
      { text: "Price predictions", included: true },
      { text: "AI agent", included: true },
      { text: "API access", included: true },
      { text: "Priority support", included: true },
    ],
  },
];

export function getPlanBySlug(slug: PlanName): PlanDefinition | undefined {
  return plans.find((plan) => plan.slug === slug);
}

export function getPlanByPriceId(priceId: string): PlanDefinition | undefined {
  return plans.find((plan) => plan.priceId === priceId);
}
