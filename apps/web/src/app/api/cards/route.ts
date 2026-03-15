// ============================================================
// GET /api/cards — List tracked cards with filters
// POST /api/cards — Add a card to tracking
// ============================================================
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { mockCards } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const set = searchParams.get("set") || "";
  const rarity = searchParams.get("rarity") || "";
  const condition = searchParams.get("condition") || "";
  const sortBy = searchParams.get("sortBy") || "score";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If not authenticated, return mock data
    if (!user) {
      let filtered = [...mockCards];
      if (search) filtered = filtered.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.cardNumber.toLowerCase().includes(search.toLowerCase()));
      if (set) filtered = filtered.filter((c) => c.set === set);
      if (rarity) filtered = filtered.filter((c) => c.rarity === rarity);
      if (condition) filtered = filtered.filter((c) => c.condition === condition);

      filtered.sort((a, b) => {
        const aVal = a[sortBy as keyof typeof a] as number;
        const bVal = b[sortBy as keyof typeof b] as number;
        return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
      });

      return NextResponse.json({
        cards: filtered.slice(offset, offset + limit),
        total: filtered.length,
        hasMore: offset + limit < filtered.length,
      });
    }

    // Authenticated: query Supabase
    let query = supabase
      .from("tracked_cards")
      .select("*", { count: "exact" })
      .eq("user_id", user.id);

    if (search) query = query.ilike("card_name", `%${search}%`);
    if (set) query = query.eq("set_name", set);
    if (rarity) query = query.eq("rarity", rarity);
    if (condition) query = query.eq("condition", condition);

    const sortColumn = sortBy === "price" ? "price_cardmarket" : sortBy === "variation" ? "variation_7d" : "score";
    query = query.order(sortColumn, { ascending: sortOrder === "asc" }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      cards: data || [],
      total: count || 0,
      hasMore: (count || 0) > offset + limit,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const { data, error } = await supabase
      .from("tracked_cards")
      .insert({
        user_id: user.id,
        card_name: body.cardName,
        card_number: body.cardNumber,
        set_name: body.setName,
        set_code: body.setCode,
        rarity: body.rarity,
        condition: body.condition || "NM",
        image_url: body.imageUrl,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
