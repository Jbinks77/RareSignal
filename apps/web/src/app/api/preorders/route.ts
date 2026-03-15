// ============================================================
// GET /api/preorders — List detected preorders
// ============================================================
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { mockPreorders } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || "";

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      let filtered = [...mockPreorders];
      if (source) filtered = filtered.filter((p) => p.source === source);
      return NextResponse.json({ preorders: filtered });
    }

    let query = supabase
      .from("preorders")
      .select("*")
      .order("detected_at", { ascending: false });

    if (source) query = query.eq("source", source);

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ preorders: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
