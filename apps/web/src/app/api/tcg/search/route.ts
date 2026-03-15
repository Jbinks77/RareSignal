import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const pageSize = searchParams.get("pageSize") ?? "20";
  const orderBy = searchParams.get("orderBy") ?? "-set.releaseDate";

  if (!q.trim()) {
    return NextResponse.json({ data: [], totalCount: 0 });
  }

  try {
    const url = new URL("https://api.pokemontcg.io/v2/cards");
    url.searchParams.set("q", q);
    url.searchParams.set("pageSize", pageSize);
    url.searchParams.set("orderBy", orderBy);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    // Clé API optionnelle (augmente le rate limit)
    if (process.env.POKEMONTCG_API_KEY) {
      headers["X-Api-Key"] = process.env.POKEMONTCG_API_KEY;
    }

    const res = await fetch(url.toString(), {
      headers,
      next: { revalidate: 300 }, // Cache 5 minutes
    });

    if (!res.ok) {
      throw new Error(`pokemontcg API error: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("TCG search error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la recherche", data: [] },
      { status: 500 }
    );
  }
}
