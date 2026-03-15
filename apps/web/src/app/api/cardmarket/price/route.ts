import { NextRequest, NextResponse } from "next/server";
import { LOCAL_PRICE_CACHE } from "@/lib/price-seed";

// Multiplicateurs de langue (les prix pokemontcg.io sont agrégés toutes langues)
const LANGUAGE_MULTIPLIERS: Record<string, number> = {
  fr: 0.95, en: 1.00, de: 0.98, es: 0.92, it: 0.90, pt: 0.88, jp: 0.75, kr: 0.70,
};

// Extrait le vrai prix Cardmarket selon condition et langue
// Utilise les champs réels de l'API pokemontcg.io (sourceés de Cardmarket)
function extractCardmarketPrice(
  cmPrices: Record<string, number | null>,
  condition: string,
  language: string
): number | null {
  const avg = cmPrices.averageSellPrice;      // Prix moyen NM vendu sur Cardmarket
  const trend = cmPrices.trendPrice;          // Prix tendance Cardmarket
  const low = cmPrices.lowPrice;              // Annonce la moins chère (toutes conditions)
  const lowExPlus = cmPrices.lowPriceExPlus;  // Annonce la moins chère EX ou mieux
  const avg30 = cmPrices.avg30;               // Moyenne 30 jours

  // Référence NM
  const nmBase = avg ?? trend ?? avg30;
  if (!nmBase) return null;

  let condPrice: number;

  if (condition === "NM") {
    condPrice = nmBase;

  } else if (condition === "EX") {
    if (lowExPlus && lowExPlus > 0) {
      condPrice = Math.min((lowExPlus + nmBase * 0.80) / 2, nmBase * 0.85);
    } else {
      condPrice = nmBase * 0.75;
    }

  } else if (condition === "LP") {
    if (low && low > 0 && low < nmBase * 0.70) {
      condPrice = low;
    } else {
      condPrice = nmBase * 0.50;
    }

  } else { // PO
    if (low && low > 0) {
      condPrice = low * 0.50;
    } else {
      condPrice = nmBase * 0.20;
    }
  }

  const langMult = LANGUAGE_MULTIPLIERS[language] ?? 1.0;
  return +(condPrice * langMult).toFixed(2);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cardId = searchParams.get("cardId") ?? "";
  const condition = searchParams.get("condition") ?? "NM";
  const language = searchParams.get("language") ?? "fr";

  if (!cardId) {
    return NextResponse.json({ error: "cardId requis" }, { status: 400 });
  }

  try {
    const tcgRes = await fetch(
      `https://api.pokemontcg.io/v2/cards/${encodeURIComponent(cardId)}`,
      {
        headers: process.env.POKEMONTCG_API_KEY
          ? { "X-Api-Key": process.env.POKEMONTCG_API_KEY }
          : {},
        cache: "no-store",
      }
    );

    if (tcgRes.ok) {
      const { data } = await tcgRes.json();
      const cmPrices = data?.cardmarket?.prices;

      if (cmPrices) {
        const price = extractCardmarketPrice(cmPrices, condition, language);

        return NextResponse.json({
          price,
          baseNMPrice: +(cmPrices.averageSellPrice ?? cmPrices.trendPrice ?? 0).toFixed(2),
          condition,
          language,
          currency: "EUR",
          source: "cardmarket_live",
          updatedAt: new Date().toISOString(),
          // Données brutes Cardmarket pour debug/transparence
          cardmarketRaw: {
            averageSellPrice: cmPrices.averageSellPrice,
            trendPrice: cmPrices.trendPrice,
            lowPrice: cmPrices.lowPrice,
            lowPriceExPlus: cmPrices.lowPriceExPlus,
            avg1: cmPrices.avg1,
            avg7: cmPrices.avg7,
            avg30: cmPrices.avg30,
          },
        });
      }
    }
  } catch (err) {
    console.error("[cardmarket/price] pokemontcg.io inaccessible:", err);
  }

  // Fallback : cache local (prix Cardmarket NM de référence)
  const cachedNM = LOCAL_PRICE_CACHE[cardId];
  if (cachedNM) {
    const price = extractCardmarketPrice(
      { averageSellPrice: cachedNM, trendPrice: cachedNM, lowPrice: cachedNM * 0.5, lowPriceExPlus: cachedNM * 0.75, avg30: cachedNM },
      condition,
      language
    );
    return NextResponse.json({
      price,
      baseNMPrice: cachedNM,
      condition,
      language,
      currency: "EUR",
      source: "local_cache",
      updatedAt: new Date().toISOString(),
    });
  }

  // Pas de données disponibles
  return NextResponse.json({
    price: null,
    source: "unavailable",
    condition,
    language,
    updatedAt: new Date().toISOString(),
  });
}
