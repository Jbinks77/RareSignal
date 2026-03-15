// ============================================================
// POST /api/ai/analyze — Claude AI card analysis
// ============================================================
import { analyzeCard } from "@/lib/ai/claude";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const analysis = await analyzeCard(body);
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("AI analysis error:", error);
    return NextResponse.json(
      { error: "Erreur d'analyse IA", details: error.message },
      { status: 500 }
    );
  }
}
