import { NextRequest, NextResponse } from "next/server";
import { LOCAL_PRICE_CACHE } from "@/lib/price-seed";

export const dynamic = "force-dynamic";

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

  // Base pour calculs de conditions (trendPrice = référence marché NM)
  const nmBase = trend ?? avg ?? avg30;
  if (!nmBase) return null;

  let condPrice: number;

  if (condition === "NM") {
    // lowPriceExPlus = moins chère annonce EX ou mieux = proxy "moins cher NM"
    condPrice = lowExPlus && lowExPlus > 0 ? lowExPlus : nmBase;

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

  const apiKey = process.env.POKEMONTCG_API_KEY;
  let fetchError: string | null = null;

  // ── Source 1 : pokemontcg.io (données Cardmarket EUR) ──────────────────────
  try {
    const tcgRes = await fetch(
      `https://api.pokemontcg.io/v2/cards/${encodeURIComponent(cardId)}`,
      {
        headers: apiKey ? { "X-Api-Key": apiKey } : {},
        cache: "no-store",
      }
    );

    if (!tcgRes.ok) {
      fetchError = `pokemontcg.io HTTP ${tcgRes.status}`;
    } else {
      const { data } = await tcgRes.json();
      const cmPrices = data?.cardmarket?.prices;
      if (cmPrices) {
        const price = extractCardmarketPrice(cmPrices, condition, language);
        return NextResponse.json({
          price,
          baseNMPrice: +(cmPrices.trendPrice ?? cmPrices.averageSellPrice ?? 0).toFixed(2),
          condition, language, currency: "EUR",
          source: "cardmarket_live",
          updatedAt: new Date().toISOString(),
          cardmarketRaw: {
            averageSellPrice: cmPrices.averageSellPrice,
            trendPrice: cmPrices.trendPrice,
            lowPrice: cmPrices.lowPrice,
            lowPriceExPlus: cmPrices.lowPriceExPlus,
            avg1: cmPrices.avg1, avg7: cmPrices.avg7, avg30: cmPrices.avg30,
          },
        });
      }
      fetchError = "no cardmarket prices in pokemontcg.io response";
    }
  } catch (err: any) {
    fetchError = err?.message ?? "pokemontcg.io fetch error";
  }

  // ── Source 2 : Scrydex (USD → EUR ~0.92, TCGPlayer) ───────────────────────
  if (apiKey) {
    try {
      const scrydexRes = await fetch(
        `https://api.scrydex.com/pokemon/v1/cards/${encodeURIComponent(cardId)}?include=prices`,
        {
          headers: {
            "X-Api-Key": apiKey,
            ...(process.env.SCRYDEX_TEAM_ID ? { "X-Team-ID": process.env.SCRYDEX_TEAM_ID } : {}),
          },
          cache: "no-store",
        }
      );

      if (scrydexRes.ok) {
        const scrydexData = await scrydexRes.json();
        // Scrydex retourne prices[] avec condition NM/LP/MP/HP/DM en USD
        const prices: Array<{ condition: string; type: string; market: number; low: number; currency: string }> =
          scrydexData?.prices ?? scrydexData?.data?.prices ?? [];

        // Mapper condition RareSignal → Scrydex
        const condMap: Record<string, string> = { NM: "NM", EX: "LP", LP: "MP", PO: "HP" };
        const targetCond = condMap[condition] ?? "NM";
        const rawPrice = prices.find(
          (p) => p.type === "raw" && p.condition === targetCond && p.currency === "USD"
        );

        if (rawPrice?.market) {
          const USD_TO_EUR = 0.92;
          const langMult = LANGUAGE_MULTIPLIERS[language] ?? 1.0;
          const price = +(rawPrice.market * USD_TO_EUR * langMult).toFixed(2);
          return NextResponse.json({
            price,
            baseNMPrice: +(rawPrice.market * USD_TO_EUR).toFixed(2),
            condition, language, currency: "EUR",
            source: "scrydex_usd",
            updatedAt: new Date().toISOString(),
          });
        }
      } else {
        fetchError = `${fetchError ?? ""} | Scrydex HTTP ${scrydexRes.status}`;
      }
    } catch (err: any) {
      fetchError = `${fetchError ?? ""} | Scrydex: ${err?.message}`;
    }
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
    fetchError,
    condition,
    language,
    updatedAt: new Date().toISOString(),
  });
}
