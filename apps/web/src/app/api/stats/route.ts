// ============================================================
// GET /api/stats — Dashboard statistics
// ============================================================
import { NextResponse } from "next/server";
import { mockStats, mockCards, mockAlerts } from "@/lib/mock-data";

export async function GET() {
  // Calculate real stats from data
  const topGainers = [...mockCards]
    .sort((a, b) => b.variation7d - a.variation7d)
    .slice(0, 5)
    .map((c) => ({
      id: c.id,
      name: c.name,
      cardNumber: c.cardNumber,
      set: c.set,
      condition: c.condition,
      priceCardmarket: c.priceCardmarket,
      variation7d: c.variation7d,
      score: c.score,
    }));

  const topLosers = [...mockCards]
    .sort((a, b) => a.variation7d - b.variation7d)
    .slice(0, 5)
    .map((c) => ({
      id: c.id,
      name: c.name,
      cardNumber: c.cardNumber,
      set: c.set,
      condition: c.condition,
      priceCardmarket: c.priceCardmarket,
      variation7d: c.variation7d,
      score: c.score,
    }));

  const recentAlerts = mockAlerts
    .filter((a) => a.triggeredAt)
    .sort((a, b) => new Date(b.triggeredAt!).getTime() - new Date(a.triggeredAt!).getTime())
    .slice(0, 5);

  // Average market trend
  const avgVariation = mockCards.reduce((sum, c) => sum + c.variation7d, 0) / mockCards.length;

  return NextResponse.json({
    overview: {
      trackedCards: mockStats.trackedCards,
      activeAlerts: mockStats.activeAlerts,
      opportunities: mockStats.opportunitiesToday,
      marketTrend: +avgVariation.toFixed(1),
    },
    topGainers,
    topLosers,
    recentAlerts,
  });
}
