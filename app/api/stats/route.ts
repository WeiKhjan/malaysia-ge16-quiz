import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const runtime = "edge";

// GET /api/stats?token=<ADMIN_TOKEN>&limit=200
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token =
    url.searchParams.get("token") ?? req.headers.get("x-admin-token");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const sb = getSupabase();
  if (!sb) {
    return NextResponse.json(
      { ok: false, error: "db_not_configured" },
      { status: 500 },
    );
  }

  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "100", 10), 1000);

  const [recent, totalRes] = await Promise.all([
    sb
      .from("submissions")
      .select(
        "created_at, source, country, state, state_code, city, lang, winner, percent, answers",
      )
      .order("created_at", { ascending: false })
      .limit(limit),
    sb.from("submissions").select("*", { count: "exact", head: true }),
  ]);

  if (recent.error) {
    return NextResponse.json(
      { ok: false, error: recent.error.message },
      { status: 500 },
    );
  }

  // Aggregate in JS (Supabase free tier: small enough volumes)
  const winners: Record<string, number> = {};
  const states: Record<string, number> = {};
  const sources: Record<string, number> = {};
  for (const r of recent.data ?? []) {
    winners[r.winner] = (winners[r.winner] ?? 0) + 1;
    if (r.state) states[r.state] = (states[r.state] ?? 0) + 1;
    sources[r.source] = (sources[r.source] ?? 0) + 1;
  }

  return NextResponse.json({
    ok: true,
    total: totalRes.count ?? 0,
    winners,
    states,
    sources,
    recent: recent.data,
  });
}
