// ============================================================
// GET /api/cards/:id — Get single card with price history
// DELETE /api/cards/:id — Remove from tracking
// ============================================================
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { mockCards, mockPriceHistories } from "@/lib/mock-data";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If not authenticated, return mock data
    if (!user) {
      const card = mockCards.find((c) => c.id === id);
      if (!card) return NextResponse.json({ error: "Carte introuvable" }, { status: 404 });

      return NextResponse.json({
        card,
        priceHistory: mockPriceHistories[id] || [],
      });
    }

    // Fetch from Supabase
    const { data: card, error } = await supabase
      .from("tracked_cards")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !card) {
      return NextResponse.json({ error: "Carte introuvable" }, { status: 404 });
    }

    const { data: priceHistory } = await supabase
      .from("price_history")
      .select("*")
      .eq("card_id", id)
      .order("date", { ascending: true });

    return NextResponse.json({
      card,
      priceHistory: priceHistory || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const { error } = await supabase
      .from("tracked_cards")
      .delete()
      .eq("id", params.id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
