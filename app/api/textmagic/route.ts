import { NextRequest, NextResponse } from "next/server";

// Pass-through to TextMagic. We send TM creds from the client (your browser) once.
// This stays simple until we move to a server-stored secret.
export async function POST(req: NextRequest) {
  try {
    const { path, method = "GET", username, apiKey, qs, body } = await req.json();
    if (!username || !apiKey) return NextResponse.json({ ok: false, error: "Missing TextMagic creds" }, { status: 400 });
    const url = `https://rest.textmagic.com/api/v2/${path}${qs ? `?${new URLSearchParams(qs).toString()}` : ""}`;
    const r = await fetch(url, {
      method,
      headers: {
        "X-TM-Username": username,
        "X-TM-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: method === "GET" ? undefined : JSON.stringify(body || {}),
    });
    const j = await r.json();
    return NextResponse.json({ ok: r.ok, status: r.status, data: j });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}