import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export const runtime = "edge";

// GET /api/stats?token=<ADMIN_TOKEN>&limit=200
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token =
    url.searchParams.get("token") ?? req.headers.get("x-admin-token");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const sql = getSql();
  if (!sql) {
    return NextResponse.json(
      { ok: false, error: "db_not_configured" },
      { status: 500 },
    );
  }

  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "100", 10), 1000);

  try {
    const [recent, totalRow, byWinner, byState, bySource] = await Promise.all([
      sql`
        select created_at, source, country, state, state_code, city, lat, lng,
               lang, winner, percent, answers
        from submissions
        order by created_at desc
        limit ${limit}
      `,
      sql`select count(*)::int as total from submissions`,
      sql`select winner, count(*)::int as n from submissions group by winner`,
      sql`
        select state, count(*)::int as n
        from submissions
        where state is not null
        group by state
        order by n desc
      `,
      sql`select source, count(*)::int as n from submissions group by source`,
    ]);

    const winners = Object.fromEntries(
      (byWinner as { winner: string; n: number }[]).map((r) => [r.winner, r.n]),
    );
    const states = Object.fromEntries(
      (byState as { state: string; n: number }[]).map((r) => [r.state, r.n]),
    );
    const sources = Object.fromEntries(
      (bySource as { source: string; n: number }[]).map((r) => [r.source, r.n]),
    );

    return NextResponse.json({
      ok: true,
      total: (totalRow as { total: number }[])[0]?.total ?? 0,
      winners,
      states,
      sources,
      recent,
    });
  } catch (e) {
    console.error("stats error:", e);
    return NextResponse.json(
      { ok: false, error: "query_failed" },
      { status: 500 },
    );
  }
}
