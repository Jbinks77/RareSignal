// ============================================================
// GET /api/ai/insights — Market insights from Claude
// ============================================================
import { getMarketInsights } from "@/lib/ai/claude";
import { mockCards } from "@/lib/mock-data";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const topCards = [...mockCards]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((c) => ({
        name: c.name,
        cardNumber: c.cardNumber,
        variation7d: c.variation7d,
        score: c.score,
      }));

    const insights = await getMarketInsights(topCards);
    return NextResponse.json({ insights });
  } catch (error: any) {
    console.error("AI insights error:", error);
    return NextResponse.json(
      { error: "Erreur d'insights IA", details: error.message },
      { status: 500 }
    );
  }
}
