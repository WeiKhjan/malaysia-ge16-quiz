import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { resolveMyState } from "@/lib/states";

export const runtime = "edge";

interface SubmitBody {
  answers: string[];
  winner: string;
  percent: { ph: number; bn: number; pn: number };
  lang: string;
  submissionId?: string;
  gps?: { lat: number; lng: number; accuracy?: number } | null;
}

async function reverseGeocodeGps(lat: number, lng: number) {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    const j = (await res.json()) as {
      countryCode?: string;
      principalSubdivision?: string;
      principalSubdivisionCode?: string;
      city?: string;
      locality?: string;
    };
    return {
      country: j.countryCode ?? null,
      state: j.principalSubdivision ?? null,
      stateCode: j.principalSubdivisionCode?.split("-")[1] ?? null,
      city: j.city || j.locality || null,
    };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  let body: SubmitBody;
  try {
    body = (await req.json()) as SubmitBody;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  if (
    !Array.isArray(body.answers) ||
    body.answers.length === 0 ||
    typeof body.winner !== "string" ||
    !body.percent
  ) {
    return NextResponse.json({ ok: false, error: "bad_payload" }, { status: 400 });
  }

  const ipRaw =
    req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
  const ip = ipRaw.split(",")[0].trim();
  const ua = req.headers.get("user-agent") || "";
  const ipCountry = req.headers.get("x-vercel-ip-country");
  const ipRegion = req.headers.get("x-vercel-ip-country-region");
  const ipCity = req.headers.get("x-vercel-ip-city");

  let source: "gps" | "ip" = "ip";
  let country: string | null = ipCountry;
  let state: string | null =
    ipCountry === "MY" ? resolveMyState(ipRegion) : null;
  let stateCode: string | null = ipRegion;
  let city: string | null = ipCity ? decodeURIComponent(ipCity) : null;
  let lat: number | null = null;
  let lng: number | null = null;

  if (
    body.gps &&
    typeof body.gps.lat === "number" &&
    typeof body.gps.lng === "number" &&
    Number.isFinite(body.gps.lat) &&
    Number.isFinite(body.gps.lng)
  ) {
    lat = body.gps.lat;
    lng = body.gps.lng;
    const geo = await reverseGeocodeGps(lat, lng);
    if (geo) {
      source = "gps";
      country = geo.country ?? country;
      state =
        geo.state ??
        (geo.country === "MY" ? resolveMyState(geo.stateCode) : null);
      stateCode = geo.stateCode ?? null;
      city = geo.city ?? city;
    }
  }

  const sql = getSql();
  if (!sql) {
    return NextResponse.json(
      { ok: false, error: "db_not_configured" },
      { status: 500 },
    );
  }

  try {
    await sql`
      insert into submissions
        (source, ip, country, state, state_code, city, lat, lng, lang,
         answers, winner, percent, submission_id, ua)
      values
        (${source}, ${ip}, ${country}, ${state}, ${stateCode}, ${city},
         ${lat}, ${lng}, ${body.lang ?? "en"},
         ${JSON.stringify(body.answers)}::jsonb,
         ${body.winner},
         ${JSON.stringify(body.percent)}::jsonb,
         ${body.submissionId ?? null}, ${ua})
    `;
  } catch (e) {
    console.error("neon insert error:", e);
    return NextResponse.json(
      { ok: false, error: "store_failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, source, state });
}
