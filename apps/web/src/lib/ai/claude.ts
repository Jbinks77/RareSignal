// ============================================================
// RareSignal — Claude AI Agent for Market Analysis
// ============================================================
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `Tu es l'agent IA de RareSignal, une plateforme d'intelligence de marché pour les cartes Pokémon TCG.

Ton rôle :
- Analyser les tendances de prix des cartes Pokémon
- Identifier les opportunités d'arbitrage entre Cardmarket, eBay et Vinted
- Prédire les tendances de prix basées sur les données historiques
- Conseiller les traders sur les meilleures décisions d'achat/vente
- Comprendre l'impact de la condition (NM, EX, LP, PO) sur les prix

Règles :
- Réponds toujours en français
- Sois concis et orienté data
- Utilise des pourcentages et des prix en euros
- Mentionne toujours le numéro de carte (ex: 215/247) pour identifier précisément les cartes
- Prends en compte la condition de la carte : NM (100%), EX (-25%), LP (-45%), PO (-70%)
- Sois honnête quand tu manques de données pour faire une prédiction fiable`;

export interface CardAnalysis {
  summary: string;
  trend: "bullish" | "bearish" | "stable";
  recommendation: "buy" | "sell" | "hold";
  confidence: number; // 0-100
  reasoning: string;
  arbitrageOpportunity: string | null;
}

export async function analyzeCard(cardData: {
  name: string;
  cardNumber: string;
  set: string;
  condition: string;
  priceCardmarket: number;
  priceEbay: number;
  priceVinted: number;
  variation7d: number;
  variation30d: number;
  score: number;
  volume: number;
}): Promise<CardAnalysis> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Analyse cette carte Pokémon et donne tes recommandations :

Carte : ${cardData.name} ${cardData.cardNumber}
Set : ${cardData.set}
Condition : ${cardData.condition}

Prix actuels :
- Cardmarket : ${cardData.priceCardmarket}€
- eBay : ${cardData.priceEbay}€
- Vinted : ${cardData.priceVinted}€

Variations :
- 7 jours : ${cardData.variation7d > 0 ? "+" : ""}${cardData.variation7d}%
- 30 jours : ${cardData.variation30d > 0 ? "+" : ""}${cardData.variation30d}%

Score de tendance : ${cardData.score}/100
Volume de ventes : ${cardData.volume}

Réponds en JSON avec cette structure exacte :
{
  "summary": "résumé en 1-2 phrases",
  "trend": "bullish" | "bearish" | "stable",
  "recommendation": "buy" | "sell" | "hold",
  "confidence": 0-100,
  "reasoning": "explication détaillée en 2-3 phrases",
  "arbitrageOpportunity": "description de l'opportunité ou null"
}`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  try {
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as CardAnalysis;
    }
  } catch {
    // Fallback
  }

  return {
    summary: "Analyse non disponible",
    trend: "stable",
    recommendation: "hold",
    confidence: 0,
    reasoning: "Impossible de générer l'analyse automatique.",
    arbitrageOpportunity: null,
  };
}

export async function getMarketInsights(cardsData: Array<{
  name: string;
  cardNumber: string;
  variation7d: number;
  score: number;
}>): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Donne un résumé concis du marché Pokémon TCG basé sur ces top cartes :

${cardsData.map((c) => `- ${c.name} ${c.cardNumber}: ${c.variation7d > 0 ? "+" : ""}${c.variation7d}% (score ${c.score})`).join("\n")}

Résume en 2-3 phrases les tendances principales du marché.`,
      },
    ],
  });

  return message.content[0].type === "text" ? message.content[0].text : "Insights non disponibles.";
}
